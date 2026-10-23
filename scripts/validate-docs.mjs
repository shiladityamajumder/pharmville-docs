import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import MarkdownIt from 'markdown-it';
import GithubSlugger from 'github-slugger';

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, '..');
const md = new MarkdownIt({ html: true });
const ignored = new Set(['.git', 'node_modules', '.work', 'artifacts']);
const errors = [];
const report = { markdownFiles: 0, links: 0, tables: 0, diagrams: 0, parsed: 0, rendered: 0, features: 0, modules: 0, workflows: 0, apiOperations: 0, apiReferenceGaps: [], missingMappings: [], errors };
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => ignored.has(e.name) ? [] : e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
const allFiles = walk(root);
const files = allFiles.filter(p => p.endsWith('.md'));
const docs = new Map();
const rel = p => path.relative(root, p).split(path.sep).join('/');
const fail = (file, line, message) => errors.push(`${rel(file)}:${line}: ${message}`);
const diagramStart = /^\s*(?:flowchart\s+(?:TD|TB|BT|LR|RL)|graph\s+(?:TD|TB|BT|LR|RL)|sequenceDiagram\b|erDiagram\b|stateDiagram(?:-v2)?\b|classDiagram\b|journey\s*$|gantt\s*$|pie\b|mindmap\s*$|timeline\s*$|gitGraph\b|quadrantChart\b|requirementDiagram\b|C4Context\b|sankey-beta\b|xychart-beta\b)/;
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  const lines = source.split(/\r?\n/);
  const tokens = md.parse(source, {});
  const slugger = new GithubSlugger();
  const anchors = new Set();
  let lastLevel = 0, h1 = 0;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'heading_open') {
      const level = Number(token.tag.slice(1));
      const inline = tokens[i + 1];
      const title = inline.children.filter(t => ['text', 'code_inline', 'html_inline'].includes(t.type)).map(t => t.type === 'html_inline' ? t.content.replace(/<[^>]*>/g, '') : t.content).join('');
      anchors.add(slugger.slug(title));
      if (level === 1) h1++;
      if (level > lastLevel + 1) fail(file, token.map[0] + 1, 'heading skips a level');
      lastLevel = level;
    }
    if (token.type === 'fence') {
      if (token.info.trim() === 'mermaid') report.diagrams++;
      else if (diagramStart.test(token.content)) fail(file, token.map[0] + 1, 'diagram is not in a mermaid fence');
    }
    if (token.type === 'code_block' && diagramStart.test(token.content)) fail(file, token.map[0] + 1, 'indented Mermaid source');
    if (token.type === 'table_open') report.tables++;
  }
  if (!source.trim()) fail(file, 1, 'empty Markdown file');
  if (h1 !== 1) fail(file, 1, `expected one H1, found ${h1}`);
  let fence = null;
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^\s{0,3}(`{3,}|~{3,})(.*)$/);
    if (match) {
      if (!fence) fence = { char: match[1][0], length: match[1].length, line: i + 1 };
      else if (match[1][0] === fence.char && match[1].length >= fence.length && !match[2].trim()) fence = null;
      continue;
    }
    if (fence) continue;
    if (diagramStart.test(lines[i])) fail(file, i + 1, 'bare Mermaid source');
    if (/^Loading\s*$/.test(lines[i])) fail(file, i + 1, 'stray Loading artifact');
    if (/(?:[\w.-]+\.zip\b|[A-Z]:\\[^\s]*\\(?:Temp|attachments)\\)/i.test(lines[i])) fail(file, i + 1, 'old archive/upload path');
    if (lines[i].trim().startsWith('|')) {
      const width = s => s.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).length;
      const previous = i > 0 && lines[i - 1].trim().startsWith('|');
      if (!previous && !/^\s*\|(?:\s*:?-+:?\s*\|)+\s*$/.test(lines[i + 1] || '')) fail(file, i + 1, 'table header has no separator');
      if (previous && width(lines[i]) !== width(lines[i - 1])) fail(file, i + 1, 'table column count differs');
    }
  }
  if (fence) fail(file, fence.line, 'unclosed code fence');
  docs.set(file, { source, tokens, anchors });
}
report.markdownFiles = files.length;
for (const file of allFiles) {
  if (fs.statSync(file).size === 0 && !file.endsWith('.gitkeep')) fail(file, 1, 'unexpected empty file');
}
for (const [file, doc] of docs) {
  for (const token of doc.tokens) {
    for (const child of token.children || []) {
      if (!['link_open', 'image'].includes(child.type)) continue;
      const href = child.attrGet(child.type === 'image' ? 'src' : 'href');
      if (!href || /^(?:https?:|mailto:|tel:)/i.test(href)) continue;
      report.links++;
      if (/^[a-z]+:/i.test(href) || href.includes('\\')) { fail(file, token.map?.[0] + 1 || 1, `invalid relative URL: ${href}`); continue; }
      const [name, anchor] = href.split('#');
      const target = name ? path.resolve(path.dirname(file), decodeURIComponent(name.split('?')[0])) : file;
      if (target !== root && !target.startsWith(root + path.sep)) { fail(file, token.map?.[0] + 1 || 1, `link leaves checkout: ${href}`); continue; }
      if (!fs.existsSync(target)) fail(file, token.map?.[0] + 1 || 1, `missing link: ${href}`);
      else if (anchor && docs.has(target) && !docs.get(target).anchors.has(decodeURIComponent(anchor))) fail(file, token.map?.[0] + 1 || 1, `missing heading: ${href}`);
    }
  }
}
const inventory = docs.get(path.join(root, '01-Project/Features-and-Modules.md')).source;
const features = [...inventory.matchAll(/^\| `([A-Z]+-\d{2})` \| (\w+) \|[^\n]+$/gm)].map(m => ({ id: m[1], module: m[2] }));
report.features = features.length;
report.modules = new Set(features.map(f => f.module)).size;
if (new Set(features.map(f => f.id)).size !== features.length) errors.push('Duplicate feature definition in authoritative inventory');
const knownFeatures = new Set(features.map(f => f.id));
const testDefinitions = new Set([...docs].filter(([p]) => /03-Modules[\\/].*[\\/]LLD\.md$/.test(p)).flatMap(([, d]) => [...d.source.matchAll(/^\| `(TC-[A-Z]+-\d{2}-(?:OK|DENY|\d{2}))` \|/gm)].map(m => m[1])));
for (const [file, doc] of docs) {
  for (const m of doc.source.matchAll(/`([A-Z]{2,4}-\d{2})`/g)) if (!knownFeatures.has(m[1])) fail(file, 1, `unknown feature ID: ${m[1]}`);
  for (const m of doc.source.matchAll(/\bTC-[A-Z]+-\d{2}-(?:OK|DENY|\d{2})\b/g)) if (!testDefinitions.has(m[0])) fail(file, 1, `test reference has no LLD definition: ${m[0]}`);
}
const register = docs.get(path.join(root, '09-References/Coverage-and-Traceability.md')).source;
const registerRows = register.split('\n').filter(l => /^\| `[A-Z]+-\d{2}`/.test(l) && l.includes('[HLD]'));
if (registerRows.length !== features.length) errors.push('Traceability register has missing/duplicate feature rows');
for (const f of features) {
  const row = registerRows.filter(l => l.startsWith('| `' + f.id + '`'));
  const required = [`03-Modules/${f.module}/HLD.md`, `03-Modules/${f.module}/LLD.md`, `03-Modules/${f.module}/Edge-Cases.md`, '07-Engineering/Testing.md', '08-Development-Plan/Implementation-Plan.md'];
  for (const p of required) if (!docs.get(path.join(root, p))?.source.includes(f.id)) report.missingMappings.push(`${f.id}: ${p}`);
  if (row.length !== 1 || !row[0].includes('00-Business-Guide/') || !row[0].includes('04-Database/') || !row[0].includes('05-APIs/')) report.missingMappings.push(`${f.id}: register links`);
  const business = row[0]?.match(/\]\(\.\.\/(00-Business-Guide\/[^)]+)\)/)?.[1];
  if (!business || !docs.get(path.join(root, business))?.source.includes(f.id)) report.missingMappings.push(`${f.id}: business evidence`);
  const api = docs.get(path.join(root, `05-APIs/${f.module}.md`)).source;
  // This is the historical exact-ID mention metric, not an approval/completeness score.
  const requirementMentions = api;
  if (!new RegExp('(?<![A-Z0-9-])' + f.id + '(?![A-Z0-9-])').test(requirementMentions)) report.apiReferenceGaps.push(f.id);
  const edge = docs.get(path.join(root, `03-Modules/${f.module}/Edge-Cases.md`)).source;
  if (!new RegExp('TC-' + f.id + '-(?:DENY|\\d{2})').test(edge)) report.missingMappings.push(`${f.id}: named edge test`);
  if (!testDefinitions.has(`TC-${f.id}-OK`) && !testDefinitions.has(`TC-${f.id}-01`)) report.missingMappings.push(`${f.id}: normal test definition`);
}
for (const missing of report.missingMappings) errors.push('Missing feature mapping: ' + missing);
report.workflows = files.filter(p => /06-Workflows[\\/]WF-\d{3}-/.test(p)).length;
report.apiOperations = new Set([...docs].filter(([p]) => /05-APIs[\\/]/.test(p)).flatMap(([, d]) => [...d.source.matchAll(/\b(API-\d{3})\b/g)].map(m => m[1]))).size;
const diagrams = [...docs].flatMap(([file, d]) => d.tokens.filter(t => t.type === 'fence' && t.info.trim() === 'mermaid').map((t, i) => ({ file: rel(file), line: t.map[0] + 1, code: t.content, index: i })));
// Real Mermaid parsing runs in a browser, so DOM-dependent sanitization is also exercised.
let browser;
try {
  const { default: puppeteer } = await import('puppeteer');
  const options = { headless: true, args: process.platform === 'linux' ? ['--no-sandbox'] : [] };
  const candidates = [process.env.PUPPETEER_EXECUTABLE_PATH, ...(process.platform === 'win32' ? ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'] : ['/usr/bin/google-chrome', '/usr/bin/chromium'])].filter(Boolean);
  const executablePath = candidates.find(p => fs.existsSync(p));
  if (executablePath) options.executablePath = executablePath;
  browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 1000, deviceScaleFactor: 1 });
  await page.setContent('<html><head><style>body{margin:24px;background:white;font-family:Arial}</style></head><body></body></html>');
  const mermaidEntry = require.resolve('mermaid');
  await page.addScriptTag({ path: path.join(path.dirname(mermaidEntry), 'mermaid.min.js') });
  await page.evaluate(() => mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'default', flowchart: { htmlLabels: false }, sequence: { useMaxWidth: true } }));
  if (process.argv.includes('--render')) fs.mkdirSync(path.join(root, 'artifacts/diagrams'), { recursive: true });
  for (let i = 0; i < diagrams.length; i++) {
    const diagram = diagrams[i];
    try {
      await page.evaluate(async code => { await mermaid.parse(code); }, diagram.code);
      report.parsed++;
      if (process.argv.includes('--render')) {
        const svg = await page.evaluate(async ({ code, i }) => { const result = await mermaid.render('diagram' + i, code); document.body.innerHTML = result.svg; return result.svg; }, { code: diagram.code, i });
        const name = diagram.file.replace(/\.md$/, '').replaceAll('/', '--') + '-' + (diagram.index + 1);
        fs.writeFileSync(path.join(root, 'artifacts/diagrams', name + '.svg'), svg);
        await (await page.$('svg')).screenshot({ path: path.join(root, 'artifacts/diagrams', name + '.png') });
        report.rendered++;
      }
    } catch (error) { errors.push(`${diagram.file}:${diagram.line}: Mermaid ${error.message}`); }
  }
} catch (error) { errors.push('Mermaid parser/browser unavailable: ' + error.message); }
finally { if (browser) await browser.close(); }
fs.mkdirSync(path.join(root, 'artifacts'), { recursive: true });
fs.writeFileSync(path.join(root, 'artifacts/validation.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
process.exitCode = errors.length ? 1 : 0;

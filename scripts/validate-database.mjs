import {spawnSync} from 'node:child_process';
import path from 'node:path';
const result=spawnSync('python3',[path.join(import.meta.dirname,'validate-database.py'),...process.argv.slice(2)],{stdio:'inherit'});
if(result.error)throw result.error;
process.exitCode=result.status??1;

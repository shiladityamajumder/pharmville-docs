"""Catalog inspection for isolated blueprint validation; no ORM or application imports.

Source query lineage: archived database tests/schema_parity/catalog.py, expanded
with supporting object categories. A snapshot contains structural metadata only.
"""
from __future__ import annotations
import json
import subprocess
from pathlib import Path

SCHEMAS = ['appointment','catalog','clinical','commerce','compliance','customer','diagnostics','finance','fulfillment','identity','insurance','logistics','marketplace','membership','notification','organization','payment','platform','pricing','procurement','risk','search','support','warehouse']

def canonical_literal_array(expression: str) -> str:
    """Only normalize unbounded VARCHAR literal arrays cast to text by PostgreSQL.

    pg_dump/restore can distribute the array cast onto each literal. Preserve
    every value, ordering, predicate, collation and all other expression text.
    This shared SQL expression also runs in the generated deployment verifier.
    """
    return r"""(SELECT CASE WHEN m IS NULL THEN d ELSE
        replace(d,m[1],regexp_replace(regexp_replace(m[1],'\]::text\[\]$',']'),
          $literal$('(?:[^']|'')*')::character varying(?:::text)?$literal$,
          $replacement$\1::text$replacement$,'g')) END
        FROM (SELECT EXPRESSION AS d) definition
        CROSS JOIN LATERAL (SELECT regexp_match(d,
          $array$(ARRAY\[(?:'(?:[^']|'')*'::character varying(?:::text)?(?:, )?)+\](?:::text\[\])?)$array$) AS m) canonical)""".replace(
        "EXPRESSION", expression
    )

def catalog_queries() -> dict[str, str]:
    return {
        "extensions": """SELECT e.extname,jsonb_build_array(e.extversion,n.nspname)::text
            FROM pg_extension e JOIN pg_namespace n ON n.oid=e.extnamespace
            WHERE EXISTS(SELECT 1 FROM pg_namespace WHERE nspname=ANY(%s))""",
        "runtime_roles": """SELECT rolname,jsonb_build_array(rolsuper,rolbypassrls,rolcanlogin,rolinherit,rolcreatedb,rolcreaterole,rolreplication)::text
            FROM pg_roles WHERE rolname IN ('pharmville_customer_api','pharmville_staff_api','pharmville_reporting_worker','pharmville_integration_worker')
            AND EXISTS(SELECT 1 FROM pg_namespace WHERE nspname=ANY(%s))""",
        "grants": """WITH managed AS (SELECT oid FROM pg_namespace WHERE nspname=ANY(%s)),
            objects AS (
             SELECT 'schema' AS kind,n.nspname AS name,n.nspowner AS owner,n.nspacl AS acl,'n'::"char" AS acltype FROM pg_namespace n WHERE n.oid IN (SELECT oid FROM managed)
             UNION ALL SELECT 'relation',n.nspname||'.'||c.relname,c.relowner,c.relacl,CASE WHEN c.relkind='S' THEN 's'::"char" ELSE 'r'::"char" END FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.oid IN (SELECT oid FROM managed) AND c.relkind IN ('r','p','S','v','m')
             UNION ALL SELECT 'function',n.nspname||'.'||p.proname||'('||pg_get_function_identity_arguments(p.oid)||')',p.proowner,p.proacl,'f'::"char" FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.oid IN (SELECT oid FROM managed))
            SELECT o.kind||':'||o.name||':'||coalesce(r.rolname,'PUBLIC')||':'||a.privilege_type,jsonb_build_array(a.is_grantable)::text
            FROM objects o CROSS JOIN LATERAL aclexplode(coalesce(o.acl,acldefault(o.acltype,o.owner))) a LEFT JOIN pg_roles r ON r.oid=a.grantee WHERE a.grantee<>o.owner
            UNION ALL SELECT 'column:'||n.nspname||'.'||c.relname||'.'||att.attname||':'||coalesce(r.rolname,'PUBLIC')||':'||a.privilege_type,jsonb_build_array(a.is_grantable)::text FROM pg_attribute att JOIN pg_class c ON c.oid=att.attrelid JOIN pg_namespace n ON n.oid=c.relnamespace CROSS JOIN LATERAL aclexplode(att.attacl) a LEFT JOIN pg_roles r ON r.oid=a.grantee WHERE n.oid IN (SELECT oid FROM managed) AND a.grantee<>c.relowner
            UNION ALL SELECT 'default:'||n.nspname||':'||d.defaclobjtype::text||':'||coalesce(r.rolname,'PUBLIC')||':'||a.privilege_type,jsonb_build_array(a.is_grantable)::text FROM pg_default_acl d JOIN pg_namespace n ON n.oid=d.defaclnamespace CROSS JOIN LATERAL aclexplode(d.defaclacl) a LEFT JOIN pg_roles r ON r.oid=a.grantee WHERE n.oid IN (SELECT oid FROM managed) AND a.grantee<>d.defaclrole""",
        "default_privileges": """SELECT coalesce(n.nspname,'*')||'.'||d.defaclobjtype::text,
            jsonb_agg(jsonb_build_array(coalesce(r.rolname,'PUBLIC'),a.privilege_type,a.is_grantable) ORDER BY r.rolname,a.privilege_type)::text
            FROM pg_default_acl d LEFT JOIN pg_namespace n ON n.oid=d.defaclnamespace
            CROSS JOIN LATERAL aclexplode(d.defaclacl) a LEFT JOIN pg_roles r ON r.oid=a.grantee
            WHERE d.defaclrole=current_user::regrole::oid AND (d.defaclnamespace=0 OR n.nspname=ANY(%s))
            GROUP BY n.nspname,d.defaclobjtype""",
        "schemas": "SELECT nspname, '' FROM pg_namespace WHERE nspname = ANY(%s)",
        "tables": """SELECT n.nspname||'.'||c.relname,
            jsonb_build_array(c.relkind, c.relpersistence, c.relrowsecurity,
              c.relforcerowsecurity, c.reloptions, pg_get_partkeydef(c.oid))::text
            FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
            WHERE n.nspname=ANY(%s) AND c.relkind IN ('r','p','v','m','f')""",
        "sequences": """SELECT n.nspname||'.'||s.relname,
            jsonb_build_array(format_type(q.seqtypid,NULL),q.seqstart,q.seqincrement,q.seqmax,q.seqmin,q.seqcache,q.seqcycle,
              pn.nspname,pt.relname,a.attname,d.deptype)::text
            FROM pg_class s JOIN pg_namespace n ON n.oid=s.relnamespace JOIN pg_sequence q ON q.seqrelid=s.oid
            LEFT JOIN pg_depend d ON d.classid='pg_class'::regclass AND d.objid=s.oid AND d.deptype IN ('a','i') AND d.refobjsubid>0
            LEFT JOIN pg_class pt ON pt.oid=d.refobjid LEFT JOIN pg_namespace pn ON pn.oid=pt.relnamespace
            LEFT JOIN pg_attribute a ON a.attrelid=pt.oid AND a.attnum=d.refobjsubid
            WHERE n.nspname=ANY(%s) AND s.relkind='S'""",
        "views": """SELECT n.nspname||'.'||c.relname,
            jsonb_build_array(pg_get_viewdef(c.oid,true),c.relkind,c.reloptions)::text
            FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
            WHERE n.nspname=ANY(%s) AND c.relkind IN ('v','m')""",
        "columns": """SELECT n.nspname||'.'||c.relname||'.'||a.attname,
            jsonb_build_object('type',format_type(a.atttypid,a.atttypmod),
              'not_null',a.attnotnull,'default',pg_get_expr(d.adbin,d.adrelid),
              'identity',a.attidentity,'generated',a.attgenerated,
              'collation',co.collname)::text
            FROM pg_attribute a JOIN pg_class c ON c.oid=a.attrelid
            JOIN pg_namespace n ON n.oid=c.relnamespace
            LEFT JOIN pg_attrdef d ON d.adrelid=c.oid AND d.adnum=a.attnum
            LEFT JOIN pg_collation co ON co.oid=a.attcollation
            WHERE n.nspname=ANY(%s) AND c.relkind IN ('r','p')
              AND a.attnum>0 AND NOT a.attisdropped""",
        "constraints": """SELECT n.nspname||'.'||c.relname||'.'||k.conname,
            jsonb_build_array(k.contype,CONSTRAINT_DEFINITION,
              k.condeferrable,k.condeferred,k.convalidated,k.connoinherit)::text
            FROM pg_constraint k JOIN pg_class c ON c.oid=k.conrelid
            JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname=ANY(%s) AND k.contype<>'n'""".replace(
            "CONSTRAINT_DEFINITION", canonical_literal_array("pg_get_constraintdef(k.oid,true)")
        ),
        "indexes": """SELECT n.nspname||'.'||c.relname||'.'||i.relname,
            jsonb_build_array(INDEX_DEFINITION, x.indisvalid,
              x.indisready,x.indisunique,x.indnullsnotdistinct,
              i.reloptions,ts.spcname)::text
            FROM pg_index x JOIN pg_class c ON c.oid=x.indrelid
            JOIN pg_namespace n ON n.oid=c.relnamespace
            JOIN pg_class i ON i.oid=x.indexrelid
            LEFT JOIN pg_tablespace ts ON ts.oid=i.reltablespace
            WHERE n.nspname=ANY(%s)""".replace(
            "INDEX_DEFINITION", canonical_literal_array("pg_get_indexdef(x.indexrelid,0,true)")
        ),
        "policies": """SELECT schemaname||'.'||tablename||'.'||policyname,
            jsonb_build_array(permissive,roles,cmd,qual,with_check)::text
            FROM pg_policies WHERE schemaname=ANY(%s)""",
        "functions": """SELECT n.nspname||'.'||p.proname||'('||pg_get_function_identity_arguments(p.oid)||')',
            jsonb_build_array(replace(pg_get_functiondef(p.oid),chr(13)||chr(10),chr(10)), p.provolatile, p.prosecdef, p.proconfig)::text
            FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
            WHERE n.nspname=ANY(%s) AND p.prokind='f'""",
        "triggers": """SELECT n.nspname||'.'||c.relname||'.'||t.tgname,
            jsonb_build_array(pg_get_triggerdef(t.oid,true),t.tgenabled)::text
            FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid
            JOIN pg_namespace n ON n.oid=c.relnamespace
            WHERE n.nspname=ANY(%s) AND NOT t.tgisinternal""",
    }


def snapshot(psql: str, connection_args: list[str], database: str) -> dict:
    """Read only explicitly named schema objects through a caller-selected socket."""
    managed = "ARRAY[" + ",".join("'" + s + "'" for s in SCHEMAS) + "]::text[]"
    queries = catalog_queries()
    queries.update({
        "not_null_constraints": """SELECT n.nspname||'.'||c.relname||'.'||k.conname,
            jsonb_build_array(pg_get_constraintdef(k.oid,true),k.convalidated,k.connoinherit)::text
            FROM pg_constraint k JOIN pg_class c ON c.oid=k.conrelid
            JOIN pg_namespace n ON n.oid=c.relnamespace
            WHERE n.nspname=ANY(%s) AND k.contype='n'""",
        "types": """SELECT n.nspname||'.'||t.typname,
            jsonb_build_array(t.typtype,format_type(t.typbasetype,t.typtypmod),t.typnotnull,t.typdefault,
              t.typcategory,t.typdelim,t.typalign,t.typstorage,
              (SELECT jsonb_agg(e.enumlabel ORDER BY e.enumsortorder) FROM pg_enum e WHERE e.enumtypid=t.oid),
              (SELECT jsonb_build_array(format_type(r.rngsubtype,NULL),r.rngcanonical::regproc::text,r.rngsubdiff::regproc::text)
                 FROM pg_range r WHERE r.rngtypid=t.oid))::text
            FROM pg_type t JOIN pg_namespace n ON n.oid=t.typnamespace
            WHERE n.nspname=ANY(%s) AND t.typrelid=0 AND t.typelem=0""",
        "domain_constraints": """SELECT n.nspname||'.'||t.typname||'.'||k.conname,
            jsonb_build_array(pg_get_constraintdef(k.oid,true),k.convalidated)::text
            FROM pg_constraint k JOIN pg_type t ON t.oid=k.contypid JOIN pg_namespace n ON n.oid=t.typnamespace
            WHERE n.nspname=ANY(%s)""",
        "collations": """SELECT n.nspname||'.'||c.collname,
            jsonb_build_array(c.collprovider,c.collisdeterministic,c.collencoding,c.collcollate,c.collctype,c.collversion)::text
            FROM pg_collation c JOIN pg_namespace n ON n.oid=c.collnamespace WHERE n.nspname=ANY(%s)""",
        "procedures": """SELECT n.nspname||'.'||p.proname||'('||pg_get_function_identity_arguments(p.oid)||')',
            jsonb_build_array(pg_get_functiondef(p.oid),p.prosecdef,p.proconfig)::text
            FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname=ANY(%s) AND p.prokind='p'""",
        "rules": """SELECT n.nspname||'.'||c.relname||'.'||r.rulename,
            jsonb_build_array(pg_get_ruledef(r.oid,true),r.ev_enabled)::text
            FROM pg_rewrite r JOIN pg_class c ON c.oid=r.ev_class JOIN pg_namespace n ON n.oid=c.relnamespace
            WHERE n.nspname=ANY(%s) AND r.rulename<>'_RETURN'""",
        "statistics": """SELECT n.nspname||'.'||s.stxname,pg_get_statisticsobjdef(s.oid)
            FROM pg_statistic_ext s JOIN pg_namespace n ON n.oid=s.stxnamespace WHERE n.nspname=ANY(%s)""",
        "role_memberships": """SELECT role.rolname||':'||member.rolname,
            jsonb_build_array(m.admin_option,m.inherit_option,m.set_option)::text
            FROM pg_auth_members m JOIN pg_roles role ON role.oid=m.roleid JOIN pg_roles member ON member.oid=m.member
            WHERE (role.rolname LIKE 'pharmville_%' OR member.rolname LIKE 'pharmville_%')
              AND EXISTS(SELECT 1 FROM pg_namespace WHERE nspname=ANY(%s))""",
        "table_storage": """SELECT n.nspname||'.'||c.relname,
            jsonb_build_array(am.amname,c.relreplident,ts.spcname,c.reloptions)::text
            FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
            LEFT JOIN pg_am am ON am.oid=c.relam LEFT JOIN pg_tablespace ts ON ts.oid=c.reltablespace
            WHERE n.nspname=ANY(%s) AND c.relkind IN ('r','p','m')""",
    })
    result = {}
    for kind, query in queries.items():
        query = query.replace("%s", managed).strip().rstrip(";")
        wrapped = "SELECT coalesce(jsonb_object_agg(k,v),'{}'::jsonb)::text FROM (" + query + ") AS objects(k,v)"
        proc = subprocess.run([psql, "-X", "--no-password", "-v", "ON_ERROR_STOP=1", *connection_args, "-d", database, "-At", "-c", wrapped],
                              capture_output=True, text=True)
        if proc.returncode:
            raise RuntimeError(f"Catalog query {kind} failed: {proc.stderr[-2000:]}")
        result[kind] = json.loads(proc.stdout)
    return result


def differences(left: dict, right: dict) -> list[dict]:
    return [dict(category=kind, object=key, source=left.get(kind, {}).get(key),
                 fresh=right.get(kind, {}).get(key))
            for kind in sorted(set(left) | set(right))
            for key in sorted(set(left.get(kind, {})) | set(right.get(kind, {})))
            if left.get(kind, {}).get(key) != right.get(kind, {}).get(key)]


def table_register(catalog: dict) -> dict:
    """Derive the existing documentation/ERD register format from the full catalog."""
    result = {name: dict(columns={}, constraints={}, indexes={}, triggers={})
              for name in catalog["tables"]}
    for category in ("columns", "constraints", "indexes", "triggers"):
        for key, value in catalog[category].items():
            table, field = key.rsplit(".", 1)
            result[table][category][field] = value
    for table, definition in result.items():
        definition["pk"] = []
        for encoded in definition["constraints"].values():
            kind, sql, *_ = json.loads(encoded)
            if kind == "p":
                import re
                for column in re.search(r"\(([^)]+)\)", sql)[1].split(","):
                    name = column.strip().strip('"')
                    col = json.loads(definition["columns"][name])
                    definition["pk"].append(dict(column=name, type=col["type"].upper(), identity_always=col["identity"] == "a"))
        definition["public_uuid_column"] = "id" if json.loads(definition["columns"].get("id", "{}" )).get("type") == "uuid" else None
    return result

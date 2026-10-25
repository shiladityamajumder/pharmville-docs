#!/usr/bin/env python3
"""Validate route coverage and structural integrity of the proposed API spec."""

from __future__ import annotations

import json
import argparse
import datetime
import uuid
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
API_DIR = ROOT / "05-APIs"
SPEC_PATH = API_DIR / "openapi.yaml"
METHODS = {"get", "post", "put", "patch", "delete", "head", "options", "trace"}


def operation_inventory() -> dict[tuple[str, str], str]:
    found: dict[tuple[str, str], str] = {}
    registry = json.loads((ROOT / "03-Modules/Module-Registry.json").read_text())
    for module in registry:
        path = ROOT / "03-Modules" / module["directory"] / "APIs.md"
        source = path.read_text(encoding="utf-8")
        for match in re.finditer(r"^## ((?:API-\d{3}|ACC-ROUTE-\d{3})) — (GET|POST|PUT|PATCH|DELETE) `([^`]+)`", source, re.M):
            key = (match[2].lower(), match[3])
            if key in found:
                raise ValueError(f"Duplicate canonical contract: {key}")
            found[key] = match[1]
    return found


def resolve_ref(doc: dict, ref: str) -> bool:
    if not ref.startswith("#/"):
        return False
    value = doc
    for token in ref[2:].split("/"):
        token = token.replace("~1", "/").replace("~0", "~")
        if not isinstance(value, dict) or token not in value:
            return False
        value = value[token]
    return True


def schema_errors(doc: dict, schema: dict, value, location: str) -> list[str]:
    """Small JSON Schema subset used to catch mismatched checked-in examples."""
    if "$ref" in schema:
        target = doc
        for token in schema["$ref"][2:].split("/"):
            target = target[token.replace("~1", "/").replace("~0", "~")]
        return schema_errors(doc, target, value, location)
    errors: list[str] = []
    for branch in schema.get("allOf", []):
        errors.extend(schema_errors(doc, branch, value, location))
    if "oneOf" in schema and sum(not schema_errors(doc, branch, value, location) for branch in schema["oneOf"]) != 1:
        errors.append(f"{location}: value must match exactly one oneOf schema")
    if "anyOf" in schema and not any(not schema_errors(doc, branch, value, location) for branch in schema["anyOf"]):
        errors.append(f"{location}: value does not match any anyOf schema")
    if "not" in schema and not schema_errors(doc, schema["not"], value, location):
        errors.append(f"{location}: value matches forbidden schema")
    if "if" in schema:
        selected = "then" if not schema_errors(doc, schema["if"], value, location) else "else"
        if selected in schema: errors.extend(schema_errors(doc, schema[selected], value, location))
    if "const" in schema and value != schema["const"]:
        errors.append(f"{location}: expected constant {schema['const']!r}")
    if "enum" in schema and value not in schema["enum"]:
        errors.append(f"{location}: value {value!r} is outside enum")
    expected = schema.get("type")
    valid_types = expected if isinstance(expected, list) else ([expected] if expected else [])
    type_checks = {
        "object": lambda v: isinstance(v, dict), "array": lambda v: isinstance(v, list),
        "string": lambda v: isinstance(v, str), "integer": lambda v: isinstance(v, int) and not isinstance(v, bool),
        "number": lambda v: isinstance(v, (int, float)) and not isinstance(v, bool),
        "boolean": lambda v: isinstance(v, bool), "null": lambda v: v is None,
    }
    if valid_types and not any(type_checks[t](value) for t in valid_types if t in type_checks):
        errors.append(f"{location}: expected {valid_types}, got {type(value).__name__}")
        return errors
    if isinstance(value, str):
        if len(value) < schema.get("minLength", 0) or len(value) > schema.get("maxLength", float("inf")):
            errors.append(f"{location}: string length outside bounds")
        if "pattern" in schema and not re.search(schema["pattern"], value): errors.append(f"{location}: pattern mismatch")
        try:
            if schema.get("format") == "uuid": uuid.UUID(value)
            if schema.get("format") == "date-time":
                parsed = datetime.datetime.fromisoformat(value.replace("Z", "+00:00"))
                if parsed.tzinfo is None: raise ValueError("Missing timezone")
            if schema.get("format") == "date": datetime.date.fromisoformat(value)
        except ValueError: errors.append(f"{location}: invalid {schema['format']} format")
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        if value < schema.get("minimum", -float("inf")) or value > schema.get("maximum", float("inf")):
            errors.append(f"{location}: number outside bounds")
    if isinstance(value, list):
        if len(value) < schema.get("minItems", 0) or len(value) > schema.get("maxItems", float("inf")):
            errors.append(f"{location}: array length outside bounds")
        if schema.get("uniqueItems") and len({json.dumps(x, sort_keys=True) for x in value}) != len(value):
            errors.append(f"{location}: duplicate array items")
    if isinstance(value, dict):
        if len(value) < schema.get("minProperties", 0) or len(value) > schema.get("maxProperties", float("inf")):
            errors.append(f"{location}: object field count outside bounds")
        for field in schema.get("required", []):
            if field not in value:
                errors.append(f"{location}: missing required field {field}")
        for key, child in value.items():
            if key in schema.get("properties", {}):
                errors.extend(schema_errors(doc, schema["properties"][key], child, f"{location}.{key}"))
            elif schema.get("additionalProperties") is False:
                errors.append(f"{location}: unexpected field {key}")
    if isinstance(value, list) and "items" in schema:
        for index, child in enumerate(value):
            errors.extend(schema_errors(doc, schema["items"], child, f"{location}[{index}]"))
    return errors


def dereference(doc: dict, schema: dict) -> dict:
    """Resolve a local schema reference for the audit subset."""
    seen: set[str] = set()
    while isinstance(schema, dict) and isinstance(schema.get("$ref"), str):
        ref = schema["$ref"]
        if ref in seen or not resolve_ref(doc, ref):
            return {}
        seen.add(ref)
        target = doc
        for token in ref[2:].split("/"):
            target = target[token.replace("~1", "/").replace("~0", "~")]
        schema = target
    return schema if isinstance(schema, dict) else {}


def operation_data_schema(doc: dict, response: dict) -> dict | None:
    """Return a concrete success data schema, skipping the generic envelope."""
    schema = response.get("content", {}).get("application/json", {}).get("schema", {})
    branches = schema.get("allOf", []) if isinstance(schema, dict) else []
    for branch in branches or [schema]:
        resolved = dereference(doc, branch)
        data = resolved.get("properties", {}).get("data")
        if not isinstance(data, dict):
            continue
        concrete = dereference(doc, data)
        if concrete.get("type") == "array" and isinstance(concrete.get("items"), dict):
            concrete = dereference(doc, concrete["items"])
        if concrete.get("type") == "object" and concrete.get("properties"):
            return data
    return None


def has_example(content: dict) -> bool:
    return any(
        bool(media.get("examples") or "example" in media)
        for media in (content.get("content") or {}).values()
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--strict",
        action="store_true",
        help="fail when a documented operation still has generic or missing contract details",
    )
    args = parser.parse_args()
    errors: list[str] = []
    incomplete: list[str] = []
    audit = {
        "operations": 0,
        "request_body_operations": 0,
        "typed_request_schemas": 0,
        "request_examples": 0,
        "typed_success_data": 0,
        "success_examples": 0,
        "query_operations": 0,
        "generic_requests": 0,
        "generic_successes": 0,
    }
    spec = yaml.safe_load(SPEC_PATH.read_text(encoding="utf-8"))
    if spec.get("openapi") != "3.1.0":
        errors.append("OpenAPI version must be 3.1.0")
    documented = operation_inventory()
    actual: dict[tuple[str, str], str] = {}
    operation_ids: set[str] = set()
    spec_ids: set[str] = set()
    for route, methods in spec.get("paths", {}).items():
        for method, operation in methods.items():
            if method not in METHODS:
                continue
            key = (method, route)
            audit["operations"] += 1
            if key in actual:
                errors.append(f"duplicate method/path: {method.upper()} {route}")
            actual[key] = operation.get("operationId", "")
            operation_id = operation.get("operationId")
            if not operation_id:
                errors.append(f"missing operationId: {method.upper()} {route}")
            elif operation_id in operation_ids:
                errors.append(f"duplicate operationId: {operation_id}")
            operation_ids.add(operation_id)
            if "security" not in operation:
                errors.append(f"missing explicit security declaration: {method.upper()} {route}")
            tables = operation.get("x-database-tables")
            if not isinstance(tables, list) or not tables or not all(isinstance(table, str) and "." in table for table in tables):
                errors.append(f"missing or invalid x-database-tables mapping: {method.upper()} {route}")
            evidence = operation.get("x-database-evidence")
            if evidence != "Database-DTO-Mapping.md" or not (API_DIR / evidence).is_file():
                errors.append(f"missing database evidence reference: {method.upper()} {route}")
            elif not operation.get("x-database-evidence-status"):
                errors.append(f"missing database evidence status: {method.upper()} {route}")
            mapping_text = (API_DIR / "Database-DTO-Mapping.md").read_text(encoding="utf-8")
            for table in tables if isinstance(tables, list) else []:
                schema_name, separator, table_name = table.partition(".")
                table_doc = ROOT / "04-Database" / "Tables" / schema_name / f"{table_name}.md"
                if not separator or not table_doc.is_file():
                    errors.append(f"database table page does not exist for {table!r}: {method.upper()} {route}")
                if table not in mapping_text:
                    errors.append(f"database mapping ledger does not mention {table}: {method.upper()} {route}")
            if method not in {"get", "delete"} and "requestBody" not in operation:
                errors.append(f"missing requestBody: {method.upper()} {route}")
            request_body = operation.get("requestBody", {})
            if request_body:
                audit["request_body_operations"] += 1
                request_is_typed = False
                for media, body in request_body.get("content", {}).items():
                    request_schema = body.get("schema", {})
                    resolved_schema = dereference(spec, request_schema)
                    if resolved_schema.get("type") == "object" and resolved_schema.get("properties"):
                        request_is_typed = True
                    if "schema" not in body:
                        errors.append(f"missing request schema for {media}: {method.upper()} {route}")
                if request_is_typed:
                    audit["typed_request_schemas"] += 1
                else:
                    audit["generic_requests"] += 1
                    incomplete.append(f"generic/untyped request DTO: {method.upper()} {route}")
                if has_example(request_body):
                    audit["request_examples"] += 1
                else:
                    incomplete.append(f"missing request example: {method.upper()} {route}")
            parameters = operation.get("parameters", [])
            path_names = set(re.findall(r"{([^}]+)}", route))
            declared_path_names = set()
            query_names = set()
            for parameter in parameters:
                if "$ref" in parameter:
                    target = parameter["$ref"]
                    if resolve_ref(spec, target):
                        resolved = spec
                        for token in target[2:].split("/"):
                            resolved = resolved[token.replace("~1", "/").replace("~0", "~")]
                        parameter = resolved
                if parameter.get("in") == "path":
                    declared_path_names.add(parameter.get("name"))
                if parameter.get("in") == "query":
                    query_names.add(parameter.get("name"))
            if path_names != declared_path_names:
                errors.append(
                    f"path parameter mismatch: {method.upper()} {route}; "
                    f"template={sorted(path_names)}, declared={sorted(declared_path_names)}"
                )
            if query_names:
                audit["query_operations"] += 1
            if method == "get":
                query_status = operation.get("x-query-applicability")
                if query_names and query_status != "parameters":
                    errors.append(f"query parameters lack applicability marker: GET {route}")
                elif not query_names and query_status != "not-applicable":
                    incomplete.append(f"GET query applicability is not resolved: {route}")
                pagination_strategy = operation.get("x-pagination-strategy")
                if pagination_strategy not in {"offset", "cursor", "none"}:
                    errors.append(f"missing/invalid pagination strategy: GET {route}")
                if pagination_strategy == "cursor" and "cursor" not in query_names:
                    errors.append(f"cursor pagination requires a cursor query parameter: GET {route}")
                if pagination_strategy == "offset" and "offset" not in query_names:
                    errors.append(f"offset pagination requires an offset query parameter: GET {route}")
            for media, body in operation.get("requestBody", {}).get("content", {}).items():
                if "schema" not in body:
                    errors.append(f"missing request schema for {media}: {method.upper()} {route}")
            if not any(str(code).startswith("2") for code in operation.get("responses", {})):
                errors.append(f"missing success response: {method.upper()} {route}")
            for response_code, response in operation.get("responses", {}).items():
                if str(response_code) in {"204", "304"} and response.get("content"):
                    errors.append(f"HTTP {response_code} must not declare a response body: {method.upper()} {route}")
                for media, body in response.get("content", {}).items():
                    if "schema" not in body:
                        errors.append(f"missing response schema {response_code}/{media}: {method.upper()} {route}")
                    if str(response_code).startswith(("4", "5")):
                        schema = body.get("schema", {})
                        if schema.get("$ref") != "#/components/schemas/ErrorEnvelope":
                            errors.append(f"error response does not use ErrorEnvelope: {response_code} {method.upper()} {route}")
            api_id = operation.get("x-api-id")
            if api_id:
                spec_ids.add(api_id)
            def visit(value):
                if isinstance(value, dict):
                    ref = value.get("$ref")
                    if ref and not resolve_ref(spec, ref):
                        errors.append(f"unresolved reference {ref} in {method.upper()} {route}")
                    for child in value.values():
                        visit(child)
                elif isinstance(value, list):
                    for child in value:
                        visit(child)
            visit(operation)
            for media, content in operation.get("requestBody", {}).get("content", {}).items():
                request_schema = content.get("schema", {})
                for example_name, example in content.get("examples", {}).items():
                    if "value" in example:
                        errors.extend(schema_errors(spec, request_schema, example["value"], f"{method.upper()} {route} request example {example_name}"))
            for response_code, response in operation.get("responses", {}).items():
                for media, content in response.get("content", {}).items():
                    response_schema = content.get("schema", {})
                    for example_name, example in content.get("examples", {}).items():
                        if "value" in example:
                            errors.extend(schema_errors(spec, response_schema, example["value"], f"{method.upper()} {route} response {response_code} example {example_name}"))
            success_responses = [
                response for code, response in operation.get("responses", {}).items()
                if str(code).startswith("2") and response.get("content", {}).get("application/json")
            ]
            typed_data = any(operation_data_schema(spec, response) is not None for response in success_responses)
            if typed_data:
                audit["typed_success_data"] += 1
            elif success_responses:
                audit["generic_successes"] += 1
                incomplete.append(f"missing operation-specific success data DTO: {method.upper()} {route}")
            if success_responses and any(has_example(response) for response in success_responses):
                audit["success_examples"] += 1
            elif success_responses:
                incomplete.append(f"missing success example: {method.upper()} {route}")
    for route in sorted(set(documented) - set(actual)):
        errors.append(f"Markdown operation missing from OpenAPI: {route[0].upper()} {route[1]}")
    for route in sorted(set(actual) - set(documented)):
        errors.append(f"OpenAPI operation missing from Markdown: {route[0].upper()} {route[1]}")
    missing_ids = {f"API-{n:03}" for n in range(1, 98)} - spec_ids
    if missing_ids:
        errors.append("historical API IDs missing from OpenAPI: " + ", ".join(sorted(missing_ids)))
    schemas = spec.get("components", {}).get("schemas", {})
    for required in ("SuccessEnvelope", "ErrorEnvelope", "ResponseMeta", "ErrorBody"):
        if required not in schemas:
            errors.append(f"missing shared schema: {required}")
    def visit_all_refs(value, location="OpenAPI document"):
        if isinstance(value, dict):
            ref = value.get("$ref")
            if ref and not resolve_ref(spec, ref):
                errors.append(f"unresolved reference {ref} in {location}")
            for key, child in value.items():
                visit_all_refs(child, f"{location}.{key}")
        elif isinstance(value, list):
            for index, child in enumerate(value):
                visit_all_refs(child, f"{location}[{index}]")
    visit_all_refs(spec)
    coverage_text = (API_DIR / "API-Contract-Coverage.md").read_text(encoding="utf-8")
    for route, api_id in documented.items():
        if api_id not in coverage_text:
            errors.append(f"coverage ledger missing operation reference {api_id}: {route[0].upper()} {route[1]}")
    # Every fenced JSON example in the API markdown must at least parse.
    for doc_path in [*API_DIR.glob("*.md"), *(ROOT / "03-Modules").glob("*/APIs.md")]:
        text = doc_path.read_text(encoding="utf-8")
        for index, block in enumerate(re.findall(r"```json\s*\n(.*?)\n```", text, re.S), 1):
            try:
                json.loads(block)
            except json.JSONDecodeError as exc:
                errors.append(f"invalid JSON example {doc_path.name} #{index}: {exc}")
    if errors:
        print("API contract validation FAILED")
        print("\n".join(f"- {error}" for error in errors))
        return 1
    historical_ids = {api_id for api_id in spec_ids if re.fullmatch(r"API-\d{3}", api_id)}
    additional_refs = len(spec_ids - historical_ids)
    print(f"API contract structure passed: {len(actual)} method/path operations, {len(historical_ids)} numbered API IDs (original API-001–097 preserved), {additional_refs} additional references, {len(operation_ids)} unique operationIds.")
    print("JSON code examples parse. Note: this structural check does not establish DTO approval or runtime behavior.")
    print(
        "Contract completeness audit: "
        f"{audit['typed_request_schemas']}/{audit['request_body_operations']} request schemas typed, "
        f"{audit['typed_success_data']} operation-specific success DTOs, "
        f"{audit['request_examples']}/{audit['request_body_operations']} request examples, "
        f"{audit['success_examples']} success examples, "
        f"{audit['query_operations']} operations with query parameters; "
        f"{len(incomplete)} structural schema findings."
    )
    planning_status = {status: sum(o.get("x-documentation-status") == status for methods in spec["paths"].values() for method, o in methods.items() if method in METHODS) for status in ["complete-proposed", "incomplete"]}
    print(f"Planning ledger: {planning_status['complete-proposed']} complete proposed, {planning_status['incomplete']} semantically incomplete; approval and implementation remain separate.")
    if args.strict and incomplete:
        print("Strict completeness check FAILED")
        print("\n".join(f"- {finding}" for finding in incomplete))
        return 1
    if incomplete:
        print("Use --strict to fail on incomplete contract details; the coverage ledger records these as blockers.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

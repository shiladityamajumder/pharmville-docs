#!/usr/bin/env python3
"""Validate route coverage and structural integrity of the proposed API spec."""

from __future__ import annotations

import json
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
    for path in API_DIR.glob("*.md"):
        if path.name in {"README.md", "Critical-Operation-Contracts.md"}:
            continue
        source = path.read_text(encoding="utf-8")
        for match in re.finditer(r"^## API-(\d{3}) — (GET|POST|PUT|PATCH|DELETE) `([^`]+)`", source, re.M):
            found[(match.group(2).lower(), match.group(3))] = f"API-{match.group(1)}"
        if path.name == "Customer_Accounts.md":
            for api_id, title, method, route in [
                ("API-001", "Request OTP", "post", "/v1/auth/customer/otp/request"),
                ("API-002", "Verify OTP", "post", "/v1/auth/customer/otp/verify"),
                ("API-003", "Read profile", "get", "/v1/me"),
                ("API-004", "Update profile", "patch", "/v1/me"),
            ]:
                found[(method, route)] = api_id
            for api_id, method, route in [
                ("API-005", "get", "/v1/me/addresses"),
                ("API-006", "post", "/v1/me/addresses"),
                ("API-007", "get", "/v1/me/patients"),
                ("API-008", "post", "/v1/me/patients"),
                ("API-009", "post", "/v1/me/consents"),
            ]:
                found[(method, route)] = api_id
            for method, route in re.findall(r"`(GET|POST|PUT|PATCH|DELETE) (/v1/me/[^`]+)`", source):
                key = (method.lower(), route)
                if key not in found:
                    found[key] = "ACC-ROUTE"
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
    if "oneOf" in schema and not any(not schema_errors(doc, branch, value, location) for branch in schema["oneOf"]):
        errors.append(f"{location}: value does not match any oneOf schema")
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
    if isinstance(value, dict):
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


def main() -> int:
    errors: list[str] = []
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
            for media, body in operation.get("requestBody", {}).get("content", {}).items():
                if "schema" not in body:
                    errors.append(f"missing request schema for {media}: {method.upper()} {route}")
            if not any(str(code).startswith("2") for code in operation.get("responses", {})):
                errors.append(f"missing success response: {method.upper()} {route}")
            for response_code, response in operation.get("responses", {}).items():
                for media, body in response.get("content", {}).items():
                    if "schema" not in body:
                        errors.append(f"missing response schema {response_code}/{media}: {method.upper()} {route}")
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
    # Every fenced JSON example in the API markdown must at least parse.
    for doc_path in API_DIR.glob("*.md"):
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
    print(f"API contract structure passed: {len(actual)} method/path operations, {len(historical_ids)} historical API IDs, {additional_refs} additional references, {len(operation_ids)} unique operationIds.")
    print("JSON code examples parse. Note: this structural check does not establish DTO approval or runtime behavior.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

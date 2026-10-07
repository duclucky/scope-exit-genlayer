"""Load pure contract functions from its AST, not a parallel implementation."""
import ast
import json
from pathlib import Path


def functions():
    tree = ast.parse(Path("contracts/scope_exit.py").read_text("ascii"))
    names = {"_normalize_llm", "_valid_result", "_same_meaning"}
    constants = {"RELATIONS", "RETRY_REASONS"}
    selected = [n for n in tree.body
                if isinstance(n, ast.FunctionDef) and n.name in names
                or isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id in constants
                                                    for t in n.targets)]
    namespace = {"json": json}
    exec(compile(ast.Module(body=selected, type_ignores=[]), "contract-pure-functions", "exec"), namespace)
    return namespace

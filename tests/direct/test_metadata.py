import ast
import importlib.util
from pathlib import Path
from genvm_linter.lint import safety


def test_ascii_version_exact_one_recognized_contract_and_payable_metadata():
    source = Path("contracts/scope_exit.py").read_bytes()
    assert source.isascii()
    assert source.startswith(b'# v0.3.0\n# { "Depends": "py-genlayer:5jycge4q8k23462jtb0b9fyey1s9qz928sz2nbrd9mg4sxqg2qng" }')
    tree = ast.parse(source)
    contracts = [n for n in tree.body if isinstance(n, ast.ClassDef)
                 and any(ast.unparse(b) == "gl.contract.Contract" for b in n.bases)]
    assert [c.name for c in contracts] == ["ScopeExit"]
    writes = {m.name: [ast.unparse(d) for d in m.decorator_list]
              for m in contracts[0].body if isinstance(m, ast.FunctionDef)
              and any(ast.unparse(d).startswith("gl.public.write") for d in m.decorator_list)}
    assert len(writes) == 9
    assert [name for name, decorators in writes.items() if "gl.public.write.payable" in decorators] == ["accept_offer"]
    assert "gl.chain.Account" not in source.decode()
    withdraw = next(m for m in contracts[0].body if isinstance(m, ast.FunctionDef) and m.name == "withdraw")
    assert ast.unparse(withdraw.body[-1]).startswith("Recipient(recipient).emit_transfer(value=amount)")


def test_linter_extension_keeps_negative_rules_enabled():
    spec = importlib.util.spec_from_file_location("v03_lint", "scripts/genvm_lint.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    module.enable_v03()
    unguarded = 'def bad():\n    return gl.nondet.exec_prompt("x")\n'
    assert any(w.code == "E010" for w in safety.check_safety(unguarded))
    nested = ('def write():\n    def leader():\n'
              '        return gl.vm.run_nondet_default(lambda: 1, lambda x: True)\n'
              '    return gl.vm.run_nondet_default(leader, lambda x: True)\n')
    assert any(w.code == "E025" for w in safety.check_safety(nested))

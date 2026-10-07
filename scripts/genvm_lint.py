"""Run official lint/check with the documented v0.3 nondet entrypoint.

The pinned upstream AST table predates run_nondet_default. Extend BOTH its
safe-entry and nested-spawn tables in memory. No diagnostics are suppressed,
no installed package is edited, and SDK semantic validation is unchanged.
"""
from genvm_linter.lint import safety


def enable_v03():
    safety.SafeEntryPointFinder.SAFE_PATTERNS["gl.vm.run_nondet_default"] = [0, 1]
    safety.NONDET_SPAWN_CALLS = safety.NONDET_SPAWN_CALLS | {"gl.vm.run_nondet_default"}


if __name__ == "__main__":
    enable_v03()
    from genvm_linter.cli import main
    main()

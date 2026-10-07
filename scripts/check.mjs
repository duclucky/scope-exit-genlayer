import { spawnSync } from 'node:child_process';
const windows = process.platform === 'win32';
const python = windows ? '.venv/Scripts/python.exe' : '.venv/bin/python';
const env = { ...process.env, PYTHONUTF8: '1', GENVM_VERSION: 'v0.6.0-rc8' };
function run(command, args, shell = false) {
  const result = spawnSync(command, args, { stdio: 'inherit', env, shell });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
run(python, ['scripts/genvm_lint.py', 'check', 'contracts/scope_exit.py']);
run(python, ['scripts/cache_reference.py']);
run(python, ['-m', 'pytest', 'tests/direct', '-q', '--tb=short']);
run(python, ['scripts/run_glsim_tests.py']);
run(process.execPath, ['--test', 'tests/tooling/receipt.test.mjs']);
run(windows ? 'npm.cmd' : 'npm', ['--prefix', 'frontend', 'test'], windows);
run(windows ? 'npm.cmd' : 'npm', ['--prefix', 'frontend', 'run', 'build'], windows);

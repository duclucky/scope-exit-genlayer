"""Run real fluent RPC integration; its fixture owns and stops isolated GLSim."""
import os
import subprocess
import sys
result = subprocess.run([sys.executable, "-m", "pytest", "tests/integration", "-v", "-s", "--tb=short"],
                        env=dict(os.environ, PYTHONUTF8="1", GENVM_VERSION="v0.6.0-rc8"))
sys.exit(result.returncode)

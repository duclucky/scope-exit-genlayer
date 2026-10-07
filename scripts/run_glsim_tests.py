"""Run a bounded local-only RPC integration server, then always stop it."""
import os
import subprocess
import sys
import time
from urllib.request import urlopen

server = subprocess.Popen([sys.executable, "scripts/glsim_server.py"],
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                          env=dict(os.environ, PYTHONUTF8="1", GENVM_VERSION="v0.6.0-rc8"))
try:
    for _ in range(100):
        if server.poll() is not None:
            raise SystemExit("Isolated GLSim server exited before startup")
        try:
            with urlopen("http://127.0.0.1:4193/health", timeout=1) as response:
                if response.status == 200:
                    break
        except OSError:
            time.sleep(0.1)
    else:
        raise SystemExit("Isolated GLSim startup timed out")
    result = subprocess.run([sys.executable, "-m", "pytest", "tests/integration", "-v", "-s", "--tb=short"],
                            env=dict(os.environ, PYTHONUTF8="1", GENVM_VERSION="v0.6.0-rc8"))
finally:
    server.terminate()
    server.wait(timeout=10)
sys.exit(result.returncode)

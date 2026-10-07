"""Own the isolated mock-only server for pytest and the official gltest CLI."""
import os
import subprocess
import sys
import time
from pathlib import Path
from urllib.request import urlopen
import pytest


@pytest.fixture(scope="session", autouse=True)
def isolated_glsim():
    root = Path(__file__).resolve().parents[2]
    try:
        with urlopen("http://127.0.0.1:4193/health", timeout=1):
            pytest.fail("Port 4193 already has a server; refuse to use or stop an unowned service")
    except OSError:
        pass
    server = subprocess.Popen([sys.executable, "scripts/glsim_server.py"], cwd=root,
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        env=dict(os.environ, PYTHONUTF8="1", GENVM_VERSION="v0.6.0-rc8"))
    try:
        for _ in range(100):
            if server.poll() is not None:
                pytest.fail("Isolated GLSim server exited before startup")
            try:
                with urlopen("http://127.0.0.1:4193/health", timeout=1) as response:
                    if response.status == 200:
                        break
            except OSError:
                time.sleep(0.1)
        else:
            pytest.fail("Isolated GLSim startup timed out")
        yield
    finally:
        server.terminate()
        server.wait(timeout=10)

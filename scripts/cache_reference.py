"""Cache exact official vocabulary bytes locally for deterministic direct tests."""
import hashlib
from pathlib import Path
from urllib.request import Request, urlopen

URL = "https://www.w3.org/TR/2018/REC-odrl-model-20180215/"
DIGEST = "af187a2c26b2429a579039403f34d9a5d5f29a1e01019662043068fa1ca2beaa"
path = Path(".codex/reference-cache.bin")
if not path.exists():
    with urlopen(Request(URL, headers={"User-Agent": "ScopeExit-reference-test/1"}), timeout=30) as response:
        body = response.read(300001)
    if hashlib.sha256(body).hexdigest() != DIGEST:
        raise SystemExit("Official reference differs from locked digest; no test cache created")
    path.parent.mkdir(exist_ok=True)
    path.write_bytes(body)
assert hashlib.sha256(path.read_bytes()).hexdigest() == DIGEST
print("Reference cache: exact locked digest verified")

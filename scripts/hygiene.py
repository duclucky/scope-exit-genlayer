"""Audit this child repo's staged/tracked/history paths and configured secrets."""
import json
import re
import subprocess
from pathlib import Path
from dotenv import dotenv_values

root = Path(__file__).resolve().parent.parent
def git(*args):
    return subprocess.check_output(["git", *args], cwd=root, text=True, encoding="utf-8").strip()
assert Path(git("rev-parse", "--show-toplevel")).resolve() == root
paths = git("ls-files").splitlines()
staged = git("diff", "--cached", "--name-only").splitlines()
forbidden = {"AGENTS.md", "CLAUDE.md", ".env", "GENLAYER-PROJECT-PLAYBOOK.md"}
def allowed(path):
    p = Path(path)
    if p.name in forbidden or p.name.startswith("MASTER-PROMPT-"):
        return False
    if any(x in {".codex", ".venv", "node_modules", "dist", "source-notes", "research", "references", "templates"} for x in p.parts):
        return False
    return (p.parts[0] in {"contracts", "tests", "scripts", "docs", "frontend", ".github"}
            or path in {".gitignore", ".gitattributes", ".env.example", "README.md", "requirements.txt", "gltest.config.yaml", "package.json", "package-lock.json"})
bad = [p for p in paths + staged if not allowed(p)]
assert not bad, "Public path allowlist rejected a file"
secrets = []
for env_path in (root / ".env", root.parent / ".env"):
    if env_path.exists():
        secrets.extend(value for key, value in dotenv_values(env_path).items()
                       if value and len(value) >= 16 and any(x in key.upper() for x in ("PRIVATE", "SECRET", "TOKEN", "PASSWORD", "API_KEY")))
found = False
def secret_content(content):
    return any(value.encode() in content for value in secrets) or bool(re.search(
        rb"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:private[_-]?key|mnemonic|seed[_-]?phrase)\s*[:=]\s*['\"](?:0x)?[0-9a-fA-F]{64}['\"]", content))
for path in paths:
    content = subprocess.check_output(["git", "show", ":" + path], cwd=root)
    found |= secret_content(content)
assert not found, "Configured secret found in public index"
history = []
try:
    history = git("log", "--all", "--pretty=format:", "--name-only").splitlines()
except subprocess.CalledProcessError:
    pass
assert all(allowed(p) for p in history if p), "Historical internal path found"
history_blobs = 0
for item in git("rev-list", "--objects", "--all").splitlines():
    oid = item.split(" ", 1)[0]
    if git("cat-file", "-t", oid) == "blob":
        content = subprocess.check_output(["git", "cat-file", "blob", oid], cwd=root)
        assert not secret_content(content), "Secret found in historical content"
        history_blobs += 1
for path in (".env", ".codex/EXECUTION.md", ".venv/Scripts/python.exe" if (root / ".venv/Scripts/python.exe").exists() else ".venv/bin/python"):
    assert (root / path).exists()
    subprocess.check_call(["git", "check-ignore", "-q", path], cwd=root)
subprocess.check_call(["git", "diff", "--cached", "--check"], cwd=root)
print(json.dumps({"gitRootIsChild": True, "trackedFiles": len(paths), "stagedFiles": len(staged), "publicAllowlistPassed": True, "configuredSecretsFound": False, "historyPathsPassed": True, "historyContentPassed": True, "historyBlobsScanned": history_blobs, "ignoredLocalFilesExist": True}))

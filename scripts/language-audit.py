"""Bounded language scan; English copy also receives a manual review."""
import json
import re
from pathlib import Path
root = Path(__file__).resolve().parent.parent
paths = [root / "README.md", root / "frontend/index.html"]
paths += sorted(p for p in (root / "frontend/src").rglob("*") if p.suffix in {".ts", ".tsx", ".html", ".css", ".mjs", ".mts"})
paths += sorted((root / "contracts").glob("*.py"))
pattern = re.compile(r"[\u0103\u0111\u0129\u0169\u01a1\u01b0\u1ea0-\u1ef9\u3040-\u30ff\u3400-\u9fff]", re.I)
matches = [{"file": p.relative_to(root).as_posix(), "line": i} for p in paths for i, line in enumerate(p.read_text(encoding="utf-8").splitlines(), 1) if pattern.search(line)]
proof = {"command": "python scripts/language-audit.py", "filesScanned": len(paths), "nonEnglishCandidateLines": matches, "scope": "Frontend source, index, README and contract comments; technical identifiers unchanged", "limitation": "A bounded script scan supports, but does not replace, manual English-copy review.", "passed": not matches}
print(json.dumps(proof))
assert not matches, "Non-English copy candidate requires review"

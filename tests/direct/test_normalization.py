"""Exercise the contract's pure normalizer, without replacing its algorithm."""
import json
import pytest
from pure import functions


def normalizer():
    return functions()["_normalize_llm"]


def test_valid_pair_normalizes_order():
    raw = json.dumps({"pairs": [
        {"from": "B", "to": "A", "relation": "DEPENDENT"},
        {"from": "A", "to": "B", "relation": "INDEPENDENT"},
    ]})
    assert normalizer()(raw) == {"ok": True, "reason": "OK",
                               "relations": ["INDEPENDENT", "DEPENDENT"]}


def pairs(a="INDEPENDENT", b="DEPENDENT"):
    return {"pairs": [{"from": "A", "to": "B", "relation": a},
                      {"from": "B", "to": "A", "relation": b}]}


@pytest.mark.parametrize("raw", [None, 1, [], "not json", "x" * 4001,
    {"pairs": []}, {"pairs": pairs()["pairs"] + [pairs()["pairs"][0]]},
    {"pairs": [pairs()["pairs"][0]] * 2},
    {"pairs": [{"from": "A", "to": "A", "relation": "DEPENDENT"}, pairs()["pairs"][1]]},
    {"pairs": [{"from": "C", "to": "B", "relation": "DEPENDENT"}, pairs()["pairs"][1]]},
    {"pairs": [{"from": "A", "to": "B", "relation": []}, pairs()["pairs"][1]]},
    pairs("PAY", "INDEPENDENT"), dict(pairs(), payoutGEN="2"),
    {"pairs": [dict(pairs()["pairs"][0], recipient="issuer"), pairs()["pairs"][1]]}])
def test_invalid_coverage_or_payout_is_nonconsequential(raw):
    result = normalizer()(raw)
    assert result["ok"] is False
    assert result["relations"] == []
    assert functions()["_valid_result"](result)


def test_cycle_and_ambiguity_are_retryable():
    assert normalizer()(pairs("DEPENDENT", "DEPENDENT"))["reason"] == "CYCLE_UNSUPPORTED"
    assert normalizer()(pairs("UNVERIFIABLE", "DEPENDENT"))["reason"] == "MODEL_UNCLEAR"


def test_validator_rejects_valid_shape_wrong_meaning_and_inconsistent_reason():
    candidate = normalizer()(pairs("INDEPENDENT", "INDEPENDENT"))
    independent = normalizer()(pairs())
    compare = functions()["_same_meaning"]
    assert not compare(candidate, independent)
    assert compare(independent, dict(independent))
    assert not compare(dict(independent, reason="SOURCE_DIGEST"), independent)
    assert not functions()["_valid_result"]({"ok": True, "reason": "OK", "relations": ["DEPENDENT"] * 2})

"""Fluent gltest/real SDK RPC against isolated GLSim, never Studio proof."""
import json
import base64
from pathlib import Path
from urllib.request import Request, urlopen
from gltest import get_contract_factory
from gltest.accounts import get_accounts
from gltest.assertions import tx_execution_succeeded

RPC = "http://127.0.0.1:4193/api"
GEN = 10**18


def rpc(method, params):
    request = Request(RPC, data=json.dumps({"jsonrpc": "2.0", "id": 1,
        "method": method, "params": params}).encode(), headers={"Content-Type": "application/json"})
    with urlopen(request, timeout=15) as response:
        envelope = json.load(response)
    assert "error" not in envelope, "Local simulation RPC failed"
    return envelope["result"]


def test_fluent_consensus_review_and_dependency_cancellation():
    accounts = get_accounts()
    issuer, buyer = accounts[:2]
    rpc("sim_fundAccount", {"account_address": issuer.address, "amount": 10 * GEN})
    rpc("sim_fundAccount", {"account_address": buyer.address, "amount": 10 * GEN})
    rpc("sim_setTime", {"datetime": "2026-10-06T00:00:00+00:00"})
    # Bare dict, installed BEFORE any nondeterministic signed local transaction.
    rpc("sim_installMocks", {"strict": True, "web_mocks": {
        r"https://www\.w3\.org/.*": {"status": 200, "body": Path(".codex/reference-cache.bin").read_text("utf-8")}},
        "llm_mocks": {r"ScopeExit SX1.*": json.dumps(json.dumps({"pairs": [
            {"from": "A", "to": "B", "relation": "INDEPENDENT"},
            {"from": "B", "to": "A", "relation": "DEPENDENT"}] }))}})
    c = get_contract_factory("ScopeExit").deploy(account=issuer, wait_until="finalized")
    def write(actor, method, args, value=0):
        receipt = getattr(c.connect(actor), method)(args=args).transact(value=value,
            wait_until="finalized", wait_interval=100, wait_retries=100)
        if not tx_execution_succeeded(receipt):
            # Local fixture has no secrets; still project only diagnostic categories.
            leaves = []
            def collect(value):
                if isinstance(value, str):
                    leaves.append(value)
                    if value.startswith("0x"):
                        try:
                            leaves.append(bytes.fromhex(value[2:]).decode("utf-8", errors="ignore"))
                        except ValueError:
                            pass
                    try:
                        leaves.append(base64.b64decode(value).decode("utf-8", errors="ignore"))
                    except ValueError:
                        pass
                elif isinstance(value, bytes):
                    leaves.append(value.decode("utf-8", errors="ignore"))
                elif isinstance(value, dict):
                    for x in value.values():
                        collect(x)
                elif isinstance(value, list):
                    for x in value:
                        collect(x)
            collect(receipt)
            text = "\n".join(leaves)
            categories = [x for x in ["AttributeError", "UserError", "TypeError", "Wrong deployment network",
                "Expiry", "Invalid participant", "Buyer and issuer", "GEN accounting", "Permission period",
                "datetime", "sender_address", "contract_address", "PermissionError", "KeyError",
                "Invalid", "chain_id", "Missing", "UnboundLocalError", "NameError", "ScopeExit",
                "method", "argument", "Type", "value", "Balance", "balance", "No method in calldata",
                "Contract has no method", "create_offer", "None", "bytes", "str", "dict"] if x in text]
            print("Local failure categories:", categories)
            print("Local execution:", [x.get("execution_result") for x in receipt.get("consensus_data", {}).get("leader_receipt", [])])
        assert tx_execution_succeeded(receipt), "Local simulation execution failed"
    write(issuer, "create_offer", ["sim-case", "Analysis and export", buyer.address,
        "Analysis", "Analysis is independent of export.", "Export",
        "Export requires analysis A to remain active.", 1791248400])
    a = json.loads(c.get_agreement(args=["sim-case"]).call())
    write(buyer, "accept_offer", ["sim-case", a["digest"]], 2 * GEN)
    write(issuer, "review_dependencies", ["sim-case"])
    a = json.loads(c.get_agreement(args=["sim-case"]).call())
    assert a["dependencies"] == ["INDEPENDENT", "DEPENDENT"]
    write(buyer, "exit_component", ["sim-case", "A"])
    a = json.loads(c.get_agreement(args=["sim-case"]).call())
    assert [p["status"] for p in a["permissions"]] == ["CANCELLED"] * 2
    assert a["buyerCreditGEN"] == "2" and a["escrowGEN"] == "0"
    assert json.loads(c.get_accounting(args=[]).call())["conserved"]
    # GLSim has no native GEN ledger for this current EVM boundary. Do not fake
    # a withdrawal or claim zero-liability closure here: direct ordering tests
    # and mandatory Studio Dev native-transfer evidence cover that boundary.

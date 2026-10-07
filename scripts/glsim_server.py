"""Isolated localhost GLSim: mocks only, no wallet secrets or paid providers."""
import os
import sys
from pathlib import Path
from gltest.direct import loader
from gltest.direct.vm import VMContext

original_refresh = VMContext._refresh_gl_message
def refresh(vm):
    original_refresh(vm)
    message = sys.modules.get("genlayer.message")
    if message is not None and isinstance(getattr(message, "raw", None), dict):
        message.raw["datetime"] = vm._datetime
VMContext._refresh_gl_message = refresh

original_inject = loader._inject_message_to_fd0
original_unlink = os.unlink
deferred = []
def unlink(path, *args, **kwargs):
    try:
        original_unlink(path, *args, **kwargs)
    except PermissionError as error:
        if os.name != "nt" or error.winerror != 32:
            raise
        deferred.append(Path(path))
def inject(vm):
    os.unlink = unlink
    try:
        return original_inject(vm)
    finally:
        os.unlink = original_unlink
loader._inject_message_to_fd0 = inject

from glsim.server import create_app, run_server
from glsim import engine as engine_module, server as server_module, tx_decoder
# Current SDK calldata uses the empty-string method key. GLSim's RPC dispatch
# still expects the legacy "method" key. Normalize only its decoded dispatcher
# input; the signed payload and production SDK encoding remain unchanged.
original_decode = tx_decoder.decode_calldata_bytes
def decode_for_dispatch(raw):
    decoded = original_decode(raw)
    if "" in decoded and "method" not in decoded:
        return {**decoded, "method": decoded[""]}
    return decoded
tx_decoder.decode_calldata_bytes = decode_for_dispatch
engine_module.decode_calldata_bytes = decode_for_dispatch
server_module.decode_calldata_bytes = decode_for_dispatch
app = create_app(chain_id=61997, num_validators=3, use_browser=False, seed="ScopeExit-local-tests")
app.state.engine._web_handler = None
app.state.engine._llm_handler = None
app.state.engine.vm._strict_mock_mode = True
original_signed_rpc = server_module.RPC_METHODS["eth_sendRawTransaction"]
def signed_rpc(state, engine, params):
    # Upstream GLSim decodes the signed user value but omits VM message.value.
    # Expose only that existing decoded field; do not implement a native ledger.
    raw = tx_decoder.decode_raw_transaction(params[0])
    payload = tx_decoder.decode_genlayer_payload(raw["data"])
    previous = engine.vm.value
    engine.vm.value = payload.get("user_value") if payload.get("user_value") is not None else raw["value"]
    try:
        return original_signed_rpc(state, engine, params)
    finally:
        engine.vm.value = previous
server_module.RPC_METHODS["eth_sendRawTransaction"] = signed_rpc
try:
    run_server(app, host="127.0.0.1", port=4193)
finally:
    app.state.engine.deactivate()
    for path in deferred:
        path.unlink(missing_ok=True)

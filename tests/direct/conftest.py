"""Direct testing with explicit upstream transport/platform accommodations.

Production source, consensus, state, authorizations and transfer logic are not
replaced. These fixes only expose VM warp time to the v0.3 SDK and release a
Windows stdin-loader temporary file after its fd is restored.
"""
import os
import sys
from pathlib import Path
from unittest.mock import patch
import pytest


@pytest.fixture(autouse=True)
def expose_vm_transaction_time(monkeypatch):
    from gltest.direct.vm import VMContext
    original = VMContext._refresh_gl_message

    def refresh(vm):
        original(vm)
        message = sys.modules.get("genlayer.message")
        if message is not None and isinstance(getattr(message, "raw", None), dict):
            message.raw["datetime"] = vm._datetime

    monkeypatch.setattr(VMContext, "_refresh_gl_message", refresh)


@pytest.fixture(autouse=True)
def restore_windows_loader_files():
    if os.name != "nt":
        yield
        return
    from gltest.direct import loader
    inject = loader._inject_message_to_fd0
    unlink = os.unlink
    delayed = []

    def defer_locked_file(path, *args, **kwargs):
        try:
            unlink(path, *args, **kwargs)
        except PermissionError as error:
            if error.winerror != 32:
                raise
            delayed.append(Path(path))

    def load(vm):
        with patch.object(os, "unlink", defer_locked_file):
            return inject(vm)

    with patch.object(loader, "_inject_message_to_fd0", load):
        yield
    for path in delayed:
        path.unlink(missing_ok=True)

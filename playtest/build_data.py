"""Compatibility entry point. Canonical generator: build.mjs."""
import subprocess
from pathlib import Path
subprocess.run(["node", str(Path(__file__).with_name("build.mjs"))], check=True)

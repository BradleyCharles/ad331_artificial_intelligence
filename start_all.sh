#!/usr/bin/env bash
set -Eeuo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ──────────────────────────────────────────────────────────────────────────────
# Pretty banner
echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════════════════╗"
echo "║         AI Dev – Start Backend (Python 3.13) & Frontend (Next.js)        ║"
echo "╚══════════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ──────────────────────────────────────────────────────────────────────────────
# Locate Python 3.13
PY311="$(command -v python3.11 || true)"
PY313="$(command -v python3.13 || true)"

if [[ -z "${PY313}" ]]; then
  echo -e "${RED}Python 3.13 not found on PATH. Install it (e.g., 'sudo dnf install python3.13 python3.13-devel').${NC}"
  exit 1
fi

echo -e "${GREEN}Using Python: ${PY313}${NC}"

# ──────────────────────────────────────────────────────────────────────────────
# Enter backend folder
if [[ ! -d "backend" ]]; then
  echo -e "${RED}Missing ./backend directory. Run this script from the project root.${NC}"
  exit 1
fi
pushd backend >/dev/null

# ──────────────────────────────────────────────────────────────────────────────
# Create venv with Python 3.13 (isolated from system Python 3.13 site-packages)
if [[ ! -d ".venv" ]]; then
  echo -e "${BLUE}Creating Python 3.13 virtual environment...${NC}"
  "${PY313}" -m venv .venv
fi

# shellcheck source=/dev/null
source .venv/bin/activate

# Safety check
python - <<'PY'
import sys
assert sys.version_info[:2] == (3, 13), f"Expected Python 3.13, got {sys.version}"
print("Python OK ->", sys.version)
PY

# ──────────────────────────────────────────────────────────────────────────────
# Upgrade build tooling INSIDE the venv to avoid pkgutil.ImpImporter crash
# (old setuptools/pkg_resources explodes on Python 3.13)
echo -e "${BLUE}Upgrading pip/setuptools/wheel/build inside the venv...${NC}"
python -m pip install -U pip "setuptools>=75" wheel build packaging

# Prefer binary wheels when available
export PIP_PREFER_BINARY=1

# If you have a requirements file, install it in two passes:
#  1) Binary-only to skip building on 3.13 when wheels exist
#  2) Fallback without isolation so our upgraded setuptools is used
REQ="requirements.txt"
if [[ -f "${REQ}" ]]; then
  echo -e "${BLUE}Installing backend dependencies (binary wheels preferred)...${NC}"
  # Pass 1: binary-only
  python -m pip install --only-binary=:all: -r "${REQ}" || true
  echo -e "${YELLOW}Retrying any remaining packages using our upgraded build backend (no isolation)...${NC}"
  python -m pip install --no-build-isolation -r "${REQ}"
else
  echo -e "${YELLOW}No backend requirements.txt found. Skipping dependency install.${NC}"
fi

# ──────────────────────────────────────────────────────────────────────────────
# Launch backend
if [[ -f "main.py" ]]; then
  echo -e "${CYAN}🚀 Starting backend (Python 3.13) on http://localhost:8000 ${NC}"
  python main.py &
  BACKEND_PID=$!
else
  echo -e "${YELLOW}No backend entrypoint (main.py) found. Skipping backend start.${NC}"
  BACKEND_PID=""
fi

popd >/dev/null

# ──────────────────────────────────────────────────────────────────────────────
# Start frontend (Next.js)
if [[ -f "package.json" ]]; then
  echo -e "${CYAN}🎨 Starting Next.js frontend on http://localhost:3000 ${NC}"
  # Install node deps if node_modules missing
  if [[ ! -d "node_modules" ]]; then
    echo -e "${BLUE}Installing frontend dependencies...${NC}"
    npm install
  fi
  npm run dev &
  FRONTEND_PID=$!
else
  echo -e "${YELLOW}No frontend package.json found. Skipping frontend.${NC}"
  FRONTEND_PID=""
fi

# ──────────────────────────────────────────────────────────────────────────────
# Trap Ctrl-C and cleanup
cleanup() {
  echo -e "${YELLOW}\nShutting down...${NC}"
  [[ -n "${FRONTEND_PID}" ]] && kill "${FRONTEND_PID}" 2>/dev/null || true
  [[ -n "${BACKEND_PID}"  ]] && kill "${BACKEND_PID}"  2>/dev/null || true
}
trap cleanup INT TERM

# Wait for children if any
wait ${BACKEND_PID:-} ${FRONTEND_PID:-} 2>/dev/null || true

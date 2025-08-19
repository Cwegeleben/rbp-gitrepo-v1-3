#!/usr/bin/env bash
set -euo pipefail

# 1) If a server log exists, try to parse the port (CI/local if tee'd)
LOG_FILE="${LOG_FILE:-server.log}"
if [ -f "$LOG_FILE" ]; then
  if PORT=$(grep -Eo 'http://localhost:[0-9]+' "$LOG_FILE" | tail -1 | sed -E 's/.*:([0-9]+)/\1/'); then
    if [[ -n "${PORT:-}" ]]; then echo "$PORT"; exit 0; fi
  fi
fi

# 2) Try lsof to find listening Node ports and probe /apps/proxy/ping
if command -v lsof >/dev/null 2>&1; then
  while read -r p; do
    if curl -sS "http://localhost:$p/apps/proxy/ping" >/dev/null 2>&1; then
      echo "$p"; exit 0
    fi
  done < <(lsof -nP -iTCP -sTCP:LISTEN 2>/dev/null | awk '/node/ {print $9}' | sed -n 's/.*:\([0-9]\+\)$/\1/p' | sort -u)
fi

# 3) Give up with a friendly hint
echo "Could not auto-detect dev server port. Start the server and run: PORT=<port> pnpm curl:builds" >&2
exit 1
#!/usr/bin/env bash
set -euo pipefail

# 1) If a server log exists, try to parse the port (CI/local if tee'd)
LOG_FILE="${LOG_FILE:-server.log}"
if [ -f "$LOG_FILE" ]; then
  if PORT=$(grep -Eo 'http://localhost:[0-9]+' "$LOG_FILE" | tail -1 | sed -E 's/.*:([0-9]+)/\1/'); then
    if [[ -n "${PORT:-}" ]]; then echo "$PORT"; exit 0; fi
  fi
fi

# 2) Try lsof to find listening Node ports and probe /apps/proxy/ping
if command -v lsof >/dev/null 2>&1; then
  while read -r p; do
    if curl -sS "http://localhost:$p/apps/proxy/ping" >/dev/null 2>&1; then
      echo "$p"; exit 0
    fi
  done < <(lsof -nP -iTCP -sTCP:LISTEN 2>/dev/null | awk '/node/ {print $9}' | sed -n 's/.*:\([0-9]\+\)$/\1/p' | sort -u)
fi

# 3) Give up with a friendly hint
echo "Could not auto-detect dev server port. Start the server and run: PORT=<port> pnpm curl:builds" >&2
exit 1

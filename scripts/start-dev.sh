#!/usr/bin/env bash
# Start the complete local development environment from `task start-dev`.
#
# Task provides the named command, while this Bash script owns the three
# long-running child processes so they can start together and stop together.
# Running them as sequential Task commands would never reach the second command
# because each development server keeps running until it is stopped.
#
# Processes started here:
#   1. Air builds and restarts the Go backend when Go files change (port 8100).
#   2. Vite serves React with browser reloads and proxies API requests to Go
#      (port 5173, the URL to open during development).
#   3. `task --watch proto` regenerates Go and TypeScript types when a .proto
#      file changes. Air and Vite then see their respective generated files.
#
# `task start-dev DIR=/path/to/folder` passes DIR as CARP_SHARE_DIR. A relative
# path is resolved from the repository root; the default is example_root.
# Before starting the watchers, the script checks required local tools and runs
# `task proto` once so generated types are current. On Ctrl+C, or if a child
# exits, it stops and waits for all three children. This is a development-only
# launcher; released Carp does not need Bash, Task, Air, or Vite.
set -euo pipefail

repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
share_dir="${CARP_SHARE_DIR:-example_root}"
if [[ "$share_dir" != /* ]]; then
  share_dir="$repo_dir/$share_dir"
fi
if [[ ! -d "$share_dir" ]]; then
  echo "Share folder does not exist: $share_dir" >&2
  exit 1
fi
share_dir="$(cd "$share_dir" && pwd -P)"

for command_name in air npm task protoc protoc-gen-go; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Missing development tool: $command_name" >&2
    exit 1
  fi
done
if [[ ! -d "$repo_dir/frontend/node_modules" ]]; then
  echo "Install frontend dependencies first: cd frontend && npm ci" >&2
  exit 1
fi

cd "$repo_dir"
task proto

cleanup() {
  trap - EXIT INT TERM
  kill "${air_pid:-}" "${vite_pid:-}" "${proto_pid:-}" 2>/dev/null || true
  wait "${air_pid:-}" "${vite_pid:-}" "${proto_pid:-}" 2>/dev/null || true
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

(cd "$repo_dir/backend" && export CARP_SHARE_DIR="$share_dir" CARP_PORT=8100 && exec air) & air_pid=$!
(cd "$repo_dir/frontend" && exec npm run dev -- --strictPort) & vite_pid=$!
(cd "$repo_dir" && exec task --watch proto) & proto_pid=$!

echo "Sharing $share_dir at http://localhost:5173/"
while kill -0 "$air_pid" 2>/dev/null && kill -0 "$vite_pid" 2>/dev/null && kill -0 "$proto_pid" 2>/dev/null; do
  sleep 1
done
echo "A development process stopped." >&2
exit 1

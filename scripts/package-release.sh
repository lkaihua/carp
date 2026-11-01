#!/usr/bin/env bash
# Build Vite, copy its output into Go's embed directory, and cross-compile
# self-contained binaries. Run from anywhere with a version argument, for
# example: bash scripts/package-release.sh v0.1.0
set -euo pipefail

version="${1:?usage: bash scripts/package-release.sh VERSION}"
case "$version" in
  *[!a-zA-Z0-9._-]*) echo "Invalid version: $version" >&2; exit 1 ;;
esac

repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
output_dir="$repo_dir/release/$version"
embedded_dir="$repo_dir/backend/src/packages/frontend/dist"

npm --prefix "$repo_dir/frontend" run build
mkdir -p "$embedded_dir" "$output_dir"
rsync -a --delete "$repo_dir/frontend/dist/" "$embedded_dir/"

for target in windows/amd64 windows/arm64 darwin/amd64 darwin/arm64 linux/amd64 linux/arm64; do
  goos="${target%/*}"
  goarch="${target#*/}"
  name="carp_${version}_${goos}_${goarch}"
  package_dir="$output_dir/$name"
  mkdir -p "$package_dir"
  binary="carp"
  if [[ "$goos" == windows ]]; then binary="carp.exe"; fi
  (cd "$repo_dir/backend" && CGO_ENABLED=0 GOOS="$goos" GOARCH="$goarch" \
    go build -trimpath -ldflags='-s -w' -tags carp_release \
    -o "$package_dir/$binary" ./src/main)
  if [[ "$goos" == windows ]]; then
    (cd "$package_dir" && zip -q -j "$output_dir/$name.zip" "$binary")
  else
    tar -C "$package_dir" -czf "$output_dir/$name.tar.gz" "$binary"
  fi
done

(cd "$output_dir" && shasum -a 256 ./*.zip ./*.tar.gz > SHA256SUMS)
echo "Release packages: $output_dir"

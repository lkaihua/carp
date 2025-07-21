#!/bin/bash

set -e

# Generate Go code from proto
protoc --go_out=src/packages/types --go_opt=paths=source_relative proto/types.proto

# Generate TypeScript code from proto
# protoc --plugin=protoc-gen-ts_proto=$(which protoc-gen-ts_proto) \
#   --ts_proto_out=frontend/src/proto proto/folder_content.proto
protoc --plugin=protoc-gen-ts_proto=../frontend/node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out=../frontend/src/types proto/types.proto

echo "Proto generation complete for Go and TypeScript."
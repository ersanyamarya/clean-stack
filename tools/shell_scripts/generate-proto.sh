#!/bin/bash

PROTO_DIR=domain/grpc-proto/src/protos
OUT_DIR=domain/grpc-proto/src/generated

# Generate TypeScript files from proto files
rm -rf $OUT_DIR
mkdir -p $OUT_DIR
./node_modules/.bin/grpc_tools_node_protoc \
  --plugin="protoc-gen-ts=./node_modules/.bin/protoc-gen-ts_proto" \
  --ts_out=$OUT_DIR \
  --ts_opt=outputServices=grpc-js \
  --ts_opt=esModuleInterop=true \
  --ts_opt=unaryRpcPromise=true \
  -I=$PROTO_DIR $PROTO_DIR/*.proto

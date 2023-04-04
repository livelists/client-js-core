#!/usr/bin/env bash

set -x
set -e

rm -rf ./src/protocol/*

#OPTS="esModuleInterop=true,useOptionals=all,outputClientImpl=false"
# ts-protocol has a bug when generating timestamp fields
MODEL_OPTS="outputClientImpl=false,useOptionals=messages,oneof=unions,esModuleInterop=true"

# Generate model to ensure it doesn't have optional timestamps
protoc --plugin="./node_modules/ts-proto/protoc-gen-ts_proto" \
       --ts_proto_out="./src/proto" \
       --experimental_allow_proto3_optional \
       --ts_proto_opt="${MODEL_OPTS}" \
       -I"./protocol/" \
       ./protocol/models.proto ./protocol/events.proto


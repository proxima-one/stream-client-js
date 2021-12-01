#!/bin/sh

version="$1"
base=$(dirname "$0")

`$base/build.sh $version`
docker tag proximaone/eth-connector:$version quay.io/proxima.one/eth-connector:$version
docker push quay.io/proxima.one/eth-connector:$version
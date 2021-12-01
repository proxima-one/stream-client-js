#!/bin/sh

export DOCKER_BUILDKIT=1
export VERSION=${1:-dev}
dirname=$(dirname "$0")

docker-compose -f "$dirname/docker-compose.yml" build
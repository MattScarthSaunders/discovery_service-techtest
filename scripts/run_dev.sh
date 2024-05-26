#!/bin/bash


source .env

start_mongodb() {
  echo "Starting MongoDB for testing..."
  docker-compose -f docker/docker-compose.dev.yml up -d
}


compile_code() {
  echo "Compiling TypeScript code in watch mode..."
  npm run clean && tsc -w &
}

run_dev() {
  echo "Running in dev mode..."
  node out/bin/serve
}

main() {
  start_mongodb
  compile_code
  run_dev
}

main

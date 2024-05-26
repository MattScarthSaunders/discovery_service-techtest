#!/bin/bash

start_mongodb() {
  echo "Starting MongoDB for testing..."
  docker-compose -f docker/docker-compose.dev.yml up -d
}

stop_mongodb() {
  echo "Stopping MongoDB..."
  docker-compose -f docker/docker-compose.dev.yml down
}

compile_code() {
  echo "Compiling TypeScript code..."
  npm run compile
}

run_tests() {
  echo "Running tests with Mocha..."
  export NODE_ENV='test'
  export LOG_LEVEL='mute'
  export MONGO_URL='mongodb://localhost:27017/UBIO_techtest'
  mocha
}

main() {
  start_mongodb
  compile_code
  run_tests
  stop_mongodb
}

main

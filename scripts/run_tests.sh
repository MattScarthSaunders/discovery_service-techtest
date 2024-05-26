#!/bin/bash

start_mongodb() {
  echo -e "\nStarting MongoDB for testing...\n"

  if ! docker info >/dev/null 2>&1; then
    echo "\nDocker daemon is not running. Please start Docker and try again.\n"
    exit 1
  fi
  
  docker-compose -f docker/docker-compose.dev.yml up -d
}

stop_mongodb() {
  echo -e "\nStopping MongoDB...\n"
  docker-compose -f docker/docker-compose.dev.yml down
}

compile_code() {
  echo -e "\nCompiling TypeScript code...\n"
  npm run compile
}

run_tests() {
  echo -e "\nRunning tests with Mocha...\n"
  export NODE_ENV='test'
  export LOG_LEVEL='mute'
  export MONGO_URL='mongodb://localhost:27017/UBIO_techtest'
  mocha
}

trap stop_mongodb EXIT


main() {
  start_mongodb
  compile_code
  run_tests
  stop_mongodb
}

main

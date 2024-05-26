#!/bin/bash


source .env

start_mongodb() {
  echo -e "\nStarting MongoDB for dev...\n"

  if ! docker info >/dev/null 2>&1; then
    echo -e "\nDocker daemon is not running. Please start Docker and try again.\n"
    exit 1
  fi
  
  docker-compose -f docker/docker-compose.dev.yml up -d
}


compile_code() {
  echo -e "\nCompiling TypeScript code in watch mode...\n"
  npm run clean && tsc -w &
}

run_dev() {
  echo -e "\nRunning in dev mode...\n"
  nodemon --watch out/bin/serve
}

on_exit() {
  echo -e "\nStopping MongoDB...\n"
  docker-compose -f docker/docker-compose.dev.yml down
}

trap on_exit EXIT

main() {
  start_mongodb
  compile_code
  run_dev
}

main

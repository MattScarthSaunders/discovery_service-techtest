#!/bin/bash

pull_mongodb_image() {
    echo "Pulling MongoDB Docker image..."
    docker pull mongodb/mongodb-community-server:latest
    if [ $? -ne 0 ]; then
        echo "Failed to pull MongoDB Docker image."
        exit 1
    else
        echo "MongoDB Docker image pulled successfully."
    fi
}

create_mongodb_container() {
    echo "Creating MongoDB container..."
    docker create --name mongodb_techtest -p 27017:27017 mongodb/mongodb-community-server:latest
    if [ $? -ne 0 ]; then
        echo "Failed to create MongoDB container."
        exit 1
    else
        echo "MongoDB container created successfully."
    fi
}

run_mongodb_container() {
    echo "Running MongoDB container..."
    docker start mongodb_techtest
    if [ $? -ne 0 ]; then
        echo "Failed to start MongoDB container."
        exit 1
    else
        echo "MongoDB container started successfully."
    fi
}

check_mongodb_container() {
    echo "Checking if MongoDB container is running..."
    if docker ps | grep -q mongodb
    then
        echo "MongoDB container is running successfully."
    else
        echo "MongoDB container is not running."
        exit 1
    fi
}

write_to_env_file() {
    echo "Writing to .env file..."
    echo "MONGO_URL='mongodb://localhost:27017'" > .env
    echo ".env file created successfully."
}

main() {
    echo "Starting MongoDB container setup script..."
    pull_mongodb_image
    create_mongodb_container
    run_mongodb_container
    check_mongodb_container
    write_to_env_file
    echo "MongoDB container is up and running!."
}

main

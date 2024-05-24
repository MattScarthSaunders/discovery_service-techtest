#!/bin/bash

stop_mongodb_container() {
    echo "Stopping MongoDB container..."
    docker stop mongodb_techtest
    if [ $? -ne 0 ]; then
        echo "Failed to stop MongoDB container."
        exit 1
    else
        echo "MongoDB container stopped successfully."
    fi
}

remove_mongodb_container() {
    echo "Removing MongoDB container..."
    docker rm mongodb_techtest
    if [ $? -ne 0 ]; then
        echo "Failed to remove MongoDB container."
        exit 1
    else
        echo "MongoDB container removed successfully."
    fi
}


main() {
    echo "Starting MongoDB container teardown script..."
    stop_mongodb_container
    remove_mongodb_container
    echo "Tear down successful."
}

main
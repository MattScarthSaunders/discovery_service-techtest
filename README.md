# UBIO Tech Test

## Main Dependencies

-   MongoDb
-   Node
-   UBIO Framework
-   Mocha
-   Docker

## Install

### Public Env

The following environment variables are needed, though some have default values if not provided:

-   MONGO_URL= < url of your mongo database instance >
-   MONGO_DB_NAME= < desired name of mongo database > [**optional**]

### App

`npm i`

### DB

To run the database locally, you will need [Docker](https://docs.docker.com/get-docker/) set up.

I recommend using the provided script: `npm run setup:db` as this will populate required environment variables, retrieve required images, build the container and run it.

## Run App

To run the server, you must first compile it with `npm run compile`, then it can be run with `npm start`. You should see confirmation in the terminal that it is listening.

## Stop App

Kill the app in the terminal with your usual command (`ctrl+c` usually). Again, you should see confirmation in the terminal, this time that it has ceased running.

Run `npm run stop:db` to stop the mongo container and remove it. (Does not remove the mongo image)

## Run Tests

All tests can be run with `npm test`.

## Other notes

Specification for the test as provided is outlined in [spec.md](spec.md)

Code formatting with prettier, linked to specified eslint config.

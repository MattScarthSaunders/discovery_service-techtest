# UBIO Tech Test

## Main Dependencies

-   MongoDb
-   Node
-   UBIO Framework
-   Mocha
-   Docker

## Install

### Public Env

The following are required environment variables:

-   MONGO_URL= < url of your mongo database instance >

### App

`npm i`

### DB

To run the database locally, you will need [Docker](https://docs.docker.com/get-docker/) set up.

I recommend using the provided script: `npm run setup:db` as this will populate required environment variables, retrieve required images, build the container and run it.

## Run App

`npm run compile`
`npm start`

## Stop App

Kill the app in the terminal with your usual command (`ctrl/cmd+c` usually).

Run `npm run stop:db` to stop the mongo container and remove it. (Does not remove the mongo image)

## Run Tests

`npm test`

## Other notes

Specification for the test as provided is outlined in [spec.md](spec.md)

Code formatting with prettier, linked to specified eslint config.

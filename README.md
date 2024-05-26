# UBIO Tech Test

## Swagger

API overview available on [swagger](https://app.swaggerhub.com/apis-docs/MSCARSAUND/ubio-tech_test/1.0.0)

## Dependencies

-   [Node](https://nodejs.org/en/download/package-manager)
-   [Docker](https://docs.docker.com/get-docker/)
-   [Docker Compose](https://docs.docker.com/compose/install/)

### Public Env

The following environment variables can be set in a `.env` file for local development:

-   MONGO_URL= < url of your mongo database instance >
-   EXPIRY_TIME_MS= < desired time in ms for instances to be deemed cullable > [**optional - defaults to 3 minutes**]
-   PORT= < localhost port for the service to listen on > [**optional - defaults to 8080**]

To alter the containerised version, edit environemtn config in `docker/docker-compose.yml`.

For additional information on config refer to [UBIO Node Framework docs](https://github.com/ubio/node-framework)

## Install

### App

In a terminal at the root of the project repo, run: `npm i`

## Run Dev

You can run the app in a couple of ways. For dev mode (watch-mode compile, containerised db and a live local server), you can use:

`npm run dev`

## Run Demo

For a containerised demo version with with availability for multiple discovery service instances and load balancing, you can use:

`npm start`

To interact with the demo you can use tools like Postman [download](https://www.postman.com/downloads/) [vsc extension](https://marketplace.visualstudio.com/items?itemName=Postman.postman-for-vscode) [web](https://identity.getpostman.com/login).

Refer to the [swagger](https://app.swaggerhub.com/apis-docs/MSCARSAUND/ubio-tech_test/1.0.0) and use `http://localhost:3000` as the base url for the request.

## Stop App

Kill the app in the terminal with your usual command (`ctrl+c` usually). Again, you should see confirmation in the terminal, this time that it has ceased running.

Run `npm stop` if running standard non-dev version.

## Test

Run with `npm test`. Requires docker daemon to be running, as the tests are run against a containerised mongo database.

## Other notes

Specification for the test as provided is outlined in [spec.md](spec.md)

Code formatting with prettier, linked to specified eslint config.

### Assumptions

I have made the following assumptions for the sake of the test:

-   id on path param is always a uuid, as in the spec it resembles a uuid.

### Decisions

-   Assuming a 30s heartbeat, I'm assigning a default expiry 'age' value of 3 minutes. This provides a balance between tolerating network instability, client load or other intermittent issues, and still ensuring that the service remains reasonably up-to-date.
-   Mongo structure:

    -   single collection ('instances'), as all primary data is related to the client app instances, and group data is derived from this. Given small scope of the app, this seems appropriate.

    Pros:

    -   simple, avoids forcing relations between two collections.
    -   avoids excess storage of data

    Cons:

    -   no group history
    -   potentially slower response/query times on `GET /` endpoint given large numbers of instances.

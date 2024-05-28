# UBIO Tech Test - Discovery Service

## Swagger

API overview available on [swagger](https://app.swaggerhub.com/apis-docs/MSCARSAUND/ubio-tech_test/1.0.0)

## Dependencies

-   [Node](https://nodejs.org/en/download/package-manager)
-   [Docker](https://docs.docker.com/get-docker/)
-   [Docker Compose](https://docs.docker.com/compose/install/)

### Public Env

The following environment variables can be set in a `.env` file for local development:

-   MONGO_URL= < url of your mongo database instance, e.g `'mongodb://localhost:27017/UBIO_techtest'` >
-   EXPIRY_TIME_MS= < desired time in ms for instances to be deemed expired > [**optional - defaults to 3 minutes**]
-   PORT= < localhost port for the service to listen on > [**optional - defaults to 8080**]

To alter the containerised version, edit environment config in `docker/docker-compose.yml`.

For additional information on config refer to [UBIO Node Framework docs](https://github.com/ubio/node-framework)

## Install

1. Clone the repo

2. In a terminal at the root of the project repo, run: `npm install`

## Run App

To run a local, containerised working version with with availability for multiple discovery service instances and load balancing, you can use:

`npm start`

Refer to the [swagger](https://app.swaggerhub.com/apis-docs/MSCARSAUND/ubio-tech_test/1.0.0) and use `http://localhost:3000` as the base url for local requests.

To interact with the service you can use tools like Postman [Download](https://www.postman.com/downloads/) / [VSC extension](https://marketplace.visualstudio.com/items?itemName=Postman.postman-for-vscode) / [Web](https://identity.getpostman.com/login).

Alternatively, there is a live hosted version with a single instance of the service at `https://discovery-service-techtest.onrender.com/`, so you may use that as the base url for Postman, or if you visit the swagger linked above, interact with it directly there.

Handy example UUID copy/paste: `e335175a-eace-4a74-b99c-c6466b6afadd`

**_Note: The hosting service, Render, has a 15 minute inactivity timer for free-tier users. As such on the live service it's likely the first request made will fail - give it a couple of minutes to spool up and try again!_**

## Stop App

If running locally, kill the app in the terminal with your usual command (probably `ctrl+c`), then run `npm stop` to stop and remove docker services.

## Run Dev

For dev mode (watch-mode compile, containerised db and a live local server), you can use `npm run dev`.

## Test

Run with `npm test`. Requires docker daemon to be running, as the tests are run against a containerised mongo database.

## Other notes

Specification for the tech test as provided is outlined in [spec.md](spec.md)

Code formatting with prettier, linked to eslint config from ubio node framework.

### Assumptions

I have made the following assumptions for the sake of the test:

-   Id on path param is always a uuid, as in the spec it resembles a uuid.
-   Instances will always belong to a single group

### Decisions

-   Assuming a 30s heartbeat, I'm assigning a default expiry 'age' value of 3 minutes. This provides a balance between tolerating network instability, client load or other intermittent issues, and still ensuring that the service remains reasonably up-to-date. A longer expiry time would be more forgiving for network instability, however it could result in the list of instances not reflecting active services as accurately.
-   Mongo structure:

    -   Single collection ('instances'), as all primary data is related to the client app instances, and group data is derived from this. Given small scope of the app and no specification for flexibility in group allocation, this seems appropriate.

    Pros:

    -   Denormalised - doesn't require join-like queries, faster and simpler queries.
    -   Avoids excess storage of data

    Cons:

    -   No group history recorded.

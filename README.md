# UBIO Tech Test

## Dependencies

-   [Node](https://nodejs.org/en/download/package-manager)
-   [Docker](https://docs.docker.com/get-docker/)
-   [Docker Compose](https://docs.docker.com/compose/install/)

### Public Env

The following environment variables can be set in a `.env` file for local development:

-   MONGO_URL= < url of your mongo database instance >
-   EXPIRY_TIME_MS= < desired time in ms for instances to be deemed cullable > [**optional - defaults to 3 minutes**]
-   PORT= < localhost port for the service to listen on > [**optional - defaults to 8080**]

For additional information on config refer to [UBIO Node Framework docs](https://github.com/ubio/node-framework)

## Install

### App

In a terminal at the root of the project repo, run: `npm i`

## Run App

You can run the app in a couple of ways. For dev mode (watch-mode compile, containerised db and a live local server), you can use:

`npm run start:dev`

For a containerised version with with availability for multiple discovery service instances, you can use:

`npm start`

Note: this second way will not identify code changes until restarted.

Both ways will log startup information in the terminal, including the port that is being listened on.

## Stop App

Kill the app in the terminal with your usual command (`ctrl+c` usually). Again, you should see confirmation in the terminal, this time that it has ceased running.

Run `npm run stop:dev` if running in dev mode, or just `npm stop` if running containerised version.

## Test

Run with `npm test`. Requires docker daemon to be running, as the tests are run against a containerised mongo database.

## Other notes

Specification for the test as provided is outlined in [spec.md](spec.md)

Code formatting with prettier, linked to specified eslint config.

## Assumptions

I have made the following assumptions for the sake of the test:

-   id on path param is always a uuid, as in the spec it resembles a uuid.
-   'meta' object will always be provided on the post body, though it can be an empty object.

## Decisions

-   Assuming a 30s heartbeat, I'm assigning a default expiry 'age' value of 3 minutes. This provides a balance between tolerating network instability, client load or other intermittent issues, and still ensuring that the service remains reasonably up-to-date.

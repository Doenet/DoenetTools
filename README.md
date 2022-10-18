# Welcome to Doenet!

The Distributed Open Education Network (Doenet) is an open data-driven educational technology platform designed to measure and share student interactions with web pages. It includes tools for authoring interactive educational content, including our custom DoenetML markup language, and conducting educational research using the content. Our ultimate goal is to provide research-based tools to help instructors and learners discover the most effective content. Simply put, Doenet gives teachers complete flexibility over their educational content and gives them power of anonymized student data to track learning outcomes. With Doenet, we hope to help teachers teach better and students learn better.

Although we are still in the early stages, we are excited to introduce Doenet and illustrate the richly interactive activities that one can author with it.

For more background and information on the Doenet project, see this [MAA DUE Point](https://www.mathvalues.org/masterblog/reimagining-online-mathematics) article.

We would love to hear from you! Join our [Discord](https://discord.gg/PUduwtKJ5h) to ask questions and stay updated on our progress!

## What We Use

Doenet is built using React and bundled for the web using Snowpack. Data for Doenet is stored in MySQL tables and components have been tested in Cypress. We use Docker to ship and run Doenet and our container uses Apache, Snowpack, PHP, MySQL, and RTNode. For reference, the container is set up to use port 80 for the local Downet website, port 8080 for the build site, and port 3306 for MySQL. You may have to change the ports used on your local device.

<!-- Need build instructions from Kevin  -->

## Getting Started

Doenet is open-source so that instructors and learners can customize it to best serve their needs. To start developing:

1. Fork the DoenetTools repository.

   To enable the v2 docker compose CLI on Linux, [install the docker-compose-plugin](https://docs.docker.com/compose/install/linux/).

2. Open the repository and run `npm install` to install all modules used by Doenet.

3. To start your local version of Doenet, run `npm start` and view it in the browser at http://localhost:80.

- If you are working with databases, we recommend installing [Sequel Ace](https://sequel-ace.com/) on MacOS.
<!-- Any recs for Windows/Linux? -->

## Basic Scripts

### `npm start` / `docker compose up `

Creates and starts the Docker container and runs the app in development mode.
Open http://localhost:80 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `docker compose down`

Stops and removes the Docker container created by `docker compose up`.

While switching between branches, it is good practice to `docker compose down` and then `docker compose up` to view the correct version of the development site.

### `npm run start:db`

Starts the MySQL database.

### `npm run reset:db`

Resets the MySQL database.
Running this command often fixes minor database loading issues.

### `npm run publish:db`

<!-- Get info from Kevin/Emilio -->

### `npm run build`

Builds a static copy of your site to the `build/` folder.
Your app is ready to be deployed!

**For the best production performance:** Add a build bundler plugin like "@snowpack/plugin-webpack" to your `snowpack.config.js` config file.

### `npm test`

Launches the application test runner.
Run with the `--watch` flag (`npm test -- --watch`) to run in interactive watch mode.

<!-- Common issues: Get from Emilio -->

## Troubleshooting Common Issues

import { defineConfig } from "cypress";

// // This is for db data testing/checking (CANNOT GET DATA AND CHECK VIA CYPRESS)
// //For connecting to SQL Server
// const mysql = require("mysql2");
// function queryTestDb(query, config) {
//   // creates a new mysql connection using credentials from cypress.json env's
//   const connection = mysql.createConnection(config.env.db);
//   // start connection to db
//   connection.connect();
//   // exec query + disconnect to db as a Promise
//   return new Promise((resolve, reject) => {
//     connection.query(query, (error, results) => {
//       if (error) reject(error);
//       else {
//         connection.end();
//         return resolve(results);
//       }
//     });
//   });
// }

export default defineConfig({
  numTestsKeptInMemory: 20,
  defaultCommandTimeout: 10000,
  e2e: {
    setupNodeEvents(on) {
      on("before:browser:launch", (browser = {}, launchOptions) => {
        if (browser.name === "chrome") {
          launchOptions.args.push("--mute-audio");
        }

        return launchOptions;
      });
      // on("task", {
      //   queryDb: (query) => {
      //     return queryTestDb(query, config);
      //   },
      // }); //For running sql query
    },

    baseUrl: "http://localhost:8000",
  },
  // env: {
  //   db: {
  //     host: "localhost",
  //     user: "root",
  //     password: "helloworld",
  //     database: "doenet_local",
  //   },
  // },
});

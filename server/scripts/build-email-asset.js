// This script should be run when this package is built.
// It copies the HTML file to the dist folder so that it can be served by the server.

import { cp } from "fs/promises";

async function copy() {
  await cp("src/signin_email.html", "dist/src/signin_email.html");
}

copy();

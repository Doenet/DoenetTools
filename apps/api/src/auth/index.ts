// `auth` — helpers for the Passport authentication path.
//
//   asyncPassport — wrap an async Passport callback so a rejection reaches
//                   `done(err)` instead of escaping as an unhandled rejection
//
// Import from here, not from a source file.

export { asyncPassport } from "./asyncPassport";

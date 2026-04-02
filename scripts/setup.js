/* global console */
import fs from "fs";
import path from "path";

const envPath = path.join(import.meta.dirname, "../apps/api/.env");
const examplePath = path.join(import.meta.dirname, "../apps/api/.env.example");

if (fs.existsSync(envPath)) {
  console.log("✅ .env already exists, skipping");
} else {
  fs.copyFileSync(examplePath, envPath);
  console.log("✅ Created .env from .env.example");
}

/* global console */
import fs from "fs";
import path from "path";

const envPath = path.join(import.meta.dirname, "../apps/api/.env");
const samplePath = path.join(import.meta.dirname, "../apps/api/.env.sample");

if (fs.existsSync(envPath)) {
  console.log("✅ .env already exists, skipping");
} else if (!fs.existsSync(samplePath)) {
  console.error(`❌ Sample file not found: ${samplePath}`);
  process.exit(1);
} else {
  fs.copyFileSync(samplePath, envPath);
  console.log("✅ Created .env from .env.sample");
}

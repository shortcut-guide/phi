
import { spawn } from "child_process";
import path = require("path");  // CommonJS方式に修正

const services = [
  {
    name: "products",
    config: "wrangler-develop.toml",
    dir: "../src/d1-worker/products",
  },
  {
    name: "profile",
    config: "wrangler-develop.toml",
    dir: "../src/d1-worker/profile",
  },
  {
    name: "searchlogs",
    config: "wrangler-develop.toml",
    dir: "../src/d1-worker/searchlogs",
  },
];

services.forEach(({ name, config, dir }) => {
  spawn("npx", [
    "wrangler", "dev",
    "--local",
    "--env", "develop",
    "-c", config,
  ], {
    cwd: path.resolve(__dirname, dir),
    stdio: "inherit",
    shell: true
  }).on('close', (code) => {
    console.log(`[${name}] exited with ${code}`);
  });
});
import { spawn } from "child_process";
const path = require("path");

const processes = [
  {
    name: "products",
    config: path.resolve("d1-worker/products/wrangler-develop.toml"),
  },
  {
    name: "profile",
    config: path.resolve("d1-worker/profile/wrangler-develop.toml"),
  },
  {
    name: "pup",
    config: path.resolve("d1-worker/pup/wrangler-develop.toml"),
  },
  {
    name: "search_logs",
    config: path.resolve("d1-worker/search_logs/wrangler-develop.toml"),
  },
  {
    name: "sites",
    config: path.resolve("d1-worker/sites/wrangler-develop.toml"),
  },
];

for (const proc of processes) {
  const p = spawn("wrangler", ["dev", "--config", proc.config], {
    stdio: "inherit",
    env: { ...process.env },
  });

  p.on("exit", (code) => {
    console.log(`Process ${proc.name} exited with code ${code}`);
  });
}
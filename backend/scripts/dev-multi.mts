import { fileURLToPath } from "url";
import { spawn, ChildProcess } from "child_process";
import * as path from "path";

const __filename: string = fileURLToPath(import.meta.url as string);
const __dirname: string = path.dirname(__filename);

function runWrangler(name: string, config: string, port: number): void {
  const child: ChildProcess = spawn(
    "npx",
    [
      "wrangler",
      "dev",
      "--config",
      config,
      "--port",
      String(port),
    ],
    {
      cwd: path.resolve(__dirname, "../"),
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: "development",
        NODE_OPTIONS: "--inspect=0",
      },
      shell: true,
    }
  );

  child.on("close", (code: number | null): void => {
    console.log(`[${name}] wrangler exited with ${code}`);
  });

  child.on("error", (err: Error): void => {
    console.error(`[${name}] wrangler failed to start:`, err);
  });
}

function runGateway(): void {
  const child: ChildProcess = spawn(
    "npx",
    ["tsx", "scripts/gateway.ts"],
    {
      cwd: path.resolve(__dirname, "../"),
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: "development",
      },
      shell: true,
    }
  );

  child.on("close", (code: number | null): void => {
    console.log(`[gateway] exited with ${code}`);
  });

  child.on("error", (err: Error): void => {
    console.error(`[gateway] failed to start:`, err);
  });
}

async function main(): Promise<void> {
  try {
    runWrangler("products", "src/d1-worker/products/wrangler-develop.toml", 3001);
    setTimeout(() => {
      runWrangler("searchlogs", "src/d1-worker/searchlogs/wrangler-develop.toml", 3002);
    }, 1000);
    setTimeout(() => {
      runWrangler("profile", "src/d1-worker/profile/wrangler-develop.toml", 3003);
    }, 1000);
    runGateway();
  } catch (err: unknown) {
    console.error("Error occurred in dev-multi.mts:", err);
  }
}

main();
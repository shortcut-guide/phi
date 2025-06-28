import { fileURLToPath } from "url";
import { spawn } from "child_process";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

const __filename: string = fileURLToPath(import.meta.url as string);
const __dirname: string = path.dirname(__filename);

function run(name: string, command: string): void {
  const [cmd, ...args]: string[] = command.split(" ");
  const child = spawn(cmd, args, {
    cwd: path.resolve(__dirname, "../"),
    stdio: "inherit",
    env: {
      ...process.env,
    },
    shell: true,
  });

  child.on("close", (code: number | null): void => {
    console.log(`[${name}] exited with ${code}`);
  });

  child.on("error", (err: Error): void => {
    console.error(`[${name}] failed to start:`, err);
  });
}

async function main(): Promise<void> {
  try {
    run("products", "PORT=3001 tsx src/d1Server.ts");
    run("searchlogs", "PORT=3002 tsx src/d1Server.ts");
    run("profile", "PORT=3003 tsx src/d1Server.ts");
    run("gateway", "tsx scripts/gateway.ts");
  } catch (err: unknown) {
    console.error("Error occurred in dev-multi.mts:", err);
  }
}
main();
import { execFileSync } from "node:child_process";

const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const commands = [
  ["check"],
  ["test"],
  ["build"],
];

for (const args of commands) {
  console.log(`\n> ${pnpm} ${args.join(" ")}`);
  execFileSync(pnpm, args, { stdio: "inherit" });
}

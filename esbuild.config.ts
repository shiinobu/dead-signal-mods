import { buildMod } from "@hotbunny/hackhub-content-sdk/build";
import { cp, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const outfile = resolve("dist/mod.js");
const distDir = dirname(outfile);
const dssAppSource = resolve("src/dead-signal.html");
const dssAppOutput = resolve(distDir, "dead-signal.html");

await buildMod({
    entryPoint: "src/index.ts",
    outfile,
});

await mkdir(distDir, { recursive: true });
await cp(dssAppSource, dssAppOutput, { force: true });

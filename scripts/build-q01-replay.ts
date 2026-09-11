import { buildMod } from "@hotbunny/hackhub-content-sdk/build";
import {
    mkdir,
    readFile,
    rm,
    writeFile,
} from "node:fs/promises";
import { dirname, resolve } from "node:path";

const projectRoot = resolve(process.cwd());
const replayStatePath = resolve(projectRoot, ".dev-q01-replay-run");
const generatedIdPath = resolve(
    projectRoot,
    "dev/replay-id.generated.ts",
);
const replayOutputDir = resolve(projectRoot, "dist-replay");
const replayManifestPath = resolve(
    replayOutputDir,
    "manifest.json",
);

const previousRun = Number.parseInt(
    await readFile(replayStatePath, "utf8").catch(() => "0"),
    10,
);
const replayRun = Number.isFinite(previousRun) ? previousRun + 1 : 1;
const replayId = `r${replayRun}-${Date.now().toString(36)}`;

await mkdir(dirname(generatedIdPath), { recursive: true });
await writeFile(
    generatedIdPath,
    `export const DEV_Q01_REPLAY_ID = ${JSON.stringify(replayId)};\n`,
    "utf8",
);
await writeFile(replayStatePath, `${replayRun}\n`, "utf8");

await rm(replayOutputDir, { recursive: true, force: true });

await buildMod({
    entryPoint: "dev/q01-replay-entry.ts",
    outfile: "dist-replay/mod.js",
});

const manifest = JSON.parse(
    await readFile(replayManifestPath, "utf8"),
) as Record<string, unknown>;

manifest.id = "dead-signal-dev";
manifest.name = "DEAD SIGNAL (Development)";
manifest.version = `0.1.0-dev.${replayId}`;
manifest.description =
    `Development build for repeating Q01 live tests (${replayId}).`;

await writeFile(
    replayManifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
);

console.log(`Q01 replay build created: ${replayId}`);
console.log(`Output: ${replayOutputDir}`);
console.log(
    "Install dist-replay into HackHub/mods/dead-signal-dev and restart HackHub.",
);

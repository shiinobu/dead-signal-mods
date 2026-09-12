import { buildMod } from "@hotbunny/hackhub-content-sdk/build";
import {
    cp,
    mkdir,
    readFile,
    rm,
    stat,
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
const replayModPath = resolve(replayOutputDir, "mod.js");
const sourceManifestPath = resolve(projectRoot, "manifest.json");
const sourceAssetsDir = resolve(projectRoot, "public/assets");
const replayAssetsDir = resolve(replayOutputDir, "assets");
const replayAvatarPath = resolve(replayAssetsDir, "adrian-cole.png");

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
    outfile: replayModPath,
});

const replayBundle = await readFile(replayModPath, "utf8");
const requiredBundleMarkers = [
    "portal.skynet-logistics.idx",
    "security.skynet-logistics.idx",
    "www.skynet-logistics.idx",
];

for (const marker of requiredBundleMarkers) {
    if (!replayBundle.includes(marker)) {
        throw new Error(
            `Q01 replay bundle is stale or incomplete: missing fixture marker ${marker}`,
        );
    }
}

const sourceManifest = JSON.parse(
    await readFile(sourceManifestPath, "utf8"),
) as Record<string, unknown>;

const manifest: Record<string, unknown> = {
    ...sourceManifest,
    id: "dead-signal-dev",
    name: "DEAD SIGNAL (Development)",
    version: `0.1.0-dev.${replayId}`,
    description:
        `Development build for repeating Q01 live tests (${replayId}).`,
};

await writeFile(
    replayManifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
);

await mkdir(replayAssetsDir, { recursive: true });
await cp(sourceAssetsDir, replayAssetsDir, {
    recursive: true,
    force: true,
});

const requiredFiles = [
    replayModPath,
    replayManifestPath,
    replayAvatarPath,
];

for (const requiredFile of requiredFiles) {
    const fileInfo = await stat(requiredFile).catch(() => null);

    if (!fileInfo?.isFile()) {
        throw new Error(
            `Q01 replay package is incomplete: missing ${requiredFile}`,
        );
    }
}

console.log(`Q01 replay build created: ${replayId}`);
console.log(`Output: ${replayOutputDir}`);
console.log("Verified bundle markers:");
for (const marker of requiredBundleMarkers) {
    console.log(`  - ${marker}`);
}
console.log("Package contents:");
console.log("  - mod.js");
console.log("  - manifest.json");
console.log("  - assets/adrian-cole.png");
console.log(
    "Install the complete dist-replay contents into HackHub/mods/dead-signal-dev and restart HackHub.",
);

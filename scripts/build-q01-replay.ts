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
const replayAppPath = resolve(replayOutputDir, "dead-signal.html");
const sourceManifestPath = resolve(projectRoot, "manifest.json");
const sourceAssetsDir = resolve(projectRoot, "public/assets");
const sourceDssAppPath = resolve(projectRoot, "src/dead-signal.html");
const replayAssetsDir = resolve(replayOutputDir, "assets");
const replayAvatarPath = resolve(replayAssetsDir, "adrian-cole.png");
const replayDssIconPath = resolve(replayAssetsDir, "dss.svg");

// One-time development reinstall namespace. This forces HackHub to load the
// replay as a clean mod installation while the DSS application identity stays
// stable as AppName = "dss" and the quest remains uniquely replayed.
const replayModId = "dead-signal-dev-refresh";

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
    "DeadSignalApp",
    "dss",
    "ReconCommand",
    "Q01_RECON_PROFILE",
    "OPERATIONS WORKSPACE",
    "portal.skynet-logistics.idx",
    "security.skynet-logistics.idx",
    "www.skynet-logistics.idx",
];

for (const marker of requiredBundleMarkers) {
    if (!replayBundle.includes(marker)) {
        throw new Error(
            `Q01 replay bundle is stale or incomplete: missing DSS fixture marker ${marker}`,
        );
    }
}

const sourceManifest = JSON.parse(
    await readFile(sourceManifestPath, "utf8"),
) as Record<string, unknown>;

const manifest: Record<string, unknown> = {
    ...sourceManifest,
    id: replayModId,
    name: "DSS (Development Refresh)",
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
// Keep a readable source copy in the replay package for inspection. The
// runtime App HTML is now bundled into mod.js via the HTML module import.
await cp(sourceDssAppPath, replayAppPath, { force: true });

const requiredFiles = [
    replayModPath,
    replayManifestPath,
    replayAppPath,
    replayAvatarPath,
    replayDssIconPath,
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
console.log(`Replay mod id: ${replayModId}`);
console.log("Verified bundle markers:");
for (const marker of requiredBundleMarkers) {
    console.log(`  - ${marker}`);
}
console.log("Package contents:");
console.log("  - mod.js");
console.log("  - manifest.json");
console.log("  - dead-signal.html (inspection copy)");
console.log("  - assets/adrian-cole.png");
console.log("  - assets/dss.svg");
console.log(
    `Install the complete dist-replay contents into HackHub/mods/${replayModId} and restart HackHub.`,
);

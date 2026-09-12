import { buildMod } from "@hotbunny/hackhub-content-sdk/build";
import {
    mkdir,
    readFile,
    rm,
    stat,
    writeFile,
} from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(process.cwd());
const outputDir = resolve(projectRoot, "dist-ssh-random-smoke");
const outputMod = resolve(outputDir, "mod.js");
const outputManifest = resolve(outputDir, "manifest.json");
const generatedIdPath = resolve(
    projectRoot,
    "dev/ssh-native-random-smoke-id.generated.ts",
);
const sourceManifestPath = resolve(projectRoot, "manifest.json");

const smokeId = `r${Date.now().toString(36)}`;

await writeFile(
    generatedIdPath,
    `export const DEV_SSH_RANDOM_SMOKE_ID = ${JSON.stringify(smokeId)};\n`,
    "utf8",
);

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

await buildMod({
    entryPoint: "dev/ssh-native-random-smoke-test-entry.ts",
    outfile: outputMod,
});

const sourceManifest = JSON.parse(
    await readFile(sourceManifestPath, "utf8"),
) as Record<string, unknown>;

const manifest: Record<string, unknown> = {
    ...sourceManifest,
    id: "dead-signal-ssh-random-smoke",
    name: "DEAD SIGNAL — Native SSH Random-IP Smoke Test",
    version: `0.1.0-dev.${smokeId}`,
    description:
        `Minimal native SSH smoke test using Network.randomIp() (${smokeId}).`,
};

await writeFile(
    outputManifest,
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
);

for (const requiredFile of [outputMod, outputManifest]) {
    const info = await stat(requiredFile).catch(() => null);

    if (!info?.isFile()) {
        throw new Error(`Random-IP SSH smoke package is incomplete: ${requiredFile}`);
    }
}

console.log(`Random-IP native SSH smoke build created: ${smokeId}`);
console.log(`Output: ${outputDir}`);
console.log("Package contents:");
console.log("  - mod.js");
console.log("  - manifest.json");
console.log(
    "Install the complete dist-ssh-random-smoke contents into HackHub/mods/dead-signal-ssh-random-smoke and restart HackHub.",
);

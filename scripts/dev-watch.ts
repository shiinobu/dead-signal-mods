import { buildMod } from "@hotbunny/hackhub-content-sdk/build";
import { watch } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const watchedPaths = [
    resolve(root, "src"),
    resolve(root, "esbuild.config.ts"),
    resolve(root, "manifest.json"),
];

let building = false;
let queued = false;
let timer: NodeJS.Timeout | undefined;

async function runBuild() {
    if (building) {
        queued = true;
        return;
    }

    building = true;
    console.log("[DEAD SIGNAL] Building mod...");

    try {
        await buildMod({
            entryPoint: "src/index.ts",
            outfile: "dist/mod.js",
        });
        console.log("[DEAD SIGNAL] Build complete. Watching for changes...");
    } catch (error) {
        console.error("[DEAD SIGNAL] Build failed:", error);
    } finally {
        building = false;

        if (queued) {
            queued = false;
            void runBuild();
        }
    }
}

function scheduleBuild() {
    if (timer) {
        clearTimeout(timer);
    }

    timer = setTimeout(() => {
        timer = undefined;
        void runBuild();
    }, 150);
}

for (const path of watchedPaths) {
    try {
        watch(path, { recursive: true }, (_eventType, filename) => {
            console.log(`[DEAD SIGNAL] Change detected: ${filename ?? path}`);
            scheduleBuild();
        });
    } catch (error) {
        console.error(`[DEAD SIGNAL] Failed to watch ${path}:`, error);
        process.exitCode = 1;
    }
}

void runBuild();

function shutdown() {
    if (timer) {
        clearTimeout(timer);
    }
    console.log("\n[DEAD SIGNAL] Watcher stopped.");
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

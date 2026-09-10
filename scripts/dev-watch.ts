import { spawn } from "node:child_process";
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

function runBuild() {
    if (building) {
        queued = true;
        return;
    }

    building = true;
    console.log("[DEAD SIGNAL] Building mod...");

    const command = process.platform === "win32" ? "npm.cmd" : "npm";
    const child = spawn(command, ["run", "build"], {
        cwd: root,
        stdio: "inherit",
    });

    child.on("close", (code) => {
        building = false;

        if (code === 0) {
            console.log("[DEAD SIGNAL] Build complete. Watching for changes...");
        } else {
            console.error(`[DEAD SIGNAL] Build failed with exit code ${code ?? "unknown"}.`);
        }

        if (queued) {
            queued = false;
            runBuild();
        }
    });
}

function scheduleBuild() {
    if (timer) {
        clearTimeout(timer);
    }

    timer = setTimeout(() => {
        timer = undefined;
        runBuild();
    }, 150);
}

for (const path of watchedPaths) {
    try {
        watch(path, { recursive: true }, (_eventType, filename) => {
            console.log(
                `[DEAD SIGNAL] Change detected: ${filename ?? path}`,
            );
            scheduleBuild();
        });
    } catch (error) {
        console.error(`[DEAD SIGNAL] Failed to watch ${path}:`, error);
        process.exitCode = 1;
    }
}

runBuild();

function shutdown() {
    if (timer) {
        clearTimeout(timer);
    }
    console.log("\n[DEAD SIGNAL] Watcher stopped.");
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

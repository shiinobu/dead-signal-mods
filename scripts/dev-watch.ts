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
let buildProcess: ReturnType<typeof spawn> | undefined;

function runBuild() {
    if (building) {
        queued = true;
        return;
    }

    building = true;
    console.log("[DEAD SIGNAL] Building mod...");

    // Spawn Node directly instead of npm.cmd. On Windows, spawning the
    // .cmd shim can fail with EINVAL under newer Node runtimes.
    const tsxCli = resolve(root, "node_modules/tsx/dist/cli.mjs");
    buildProcess = spawn(process.execPath, [tsxCli, "esbuild.config.ts"], {
        cwd: root,
        stdio: "inherit",
        windowsHide: false,
    });

    buildProcess.once("error", (error) => {
        console.error("[DEAD SIGNAL] Build process failed to start:", error);
    });

    buildProcess.once("close", (code, signal) => {
        buildProcess = undefined;
        building = false;

        if (code === 0) {
            console.log("[DEAD SIGNAL] Build complete. Watching for changes...");
        } else {
            console.error(
                `[DEAD SIGNAL] Build failed (code=${code ?? "null"}, signal=${signal ?? "none"}).`,
            );
        }

        if (queued) {
            queued = false;
            scheduleBuild();
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
    }, 300);
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

runBuild();

function shutdown() {
    if (timer) {
        clearTimeout(timer);
    }

    if (buildProcess) {
        buildProcess.kill();
        buildProcess = undefined;
    }

    console.log("\n[DEAD SIGNAL] Watcher stopped.");
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

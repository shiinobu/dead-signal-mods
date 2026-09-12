import { buildMod } from "@hotbunny/hackhub-content-sdk/build";

await buildMod({
    entryPoint: "src/index.ts",
    outfile: "dist/mod.js",
});

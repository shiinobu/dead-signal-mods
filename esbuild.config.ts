import { buildMod } from "@hotbunny/hackhub-content-sdk/build";

buildMod({
    entryPoint: "src/index.ts",
    outfile: "dist/mod.js",
});

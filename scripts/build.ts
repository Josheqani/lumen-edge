import { build } from "bun";

console.log("Building lumen-edge worker bundle...");

const result = await build({
  entrypoints: ["src/index.ts"],
  outdir: "dist",
  naming: "worker.js",
  target: "browser",
  format: "esm",
  minify: true,
  external: ["cloudflare:sockets"],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});

if (!result.success) {
  console.error("Build failed:");
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

const file = Bun.file("dist/worker.js");
console.log(`Successfully built dist/worker.js (${(file.size / 1024).toFixed(1)} KB)`);

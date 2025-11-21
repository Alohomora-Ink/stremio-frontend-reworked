import { build } from "esbuild";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync, mkdirSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

const workerEntry = join(
  projectRoot,
  "node_modules/@stremio/stremio-core-web/worker.js"
);
const outDir = join(projectRoot, "public");

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

console.log("📦 Bundling Stremio Core Worker...");

build({
  entryPoints: [workerEntry],
  bundle: true,
  outfile: join(outDir, "worker.js"),
  format: "iife",
  platform: "browser",
  loader: {
    ".wasm": "file"
  },
  define: {
    "process.env.NODE_ENV": '"development"',
    global: "self"
  },
  publicPath: "/",
  sourcemap: true
})
  .then(() => {
    console.log("✅ Worker bundled successfully to public/worker.js");
  })
  .catch((err) => {
    console.error("❌ Build failed:", err);
    process.exit(1);
  });

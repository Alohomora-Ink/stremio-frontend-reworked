import { copyFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, "..");
const sourceWasm = join(
  projectRoot,
  "node_modules",
  "@stremio",
  "stremio-core-web",
  "stremio_core_web_bg.wasm",
);
const destDir = join(projectRoot, "public");
const destWasm = join(destDir, "stremio_core_web_bg.wasm");

try {
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }
  copyFileSync(sourceWasm, destWasm);
  console.log(
    "✅ WASM file copied successfully to public/stremio_core_web_bg.wasm",
  );
} catch (error) {
  if (error instanceof Error) {
    console.error("❌ Failed to copy WASM file:", error.message);
  } else {
    console.error("❌ Failed to copy WASM file:", String(error));
  }
  process.exit(1);
}

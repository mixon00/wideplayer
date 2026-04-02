import { build } from "vite";
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const rootDirectory = resolve(dirname(currentFile), "..");
const sourceDirectory = join(rootDirectory, "src");
const distributionDirectory = join(rootDirectory, "dist");
const baseBuildDirectory = join(distributionDirectory, "base");
const browserDirectories = ["chrome", "firefox", "safari"];
const ignoredEntries = new Set([".DS_Store"]);

function removeDistribution() {
  rmSync(distributionDirectory, { force: true, recursive: true });
}

function copyDirectory(sourceDirectory, targetDirectory) {
  mkdirSync(targetDirectory, { recursive: true });

  for (const entry of readdirSync(sourceDirectory)) {
    if (ignoredEntries.has(entry)) {
      continue;
    }

    const sourcePath = join(sourceDirectory, entry);
    const targetPath = join(targetDirectory, entry);
    const sourceStats = statSync(sourcePath);

    if (sourceStats.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
      continue;
    }

    if (entry.endsWith(".md")) {
      continue;
    }

    cpSync(sourcePath, targetPath);
  }
}

function buildBrowser(browserName) {
  const browserSourceDirectory = join(rootDirectory, browserName);
  const browserTargetDirectory = join(distributionDirectory, browserName);

  if (!existsSync(browserSourceDirectory)) {
    throw new Error(`Missing browser directory: ${browserName}`);
  }

  mkdirSync(browserTargetDirectory, { recursive: true });
  copyDirectory(baseBuildDirectory, browserTargetDirectory);
  copyDirectory(browserSourceDirectory, browserTargetDirectory);
}

async function runViteBuilds() {
  const sharedConfig = {
    appType: "custom",
    base: "./",
    configFile: false,
    publicDir: false,
    root: sourceDirectory,
  };

  await build({
    ...sharedConfig,
    build: {
      emptyOutDir: true,
      minify: false,
      outDir: baseBuildDirectory,
      rollupOptions: {
        input: {
          options: join(sourceDirectory, "options.html"),
          popup: join(sourceDirectory, "popup.html"),
        },
        output: {
          assetFileNames: "assets/[name][extname]",
          chunkFileNames: "chunks/[name].js",
          entryFileNames: "[name].js",
        },
      },
      sourcemap: true,
      target: "es2022",
    },
  });

  await build({
    ...sharedConfig,
    build: {
      emptyOutDir: false,
      lib: {
        entry: join(sourceDirectory, "content/index.ts"),
        fileName: () => "content.js",
        formats: ["iife"],
        name: "WidePlayerContent",
      },
      minify: false,
      outDir: baseBuildDirectory,
      rollupOptions: {
        output: {
          assetFileNames: "assets/[name][extname]",
          inlineDynamicImports: true,
        },
      },
      sourcemap: true,
      target: "es2022",
    },
  });

  await build({
    ...sharedConfig,
    build: {
      emptyOutDir: false,
      lib: {
        entry: join(sourceDirectory, "background/index.ts"),
        fileName: () => "background.js",
        formats: ["iife"],
        name: "WidePlayerBackground",
      },
      minify: false,
      outDir: baseBuildDirectory,
      rollupOptions: {
        output: {
          assetFileNames: "assets/[name][extname]",
          inlineDynamicImports: true,
        },
      },
      sourcemap: true,
      target: "es2022",
    },
  });
}

if (process.argv.includes("--clean")) {
  removeDistribution();
  console.log("Removed dist directory.");
  process.exit(0);
}

removeDistribution();
mkdirSync(distributionDirectory, { recursive: true });
await runViteBuilds();

for (const browserName of browserDirectories) {
  buildBrowser(browserName);
  console.log(`Built ${browserName} extension in dist/${browserName}`);
}

rmSync(baseBuildDirectory, { force: true, recursive: true });

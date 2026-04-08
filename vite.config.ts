import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";

const currentFile = fileURLToPath(import.meta.url);
const rootDirectory = dirname(currentFile);
const sourceDirectory = join(rootDirectory, "src");
const browserDirectories = ["chrome", "firefox", "safari"] as const;
const buildTargets = ["ui", "content", "background"] as const;
const sharedAssetDirectories = ["icons"] as const;
const ignoredEntries = new Set([".DS_Store"]);
const buildStatePath = join(rootDirectory, ".wideplayer-build.json");
const packageJson = JSON.parse(readFileSync(join(rootDirectory, "package.json"), "utf8")) as {
  version?: string;
};
const buildState = existsSync(buildStatePath)
  ? (JSON.parse(readFileSync(buildStatePath, "utf8")) as {
      buildNumber?: number;
      buildId?: string;
      version?: string;
    })
  : null;

type BrowserName = (typeof browserDirectories)[number];
type BuildTarget = (typeof buildTargets)[number];

interface BuildMode {
  browser: BrowserName;
  target: BuildTarget;
}

function readPackageVersion(): string {
  if (typeof packageJson?.version === "string" && packageJson.version.length > 0) {
    return packageJson.version;
  }

  throw new Error("Unable to resolve package version from package.json.");
}

function readBuildId(): string {
  const version = readPackageVersion();

  if (
    buildState?.version === version &&
    Number.isInteger(buildState.buildNumber) &&
    (buildState.buildNumber ?? 0) > 0
  ) {
    return `${version}+${buildState.buildNumber}`;
  }

  return `${version}+0`;
}

function copyDirectory(sourceDirectoryPath: string, targetDirectoryPath: string): void {
  mkdirSync(targetDirectoryPath, { recursive: true });

  for (const entry of readdirSync(sourceDirectoryPath)) {
    if (ignoredEntries.has(entry)) {
      continue;
    }

    const sourcePath = join(sourceDirectoryPath, entry);
    const targetPath = join(targetDirectoryPath, entry);
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

function copyBrowserFilesPlugin(browser: BrowserName, outputDirectory: string): Plugin {
  return {
    apply: "build",
    name: "wideplayer-copy-browser-files",
    writeBundle() {
      const browserSourceDirectory = join(rootDirectory, browser);

      if (!existsSync(browserSourceDirectory)) {
        throw new Error(`Missing browser directory: ${browser}`);
      }

      copyDirectory(browserSourceDirectory, outputDirectory);

      for (const directoryName of sharedAssetDirectories) {
        const assetSourceDirectory = join(rootDirectory, directoryName);

        if (!existsSync(assetSourceDirectory)) {
          continue;
        }

        copyDirectory(assetSourceDirectory, join(outputDirectory, directoryName));
      }
    },
  };
}

function isBrowserName(value: string): value is BrowserName {
  return browserDirectories.includes(value as BrowserName);
}

function isBuildTarget(value: string): value is BuildTarget {
  return buildTargets.includes(value as BuildTarget);
}

function parseMode(mode: string): BuildMode {
  const [browser, target] = mode.split("-");

  if (!browser || !target || !isBrowserName(browser) || !isBuildTarget(target)) {
    throw new Error(
      `Unsupported Vite mode "${mode}". Use one of ${browserDirectories
        .flatMap((browserName) => buildTargets.map((buildTarget) => `${browserName}-${buildTarget}`))
        .join(", ")}.`
    );
  }

  return { browser, target };
}

export default defineConfig(({ mode }) => {
  const { browser, target } = parseMode(mode);
  const outputDirectory = resolve(rootDirectory, "dist", browser);
  const plugins = [copyBrowserFilesPlugin(browser, outputDirectory)];
  const buildId = readBuildId();
  const define = {
    __WIDEPLAYER_BUILD_ID__: JSON.stringify(buildId),
  };

  if (target === "ui") {
    return {
      appType: "custom",
      base: "./",
      build: {
        emptyOutDir: false,
        minify: false,
        outDir: outputDirectory,
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
      define,
      plugins,
      publicDir: false,
      root: sourceDirectory,
    };
  }

  const isContentBuild = target === "content";

  return {
    appType: "custom",
    base: "./",
    build: {
      emptyOutDir: false,
      lib: {
        entry: join(sourceDirectory, isContentBuild ? "content/index.ts" : "background/index.ts"),
        fileName: () => `${target}.js`,
        formats: ["iife"],
        name: isContentBuild ? "WidePlayerContent" : "WidePlayerBackground",
      },
      minify: false,
      outDir: outputDirectory,
      rollupOptions: {
        output: {
          assetFileNames: "assets/[name][extname]",
          inlineDynamicImports: true,
        },
      },
      sourcemap: true,
      target: "es2022",
    },
    define,
    plugins,
    publicDir: false,
    root: sourceDirectory,
  };
});

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const scriptsDirectory = dirname(currentFile);
const rootDirectory = dirname(scriptsDirectory);
const packageJsonPath = join(rootDirectory, "package.json");
const buildStatePath = join(rootDirectory, ".wideplayer-build.json");

function readJsonFile(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

const packageJson = readJsonFile(packageJsonPath);

if (typeof packageJson.version !== "string" || packageJson.version.length === 0) {
  throw new Error("Unable to resolve package version from package.json.");
}

const version = packageJson.version;
const previousState = existsSync(buildStatePath) ? readJsonFile(buildStatePath) : null;
const shouldResetCounter = previousState?.version !== version;
const previousBuildNumber =
  !shouldResetCounter && Number.isInteger(previousState?.buildNumber)
    ? previousState.buildNumber
    : 0;
const buildNumber = previousBuildNumber + 1;
const buildState = {
  buildId: `${version}+${buildNumber}`,
  buildNumber,
  version,
};

writeFileSync(buildStatePath, `${JSON.stringify(buildState, null, 2)}\n`, "utf8");

console.log(`Prepared build ${buildState.buildId}`);

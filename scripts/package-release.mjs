import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { deflateRawSync } from "node:zlib";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const scriptsDirectory = dirname(currentFile);
const rootDirectory = dirname(scriptsDirectory);
const distDirectory = join(rootDirectory, "dist");
const releaseDirectory = join(rootDirectory, "release");
const packageJsonPath = join(rootDirectory, "package.json");
const supportedBrowsers = ["chrome", "firefox", "safari"];
const ignoredFileNames = new Set([".DS_Store", "icon_source.png"]);
const ignoredExtensions = new Set([".map"]);

function readJsonFile(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function resolveVersion() {
  const packageJson = readJsonFile(packageJsonPath);

  if (typeof packageJson.version === "string" && packageJson.version.length > 0) {
    return packageJson.version;
  }

  throw new Error("Unable to resolve package version from package.json.");
}

function resolveBrowsers() {
  const requestedBrowsers = process.argv.slice(2);

  if (requestedBrowsers.length === 0) {
    return supportedBrowsers;
  }

  for (const browser of requestedBrowsers) {
    if (!supportedBrowsers.includes(browser)) {
      throw new Error(
        `Unsupported browser "${browser}". Use one of: ${supportedBrowsers.join(", ")}.`
      );
    }
  }

  return requestedBrowsers;
}

function shouldIncludeFile(path) {
  const normalizedPath = path.replace(/\\/g, "/");
  const fileName = normalizedPath.split("/").pop();

  if (!fileName || ignoredFileNames.has(fileName)) {
    return false;
  }

  for (const extension of ignoredExtensions) {
    if (normalizedPath.endsWith(extension)) {
      return false;
    }
  }

  return true;
}

function collectFiles(rootPath, directoryPath = rootPath) {
  const fileEntries = [];

  for (const entry of readdirSync(directoryPath)) {
    if (ignoredFileNames.has(entry)) {
      continue;
    }

    const sourcePath = join(directoryPath, entry);
    const stats = statSync(sourcePath);

    if (stats.isDirectory()) {
      fileEntries.push(...collectFiles(rootPath, sourcePath));
      continue;
    }

    const relativePath = relative(rootPath, sourcePath);

    if (!shouldIncludeFile(relativePath)) {
      continue;
    }

    fileEntries.push({
      contents: readFileSync(sourcePath),
      mode: stats.mode,
      modifiedAt: stats.mtime,
      relativePath,
    });
  }

  return fileEntries.sort((left, right) => left.relativePath.localeCompare(right.relativePath));
}

function createCrc32Table() {
  const table = new Uint32Array(256);

  for (let index = 0; index < 256; index += 1) {
    let value = index;

    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) === 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }

    table[index] = value >>> 0;
  }

  return table;
}

const crc32Table = createCrc32Table();

function calculateCrc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc = crc32Table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function toDosDateTime(date) {
  const safeYear = Math.max(1980, date.getFullYear());
  const dosDate = ((safeYear - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1);

  return {
    date: dosDate & 0xffff,
    time: dosTime & 0xffff,
  };
}

function createZipArchive(fileEntries) {
  const localChunks = [];
  const centralChunks = [];
  let currentOffset = 0;

  for (const fileEntry of fileEntries) {
    const normalizedPath = fileEntry.relativePath.replace(/\\/g, "/");
    const fileNameBuffer = Buffer.from(normalizedPath, "utf8");
    const compressedContents = deflateRawSync(fileEntry.contents);
    const crc32 = calculateCrc32(fileEntry.contents);
    const { date, time } = toDosDateTime(fileEntry.modifiedAt);

    const localHeader = Buffer.alloc(30 + fileNameBuffer.length);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(8, 8);
    localHeader.writeUInt16LE(time, 10);
    localHeader.writeUInt16LE(date, 12);
    localHeader.writeUInt32LE(crc32, 14);
    localHeader.writeUInt32LE(compressedContents.length, 18);
    localHeader.writeUInt32LE(fileEntry.contents.length, 22);
    localHeader.writeUInt16LE(fileNameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28);
    fileNameBuffer.copy(localHeader, 30);

    localChunks.push(localHeader, compressedContents);

    const centralHeader = Buffer.alloc(46 + fileNameBuffer.length);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(8, 10);
    centralHeader.writeUInt16LE(time, 12);
    centralHeader.writeUInt16LE(date, 14);
    centralHeader.writeUInt32LE(crc32, 16);
    centralHeader.writeUInt32LE(compressedContents.length, 20);
    centralHeader.writeUInt32LE(fileEntry.contents.length, 24);
    centralHeader.writeUInt16LE(fileNameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE((((fileEntry.mode & 0xffff) << 16) >>> 0), 38);
    centralHeader.writeUInt32LE(currentOffset, 42);
    fileNameBuffer.copy(centralHeader, 46);

    centralChunks.push(centralHeader);
    currentOffset += localHeader.length + compressedContents.length;
  }

  const centralDirectory = Buffer.concat(centralChunks);
  const endOfCentralDirectory = Buffer.alloc(22);
  endOfCentralDirectory.writeUInt32LE(0x06054b50, 0);
  endOfCentralDirectory.writeUInt16LE(0, 4);
  endOfCentralDirectory.writeUInt16LE(0, 6);
  endOfCentralDirectory.writeUInt16LE(fileEntries.length, 8);
  endOfCentralDirectory.writeUInt16LE(fileEntries.length, 10);
  endOfCentralDirectory.writeUInt32LE(centralDirectory.length, 12);
  endOfCentralDirectory.writeUInt32LE(currentOffset, 16);
  endOfCentralDirectory.writeUInt16LE(0, 20);

  return Buffer.concat([...localChunks, centralDirectory, endOfCentralDirectory]);
}

function packageBrowser(browser, version) {
  const browserDistDirectory = resolve(distDirectory, browser);

  if (!existsSync(browserDistDirectory)) {
    throw new Error(
      `Missing build output for "${browser}" at ${browserDistDirectory}. Run the corresponding build first.`
    );
  }

  const fileEntries = collectFiles(browserDistDirectory);

  if (fileEntries.length === 0) {
    throw new Error(`No files found to package for "${browser}".`);
  }

  mkdirSync(releaseDirectory, { recursive: true });

  const archiveName = `wideplayer-for-x-${version}-${browser}.zip`;
  const archivePath = join(releaseDirectory, archiveName);

  if (existsSync(archivePath)) {
    rmSync(archivePath, { force: true });
  }

  const archiveBuffer = createZipArchive(fileEntries);
  writeFileSync(archivePath, archiveBuffer);
  console.log(`Created ${relative(rootDirectory, archivePath)}`);
}

const version = resolveVersion();
const browsers = resolveBrowsers();

for (const browser of browsers) {
  packageBrowser(browser, version);
}

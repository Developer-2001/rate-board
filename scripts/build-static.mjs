import { access, mkdir, rename, rm } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const rootDir = process.cwd();
const nextBin = path.join(rootDir, "node_modules", "next", "dist", "bin", "next");
const nextBuildDir = path.join(rootDir, ".next");
const backupRootDir = path.join(rootDir, ".static-build-backup");

const temporaryMoves = [
  {
    source: path.join(rootDir, "middleware.ts"),
    backup: path.join(backupRootDir, "middleware.ts"),
  },
  {
    source: path.join(rootDir, "src", "app", "api", "auth", "token", "route.ts"),
    backup: path.join(
      backupRootDir,
      "src",
      "app",
      "api",
      "auth",
      "token",
      "route.ts"
    ),
  },
  {
    source: path.join(rootDir, "src", "app", "api", "auth", "corporateId", "route.ts"),
    backup: path.join(
      backupRootDir,
      "src",
      "app",
      "api",
      "auth",
      "corporateId",
      "route.ts"
    ),
  },
  {
    source: path.join(rootDir, "src", "app", "api", "auth", "verify", "route.ts"),
    backup: path.join(
      backupRootDir,
      "src",
      "app",
      "api",
      "auth",
      "verify",
      "route.ts"
    ),
  },
  {
    source: path.join(rootDir, "src", "app", "api", "auth", "register", "route.ts"),
    backup: path.join(
      backupRootDir,
      "src",
      "app",
      "api",
      "auth",
      "register",
      "route.ts"
    ),
  },
  {
    source: path.join(rootDir, "src", "app", "api", "auth", "logout", "route.ts"),
    backup: path.join(
      backupRootDir,
      "src",
      "app",
      "api",
      "auth",
      "logout",
      "route.ts"
    ),
  },
  {
    source: path.join(rootDir, "src", "app", "api", "device", "register", "route.ts"),
    backup: path.join(
      backupRootDir,
      "src",
      "app",
      "api",
      "device",
      "register",
      "route.ts"
    ),
  },
  {
    source: path.join(rootDir, "src", "app", "api", "rate-board", "[clientId]", "route.ts"),
    backup: path.join(
      backupRootDir,
      "src",
      "app",
      "api",
      "rate-board",
      "[clientId]",
      "route.ts"
    ),
  },
];

async function exists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function moveIfPresent(source, backup) {
  if (!(await exists(source))) {
    return false;
  }

  if (await exists(backup)) {
    throw new Error(`Backup path already exists: ${backup}`);
  }

  await mkdir(path.dirname(backup), { recursive: true });
  await rename(source, backup);
  return true;
}

async function restoreIfPresent(backup, source) {
  if (await exists(backup)) {
    await rename(backup, source);
  }
}

function runNextBuild() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [nextBin, "build"], {
      cwd: rootDir,
      stdio: "inherit",
      env: {
        ...process.env,
        NEXT_OUTPUT_MODE: "export",
      },
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Static export build failed with exit code ${code ?? "unknown"}.`));
    });

    child.on("error", reject);
  });
}

const movedEntries = [];

try {
  await rm(nextBuildDir, { recursive: true, force: true });
  await rm(backupRootDir, { recursive: true, force: true });

  for (const entry of temporaryMoves) {
    const moved = await moveIfPresent(entry.source, entry.backup);
    if (moved) {
      movedEntries.push(entry);
    }
  }

  await runNextBuild();
} finally {
  for (const entry of movedEntries.reverse()) {
    await restoreIfPresent(entry.backup, entry.source);
  }

  await rm(backupRootDir, { recursive: true, force: true });
}

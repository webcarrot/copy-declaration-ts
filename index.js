const fs = require("fs");
const { join, isAbsolute } = require("path");
const { stat, mkdir, writeFile, readFile, readdir } = fs.promises;

const getPath = async path => {
  const fullPath = isAbsolute(path) ? path : join(process.cwd(), path);
  const info = await stat(fullPath);
  if (info.isDirectory()) {
    return fullPath;
  } else {
    throw new Error(`Invalid path ${path}`);
  }
};

const DIR_CACHE = new Map();

const checkDir = async path => {
  if (!DIR_CACHE.has(path)) {
    try {
      const info = await stat(path);
      if (info.isDirectory()) {
        DIR_CACHE.set(path, true);
      } else {
        DIR_CACHE.set(path, false);
      }
    } catch (_) {
      try {
        await mkdir(path, { recursive: true });
        DIR_CACHE.set(path, true);
      } catch (_) {
        DIR_CACHE.set(path, false);
      }
    }
  }
  return DIR_CACHE.get(path);
};

const copy = async (fromDir, toDir) => {
  const data = await readdir(fromDir);
  await Promise.all(
    data.map(async path => {
      const fromPath = join(fromDir, path);
      const toPath = join(toDir, path);
      const info = await stat(fromPath);
      if (info.isDirectory()) {
        await copy(fromPath, toPath);
      } else if (info.isFile() && path.endsWith(".d.ts")) {
        if (await checkDir(toDir)) {
          await writeFile(toPath, await readFile(fromPath));
        } else {
          throw new Error(`Directory could not be created ${toDir}`);
        }
      }
    })
  );
};

(async (fromRaw, toRaw) =>
  await copy(await getPath(fromRaw), await getPath(toRaw)))(
  process.argv[2],
  process.argv[3]
).catch(err => {
  console.error(err.message);
  process.exit(1);
});

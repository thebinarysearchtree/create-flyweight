const d1 = env.DB;

const traverse = (path) => {
  let map = files;
  for (const key of path) {
    map = map.get(key);
  }
  return map;
}

const readdir = (path) => {
  const map = traverse(path);
  return map.keys();
}

const readFile = (path) => traverse(path);
const writeFile = () => undefined;
const rm = () => undefined;
const readFileSync = readFile;
const join = (...sections) => sections;

export {
  readdir,
  readFile,
  writeFile,
  rm,
  readFileSync,
  join
}
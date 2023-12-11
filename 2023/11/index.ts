import { readFileSync, writeFileSync } from "fs";

const inputDataLines = readFileSync("./data.txt", "utf-8").split("\n");
const galaxies: {
  [key: string]: [number, number];
} = {};
function part1(lines: string[] = inputDataLines): number {
  let galaxyIdx = 1;
  let map: string[][] = lines.map((m) => m.split(""));
  let returnVal = 0;
  let upIdx = 0;
  for (const line of lines) {
    const lineParts = line.split("");
    // Everything is a dot so count this at two.
    if (lineParts.every((f) => f === ".")) {
      map.splice(upIdx, 0, lineParts);
      upIdx++;
    }
    upIdx++;
  }
  let added = 0;
  let len = map[0].length;
  for (let fakeX = 0; fakeX < len; fakeX++) {
    let x = fakeX + added;
    let allDots = false;
    for (let y = 0; y < map.length; y++) {
      allDots = map[y][x] === ".";
      if (!allDots) {
        break;
      }
    }
    if (allDots) {
      for (let y = 0; y < map.length; y++) {
        map[y].splice(x, 0, ".");
      }
      added++;
    }
  }
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "#") {
        galaxies[(galaxyIdx++).toString()] = [x, y];
        map[y][x] = (galaxyIdx - 1).toString();
      }
    }
  }

  const galaxyKeys = Object.keys(galaxies);
  for (const currentKey of galaxyKeys) {
    const [cx, cy] = galaxies[currentKey];
    for (const innerKey of galaxyKeys) {
      if (currentKey === innerKey) {
        continue;
      }
      const [ix, iy] = galaxies[innerKey];
      const [dx, dy] = [cx - ix, cy - iy].map((m) => (m < 0 ? m * -1 : m));
      // console.log(
      //   ` - Betwewen galaxy ${currentKey} and galaxy ${innerKey}: ${dx + dy}`
      // );
      returnVal += dx + dy;
    }
  }
  console.log(galaxies);
  writeFileSync("./out.txt", map.map((m) => m.join("")).join("\n"));
  return returnVal / 2;
}

console.log("part1", part1());

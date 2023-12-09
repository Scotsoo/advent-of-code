import { readFileSync } from "fs";

const inputDataLines = readFileSync("./data.txt", "utf-8").split("\n");

function part1(
  lines: string[] = inputDataLines,
  calculateEnd: boolean = true
): number {
  let total = 0;
  let idxToGet = calculateEnd ? -1 : 0;
  for (const line of lines) {
    let parts = line.split(" ").map((m) => parseInt(m));
    const skippedValCache: number[][] = [parts];
    do {
      let tmpParts: number[] = [];
      for (let index = 0; index < parts.length - 1; index++) {
        let skippedVal = parts[index + 1] - parts[index];
        tmpParts.push(skippedVal);
      }
      skippedValCache.push(tmpParts);
      parts = tmpParts;
    } while (!parts.every((f) => f === 0));

    let prevAddItem = 0;
    let lastValueInserted = 0;

    for (let index = skippedValCache.length - 1; index !== -1; index--) {
      const items = skippedValCache[index];
      if (calculateEnd) {
        lastValueInserted = (items.at(idxToGet) as number) + prevAddItem;
        items.push(lastValueInserted);
      } else {
        lastValueInserted = (items.at(idxToGet) as number) - prevAddItem;
        items.unshift(lastValueInserted);
      }
      prevAddItem = items.at(idxToGet) as number;
    }
    total += lastValueInserted;
  }
  return total;
}
const part2 = () => part1(inputDataLines, false);

console.log("part1", part1());
console.log("part2", part2());

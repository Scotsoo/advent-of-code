import { readFileSync } from "fs";

const inputDataLines = readFileSync("./data.txt", "utf-8").split("\n");
const instructions: ("L" | "R")[] = inputDataLines.shift()?.split("") as (
  | "L"
  | "R"
)[];

type InstructionMap = { [key: string]: { L: string; R: string } };
function buildMap(data: string[]): InstructionMap {
  const map: InstructionMap = {};
  for (const line of data) {
    if (line.length > 2) {
      let [index, items] = line.split(" = ");
      items = items.replace("(", "").replace(")", "");
      const [left, right] = items.split(", ");
      map[index] = {
        L: left,
        R: right,
      };
    }
  }
  return map;
}
function part1(data: string[] = inputDataLines): number {
  let current = "AAA";
  const map = buildMap(data);
  let idx = 0;
  do {
    current = map[current][instructions[idx++ % instructions?.length]];
  } while (current !== "ZZZ");
  return idx;
}

function lowestCommonMultiple(values: number[]) {
  function gcd(a: number, b: number): number {
    // greatest common divisor
    return !b ? a : gcd(b, a % b);
  }

  function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
  }

  var multiple = values.sort()[0];
  values.forEach((n) => {
    multiple = lcm(multiple, n);
  });

  return multiple;
}

function part2(data: string[] = inputDataLines): number {
  const map = buildMap(data);
  const currentNodes = Object.keys(map).filter((f) => f.endsWith("A"));
  const multipliers = currentNodes.map((current) => {
    let idx = 0;
    do {
      current = map[current][instructions[idx++ % instructions?.length]];
    } while (!current.endsWith("Z"));

    return idx;
  });
  return lowestCommonMultiple(multipliers);
}

console.log("part1", part1());
console.log("part2", part2());

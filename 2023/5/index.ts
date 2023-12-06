import { readFileSync } from "fs";

const inputDataLines = readFileSync("./data.txt", "utf-8").split("\n");
const inputSeedsToPlant: number[] = (inputDataLines.shift() as string)
  .replace("seeds: ", "")
  .split(" ")
  .map((m) => parseInt(m));
const headers: string[] = [
  "seed-to-soil map:",
  "soil-to-fertilizer map:",
  "fertilizer-to-water map:",
  "water-to-light map:",
  "light-to-temperature map:",
  "temperature-to-humidity map:",
  "humidity-to-location map:",
];

class ItemMap {
  private dest: number;
  private source: number;
  private range: number;

  constructor(val: string) {
    const [dest, source, range] = val.split(" ").map((m) => parseInt(m));
    this.dest = dest;
    this.source = source;
    this.range = range;
  }
  public getVal(input: number): number | undefined {
    let maxSrc = this.source + this.range;
    if (input <= maxSrc && input >= this.source) {
      return this.dest + input - this.source;
    }
  }
}
function getHeaderObj() {
  const items: {
    [key: string]: ItemMap[];
  } = {};

  let currentInputHeader: string = "";
  for (const input of inputDataLines) {
    if (input.length < 2) {
      // skip;
    } else if (headers.includes(input)) {
      currentInputHeader = input;
      items[currentInputHeader] = [];
    } else {
      items[currentInputHeader].push(new ItemMap(input));
    }
  }
  return items;
}
export function part1(
  seedsToPlant: number[] = inputSeedsToPlant,
  items: ReturnType<typeof getHeaderObj> = getHeaderObj()
) {
  let currentInputHeader: string = "";
  for (const input of inputDataLines) {
    if (input.length < 2) {
      // skip;
    } else if (headers.includes(input)) {
      currentInputHeader = input;
      items[currentInputHeader] = [];
    } else {
      items[currentInputHeader].push(new ItemMap(input));
    }
  }
  let lowestLocNumber = Number.MAX_SAFE_INTEGER;
  for (const seed of seedsToPlant) {
    let current = seed;
    for (const header of headers) {
      let newest: number | undefined = items[header]
        .find((f) => f.getVal(current))
        ?.getVal(current);
      if (newest !== undefined) {
        current = newest;
      }
    }
    if (current < lowestLocNumber) {
      lowestLocNumber = current;
    }
  }
  return lowestLocNumber;
}

export function part2() {
  let idx = 0;
  let current = 0;
  const itemsCache = getHeaderObj();
  let lowest = Number.MAX_SAFE_INTEGER;
  let cache: number[] = [];

  for (const seed of inputSeedsToPlant) {
    if (!(idx % 2)) {
      console.time(seed.toString());
      console.log("CHANGING SEED", seed);
      current = seed;
    } else {
      console.log("\tTimes running", seed);
      for (let index = current; index < current + seed; index++) {
        cache.push(index);
        if (!(index % 10000000)) {
          const value = part1(cache, itemsCache);
          if (value < lowest) {
            lowest = value;
          }
          console.log("current lowest", lowest);
          cache = [];
        }
      }
      const value = part1(cache, itemsCache);
      if (value < lowest) {
        lowest = value;
      }
      console.log("current lowest", lowest);
      console.timeEnd(current.toString());
    }
    idx++;
  }
  return lowest;
}

// console.log("part1", part1());
console.log("part2", part2());

import { readFileSync, writeFileSync } from "fs";

const inputDataLines = readFileSync("./data.txt", "utf-8").split("\n");
function isAdjacent(
  y: number,
  x: number,
  map: string[][],
  checkPredicate: (v: string) => boolean
): boolean {
  const items = [map[y][x - 1], map[y][x + 1]];
  if (y !== 0) {
    items.push(map[y - 1][x - 1], map[y - 1][x], map[y - 1][x + 1]);
  }
  if (y !== map.length - 1) {
    items.push(map[y + 1][x - 1], map[y + 1][x], map[y + 1][x + 1]);
  }
  return items.some(checkPredicate);
}
function makeMap(data: string[]): string[][] {
  const map: string[][] = []; // [y][x]
  for (const line of data) {
    map.push(line.split(""));
  }
  return map;
}
function part1(data: string[] = inputDataLines): number {
  const map = makeMap(data);
  let numbers: number[] = [];
  let number: string = "";
  let numberIsAdjacent = false;
  for (let y = 0; y < map.length; y++) {
    const yMap = map[y];
    for (let x = 0; x < yMap.length; x++) {
      const num = parseInt(yMap[x]);
      if (!Number.isNaN(num)) {
        number += yMap[x].toString();
        if (
          isAdjacent(
            y,
            x,
            map,
            (f) => f !== undefined && f !== "." && Number.isNaN(parseInt(f))
          )
        ) {
          numberIsAdjacent = true;
        }
      } else if (number !== "") {
        if (numberIsAdjacent) {
          numbers.push(parseInt(number));
        }
        number = "";
        numberIsAdjacent = false;
      }
    }
    if (numberIsAdjacent) {
      numbers.push(parseInt(number));
    }
    number = "";
    numberIsAdjacent = false;
  }
  number = "";
  numberIsAdjacent = false;
  return numbers.reduce((a, b) => a + b, 0);
}

function getAdjacentCoords(
  y: number,
  x: number,
  map: string[][]
): [number, number][] {
  const returnItems: [number, number][] = [];
  const leftRight: [number, number][] = [
    [y, x - 1],
    [y, x + 1],
  ];
  const idx = leftRight.find((f) => !Number.isNaN(parseInt(map[f[0]][f[1]])));
  if (idx !== undefined) {
    returnItems.push(idx);
  }
  if (y !== 0) {
    const items: [number, number][] = [
      [y - 1, x - 1],
      [y - 1, x],
      [y - 1, x + 1],
    ];
    const idx = items.find((f) => !Number.isNaN(parseInt(map[f[0]][f[1]])));
    if (idx !== undefined) {
      returnItems.push(idx);
    }
  }
  if (y !== map.length - 1) {
    const items: [number, number][] = [
      [y + 1, x - 1],
      [y + 1, x],
      [y + 1, x + 1],
    ];
    const idx = items.find((f) => !Number.isNaN(parseInt(map[f[0]][f[1]])));
    if (idx !== undefined) {
      returnItems.push(idx);
    }
  }
  return returnItems;
}

function part2(data: string[] = inputDataLines): number {
  const map = makeMap(data);
  const numberCoords: [number, number][][] = [];
  for (let y = 0; y < map.length; y++) {
    const yMap = map[y];
    for (let x = 0; x < yMap.length; x++) {
      if (yMap[x] === "*") {
        const adj = getAdjacentCoords(y, x, map);
        if (adj.length === 2) {
          numberCoords.push(adj);
        }
        if (adj.length > 2) {
          throw new Error("more than 1 match found somehow");
        }
      }
    }
  }
  function getEarliestCoord(y: number, x: number): [number, number] {
    if (Number.isNaN(parseInt(map[y][x]))) {
      return [y, x + 1];
    }
    if (x === 0 || x === map[y].length - 1) {
      return [y, x];
    }
    return getEarliestCoord(y, x - 1);
  }
  function getFullNumber(y: number, x: number, current: string = ""): number {
    const len = map[y].length;
    if (!Number.isNaN(parseInt(map[y][x]))) {
      current += map[y][x];
      if (x !== len - 1) {
        return getFullNumber(y, x + 1, current);
      }
    }
    return parseInt(current);
  }

  const earliest = numberCoords.map((arr) =>
    arr.map(([y, x]) => getEarliestCoord(y, x))
  );
  const fullItems = earliest.map((arr) =>
    arr.map(([y, x]) => {
      const v = getFullNumber(y, x);
      return v;
    })
  );
  let sum = 0;
  for (const [left, right] of fullItems) {
    sum += left * right;
  }
  console.log(fullItems);

  return sum;
}

console.log("part1", part1());
console.log("part2", part2());

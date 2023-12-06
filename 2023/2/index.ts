import { readFileSync } from "fs";

const inputDataLines = readFileSync("./data.txt", "utf-8").split("\n");
interface Cubes {
  red: number;
  green: number;
  blue: number;
}
export function part1(
  data: string[] = inputDataLines,
  criteria: Cubes = {
    red: 12,
    blue: 14,
    green: 13,
  }
): number {
  let total = 0;
  for (const line of data) {
    const [gameIdPart, parts] = line.split(":");
    const gameId = parseInt(gameIdPart.replace("Game ", ""));
    const sections = parts.split(";");
    let cubesMax: Cubes = {
      blue: 0,
      green: 0,
      red: 0,
    };
    for (const innerSec of sections) {
      const bits = innerSec.split(",");
      for (const bit of bits) {
        if (bit.includes("green")) {
          const number = parseInt(bit.replace(" green", ""));
          if (number > cubesMax.green) {
            cubesMax.green = number;
          }
        } else if (bit.includes("red")) {
          const number = parseInt(bit.replace(" red", ""));
          if (number > cubesMax.red) {
            cubesMax.red = number;
          }
        } else {
          const number = parseInt(bit.replace(" blue", ""));
          if (number > cubesMax.blue) {
            cubesMax.blue = number;
          }
        }
      }
    }
    if (
      cubesMax.blue <= criteria.blue &&
      cubesMax.green <= criteria.green &&
      cubesMax.red <= criteria.red
    ) {
      total += gameId;
      console.log(gameId, "success", cubesMax);
    }
  }
  return total;
}

export function part2(data: string[] = inputDataLines): number {
  let total = 0;
  for (const line of data) {
    const [gameIdPart, parts] = line.split(":");
    const gameId = parseInt(gameIdPart.replace("Game ", ""));
    const sections = parts.split(";");
    let cubesMax: Cubes = {
      blue: 0,
      green: 0,
      red: 0,
    };
    for (const innerSec of sections) {
      const bits = innerSec.split(",");
      for (const bit of bits) {
        if (bit.includes("green")) {
          const number = parseInt(bit.replace(" green", ""));
          if (number > cubesMax.green) {
            cubesMax.green = number;
          }
        } else if (bit.includes("red")) {
          const number = parseInt(bit.replace(" red", ""));
          if (number > cubesMax.red) {
            cubesMax.red = number;
          }
        } else {
          const number = parseInt(bit.replace(" blue", ""));
          if (number > cubesMax.blue) {
            cubesMax.blue = number;
          }
        }
      }
    }
    total += cubesMax.blue * cubesMax.red * cubesMax.green;
    // if (
    //   cubesMax.blue <= criteria.blue &&
    //   cubesMax.green <= criteria.green &&
    //   cubesMax.red <= criteria.red
    // ) {
    //   total += gameId;
    //   console.log(gameId, "success", cubesMax);
    // }
  }
  return total;
}
console.log("part1", part1());
console.log("part2", part2());

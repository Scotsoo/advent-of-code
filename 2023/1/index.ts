import { readFileSync } from "fs";

const testData = readFileSync("./data.txt", "utf-8").toLowerCase();

const keys = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

export function main(data: string = testData): number {
  for (const [key, value] of Object.entries(keys)) {
    // @ts-ignore
    data = data.replaceAll(key, `${key}=${value}=${key}`);
  }
  const splitData = data.split("\n");
  const fullItems: number[] = [];
  for (const d of splitData) {
    const items = d.split("").reduce((prev: number[], cur) => {
      const item = parseInt(cur);
      if (!Number.isNaN(item)) {
        prev.push(item);
      }
      return prev;
    }, []);
    const item = `${items.at(0)}${items.at(-1)}`;
    fullItems.push(parseInt(item));
  }
  return fullItems.reduce((prev, cur) => prev + cur, 0);
}

console.log(main());

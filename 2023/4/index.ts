import { readFileSync } from "fs";

const inputDataLines = readFileSync("./data.txt", "utf-8").split("\n");

function splitLineToGetNumbers(line: string): [string[], string[]] {
  const [winningNumbersSrc, myNumbersSrc] = line.split(": ")[1].split(" | ");
  return [
    winningNumbersSrc.split(" ").filter((m) => m),
    myNumbersSrc.split(" ").filter((m) => m),
  ];
}
export function part1(lines: string[] = inputDataLines): number {
  let totalValue = 0;
  for (const line of lines) {
    const [winningNumbers, myNumbers] = splitLineToGetNumbers(line);
    const numberSet = new Set(winningNumbers);
    for (const myNumber of myNumbers) {
      numberSet.add(myNumber);
    }
    const numbersMissingFromSet =
      winningNumbers.length + myNumbers.length - numberSet.size;

    let value = 0;
    if (numbersMissingFromSet > 0) {
      value = 1;
    }
    for (let index = 1; index < numbersMissingFromSet; index++) {
      value *= 2;
    }
    totalValue += value;
  }
  return totalValue;
}
let wonScratchCards: { [key: number]: number } = {};
export function part2(lines: string[] = inputDataLines, idx: number = 0): any {
  for (const line of lines) {
    if (!wonScratchCards[idx]) {
      wonScratchCards[idx] = 1;
    }
    const [winningNumbers, myNumbers] = splitLineToGetNumbers(line);
    const numberSet = new Set(winningNumbers);
    for (const myNumber of myNumbers) {
      numberSet.add(myNumber);
    }
    const missingNumbersFromSet =
      winningNumbers.length + myNumbers.length - numberSet.size;

    let items: number[] = [];
    let amountToAdd = wonScratchCards[idx] || 1;
    for (let index = 1; index < missingNumbersFromSet + 1; index++) {
      const idxToCheck = index + idx;
      items.push(idxToCheck);
      if (!wonScratchCards[idxToCheck]) {
        wonScratchCards[idxToCheck] = 1;
      }
      wonScratchCards[idxToCheck] += amountToAdd;
    }
    console.log(
      `Your original card has ${missingNumbersFromSet} matching numbers, so you win ${amountToAdd} copy of cards ${items.join(
        ", "
      )}`
    );
    idx++;
  }

  return Object.values(wonScratchCards).reduce((a, b) => a + b);
}

console.log(part1());
console.log(part2());

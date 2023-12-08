import { readFileSync } from "fs";

const inputDataLines = readFileSync("./data.txt", "utf-8").split("\n");
enum CardTypes {
  FIVE_OF_A_KIND = 7,
  FOUR_OF_A_KIND = 6,
  FULL_HOUSE = 5,
  THREE_OF_A_KIND = 4,
  TWO_PAIR = 3,
  ONE_PAIR = 2,
  HIGH_CARD = 1,
}
interface HandStrength {
  type: CardTypes;
  hand: string;
  bid: number;
}
class HandStrengthPart1 implements HandStrength {
  public type: CardTypes;
  constructor(public hand: string, public bid: number) {
    this.type = this.getType();
  }
  private getType(): CardTypes {
    const splitCards = this.hand.split("");
    const cardCounts: { [key: string]: number } = {};
    for (const card of splitCards) {
      cardCounts[card] = (cardCounts[card] ?? 0) + 1;
    }
    const numberOfJokers = cardCounts["J"];
    const len = Object.keys(cardCounts).length;
    if (len === 1) {
      return CardTypes.FIVE_OF_A_KIND;
    }
    const values = Object.values(cardCounts);
    if (len === 2) {
      if (values.includes(4)) {
        return CardTypes.FOUR_OF_A_KIND;
      }
    }
    if (values.every((f) => f === 2 || f === 3)) {
      return CardTypes.FULL_HOUSE;
    }
    if (values.find((f) => f === 3)) {
      return CardTypes.THREE_OF_A_KIND;
    }
    if (values.filter((f) => f === 2).length === 2) {
      return CardTypes.TWO_PAIR;
    }
    if (values.find((f) => f === 2)) {
      return CardTypes.ONE_PAIR;
    }
    return CardTypes.HIGH_CARD;
  }
}

function getHandStrength(
  data: string[],
  generator: (cards: string, bid: number) => HandStrength
): HandStrength[] {
  let hands: HandStrength[] = [];
  for (const line of data) {
    const [cards, bid] = line.split(" ");
    hands.push(generator(cards, parseInt(bid)));
  }
  return hands;
}

function part1(
  data: string[] = inputDataLines,
  order: string[] = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "T",
    "J",
    "Q",
    "K",
    "A",
  ],
  hands = getHandStrength(data, (c, b) => new HandStrengthPart1(c, b))
): number {
  hands = hands.sort((a, b) => {
    if (a.type === b.type) {
      const [acards, bcards] = [a.hand.split(""), b.hand.split("")];
      for (let index = 0; index < acards.length; index++) {
        const aCard = order.indexOf(acards[index]);
        const bCard = order.indexOf(bcards[index]);
        if (aCard > bCard) {
          return 1;
        }
        if (aCard < bCard) {
          return -1;
        }
      }
    }
    if (a.type > b.type) {
      return 1;
    }
    if (a.type < b.type) {
      return -1;
    }
    return 0;
  });
  let sum = 0;
  for (let index = 0; index < hands.length; index++) {
    const hand = hands[index];
    console.log(`${index + 1}  - ${hand.type} - ${hand.hand}`);
    sum += (index + 1) * hand.bid;
  }
  return sum;
}

class HandStrengthPart2 implements HandStrength {
  public type: CardTypes;
  constructor(public hand: string, public bid: number) {
    this.type = this.getType();
  }
  private getType(): CardTypes {
    // @ts-ignore
    const splitCards = this.hand.replaceAll("J", "").split("");
    const jokers = 5 - splitCards.length;
    console.log("splitcards", splitCards);
    const cardCounts: { [key: string]: number } = {};
    for (const card of splitCards) {
      cardCounts[card] = (cardCounts[card] ?? 0) + 1;
    }
    const len = Object.keys(cardCounts).length;
    if (len === 1) {
      return CardTypes.FIVE_OF_A_KIND;
    }
    const values = Object.values(cardCounts);
    if (len === 2) {
      if (values.includes(lower(4, jokers))) {
        return CardTypes.FOUR_OF_A_KIND;
      }
    }
    if (
      values.every((f) => f === (lower(2, jokers) || f === lower(3, jokers)))
    ) {
      return CardTypes.FULL_HOUSE;
    }
    if (values.find((f) => f === lower(3, jokers))) {
      return CardTypes.THREE_OF_A_KIND;
    }
    if (values.filter((f) => f === 2).length === lower(2, jokers)) {
      return CardTypes.TWO_PAIR;
    }
    if (values.find((f) => f === lower(2, jokers))) {
      return CardTypes.ONE_PAIR;
    }
    return CardTypes.HIGH_CARD;
  }
}
function lower(number: number, numberOfJ: number): number {
  if (number - numberOfJ < 0) {
    return 0;
  }
  return number - numberOfJ;
}

function part2(
  data: string[] = inputDataLines,
  order: string[] = [
    "J",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "T",
    "Q",
    "K",
    "A",
  ]
): number {
  return part1(
    data,
    order,
    getHandStrength(data, (c, b) =>
      c.includes("J")
        ? new HandStrengthPart2(c, b)
        : new HandStrengthPart1(c, b)
    )
  );
}
console.log("part1", part1());
console.log("part2", part2());

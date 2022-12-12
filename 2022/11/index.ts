import { readFileSync } from 'fs';
const data = readFileSync('./data.txt', 'utf-8').split('\n');
const operationRegex = new RegExp(/.*Operation: new = old (?<operation>.*) (?<value>.*)/)
const operations: {
  [key: string]: (old: number, value: number) => number
} = {
  '*': (old: number, value: number) => {
    return old * value
  },
  '/': (old: number, value: number) => {
    return old / value
  },
  '+': (old: number, value: number) => {
    // console.log('inside add')
    return old + value
  },
  '-': (old: number, value: number) => {
    return old - value
  }
}
class Monkey {
  public id: number;
  private items: number[];
  private trueMonkeyId: number;
  private falseMonkeyId: number;
  public divisibleTest: number;
  public inspectCount = 0;
  private operation: (item: number) => number;

  constructor(id: number, data: string[]) {
    this.id = id
    this.items = data[0].replace('Starting items: ', '').split(', ').map(num => { 
      return Number(num)
    })
    const operation = operationRegex.exec(data[1]);
    const operationValue = operation.groups.value;
    // console.log('operationValue', operationValue)
    const operationFunction = operations[operation.groups.operation];
    // console.log('MONKEY', id, operation.groups)
    this.operation = (item) => {
      if (operationValue === 'old') {
        return item * item;
      }
      const updated = operationFunction(item, Number(operationValue));
      if (isNaN(updated)) {
        throw new Error('IS NAN HERE')
      }
      return updated;
    }
    this.divisibleTest = Number(data[2].replace('Test: divisible by ', ''));
    this.trueMonkeyId = Number(data[3].replace('If true: throw to monkey ', ''))
    this.falseMonkeyId = Number(data[4].replace('If false: throw to monkey ', ''))
  }
  
  public run (monkeys: {
    [key: number]: Monkey
  }, divisible: number, divider: number) {
    if (this.items.length === 0) {
      return;
    }
    do {``
      this.inspect(monkeys, divisible, divider)
    } while(this.items.length > 0 )
  }

  public inspect(monkeys: {
    [key: number]: Monkey
  }, divisible: number, divider: number) {
    const currentItem = this.items.shift();
    // console.log(`Monkey ${this.id} inspects an item with a worry level of ${currentItem}.`)
    let newValue = this.operation(currentItem);
    // console.log(`  Worry level increases from ${currentItem} to ${newValue}`)
    newValue = Math.floor(newValue / divisible);
    newValue = newValue % divider;
    // console.log(`  Monkey gets bored with item. Worry level is divided by ${divisible} to ${newValue}.`)
    const divideTest = newValue % this.divisibleTest === 0;
    const throwMonkeyId = divideTest ? this.trueMonkeyId : this.falseMonkeyId;
    // console.log(`  Current worry level is ${divideTest ? '' : 'not '}divisible by ${this.divisibleTest}`);
    this.throwItem(newValue, monkeys[throwMonkeyId])
  }
  
  public throwItem (item: number, toMonkey: Monkey): void {
    // console.log(`Item with worry level ${item} is thrown to monkey ${toMonkey.id}`)
    this.inspectCount++;
    toMonkey.receiveItem(item)
  }

  public receiveItem (item: number) : void {
    this.items.push(item);
  }
}
function part1() {
  
  const monkeys: {[key: number]: Monkey} = {}
  let lineBuffer: string[] = [];
  let currentMonkeyId = 0;
  // parse into monkeys
  for (const line of data) {
    if (line === '') {
      monkeys[currentMonkeyId] = new Monkey(currentMonkeyId, lineBuffer);
      lineBuffer = []
    } else if (line.startsWith('Monkey')) {
      currentMonkeyId = Number(line.trim().replace('Monkey ', '').replace(':', ''));
    } else {
      lineBuffer.push(line.trim());
    }
  }
  monkeys[currentMonkeyId] = new Monkey(currentMonkeyId, lineBuffer);
  const divider = Object.values(monkeys).map((m) => m.divisibleTest).reduce((a, b) => a * b, 1);

  // console.log(monkeys)
  for (let index = 0; index < 20; index++) {
    // console.log('round', index)
    for (const monkey of Object.values(monkeys)) {
      monkey.run(monkeys, 3, divider);
    }
  }
  const items = Object.values(monkeys).map(m => m.inspectCount).sort((a, b) => b - a);
  console.log('part1', items[0] * items[1]);
}

function part2() {
  const monkeys: {[key: number]: Monkey} = {}
  let lineBuffer: string[] = [];
  let currentMonkeyId = 0;
  // parse into monkeys
  for (const line of data) {
    if (line === '') {
      monkeys[currentMonkeyId] = new Monkey(currentMonkeyId, lineBuffer);
      lineBuffer = []
    } else if (line.startsWith('Monkey')) {
      currentMonkeyId = Number(line.trim().replace('Monkey ', '').replace(':', ''));
    } else {
      lineBuffer.push(line.trim());
    }
  }
  monkeys[currentMonkeyId] = new Monkey(currentMonkeyId, lineBuffer);
  // console.log(monkeys)
  const divider = Object.values(monkeys).map((m) => m.divisibleTest).reduce((a, b) => a * b, 1);
  for (let index = 0; index < 10000; index++) {
    for (const monkey of Object.values(monkeys)) {
      monkey.run(monkeys, 1, divider);
    }
  }
  const items = Object.values(monkeys).map(m => m.inspectCount).sort((a, b) => b - a);
  console.log('part2', items[0] * items[1]);
}

part1();
part2();
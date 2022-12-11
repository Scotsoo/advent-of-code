import { readFileSync } from 'fs';
const data = readFileSync('./data.txt', 'utf-8').split('\n');

function part1() {
  let x = 1;
  let val = 0;
  let buffer: number = 0;
  let cycleCount = 1;
  let index = 0;
  let skipCycle = -1;
  do {
    const underindex = cycleCount - 20;
    if (underindex === 0 || underindex % 40 === 0) {
      val += x * cycleCount;
    }
    let value = data[index];
    if (skipCycle === cycleCount) {
      x += buffer;
    } else {
      if (value !== 'noop') {
        buffer = (Number(value.split(' ')[1]))
        skipCycle = cycleCount +1;
      } else {
        buffer = 0
      }
      index++;
    }
    cycleCount++;

  } while(index !== data.length - 1)
  console.log('part1', val)
}

function part2() {
  let x = 0;
  let buffer: number = 0;
  let cycleCount = 0;
  let index = 0;
  let skipCycle = -1;
  let crt: ('#' | '.')[] = [...new Array(40)]
  console.log('part2')
  do {
    crt[cycleCount%40] = [x -1, x, x +1].includes(cycleCount % 40) ? '#' : '.'

    if (cycleCount % 40 === 0 && cycleCount !== 0) {
      console.log(crt.join(''))
      crt = [];
    }
    let value = data[index];
    if (skipCycle === cycleCount) {
      x += buffer;
    } else {
      if (value !== 'noop') {
        buffer = (Number(value.split(' ')[1]))
        skipCycle = cycleCount +1;
      } else {
        buffer = 0
      }
      index++;
    }
    if (cycleCount === 0) {
      x = 1
    }
    cycleCount++;

  } while(index !== data.length - 1)
  console.log(crt.join(''))

}

part1();
part2();
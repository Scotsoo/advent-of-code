const { readFileSync } = require('fs')
const data = readFileSync('./data.txt', 'utf-8');

function part1() {
  let cache = []
  let i = 0;
  for (const letter of data.split('')) {
    i++;
    const index = cache.indexOf(letter);
    if (index !== -1) {
      cache.splice(0, index + 1);
    } else if (cache.length === 3) {
      console.log('part1', i);
      break;
    }
    cache.push(letter);
    if (cache.length === 4) {
      cache.shift();
    }
  }
}

function part2() {
  let cache = []
  let i = 0;
  for (const letter of data.split('')) {
    i++;
    const index = cache.indexOf(letter);
    if (index !== -1) {
      cache.splice(0, index + 1);
    } else if (cache.length === 13) {
      console.log('Part2', i);
      break;
    }
    cache.push(letter);
    if (cache.length === 14) {
      cache.shift();
    }
  }
}
part1();
part2();
const fs = require('fs')
const data = fs.readFileSync('./data.txt', 'utf-8');
const getValue = (char) => {
  const code = char.charCodeAt(0);
  if (code > 96) {
    return code - 96;
  }
  return code - 38
}
let sum = 0;
// Part 1
// for (const line of data.split('\n')) {

  // const first = line.substring(0, Math.floor(line.length/2));
  // const last = line.substring(Math.floor(line.length/2), line.length);
  // const itemsInBoth = {}
  // for (const letter of first.split('')) {
  //   if (last.includes(letter) ) {
  //     if (!itemsInBoth[letter]) {
  //       itemsInBoth[letter] = true;
  //       sum += getValue(letter);
  //     }
  //   }
  // }
// }

let cacheItems = []
for (const line of data.split('\n')) {
  if (cacheItems.length !== 2) {
    cacheItems.push(line);
    continue;
  }
  const itemsInAll = {}
  for (const letter of line.split('')) {
    if (cacheItems[0].includes(letter) && cacheItems[1].includes(letter)) {
      if (!itemsInAll[letter]) {
        itemsInAll[letter] = true;
        sum += getValue(letter);
      }
    }
  }
  cacheItems = [];
}
console.log(sum);
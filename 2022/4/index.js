const fs = require('fs')
const lines = fs.readFileSync('./data.txt', 'utf-8').split('\n');
function part1() {
  let fullOverlaps = 0;
  let i = 0;
  for (const elves of lines) {
    const [first, second] = elves.split(',')
    const f = first.split('-').map(m => parseInt(m))
    const s = second.split('-').map(m => parseInt(m))
    let smallest = f;
    let largest = s;
    if (smallest[0] === largest[0] && largest[1] > smallest[1]) {
      smallest = s;
      largest = f;
    } else if (f[0] > s[0] ) {
      smallest = s;
      largest = f;
    } 

    if(smallest[1] >= largest[1] && smallest[0] <= largest[0]) {
      fullOverlaps++;
    } else {
      console.log({
        i: i++,
        smallest, largest
      })
    }
  }
  console.log('Part1', fullOverlaps);
}

function part2() {
  let partialOverlaps = 0
  for (const elves of lines) {
    const [first, second] = elves.split(',')
    const f = first.split('-').map(m => parseInt(m))
    const s = second.split('-').map(m => parseInt(m))
    let smallest = f;
    let largest = s;
    if (smallest[0] === largest[0] && largest[1] > smallest[1]) {
      smallest = s;
      largest = f;
    } else if (f[0] > s[0] ) {
      smallest = s;
      largest = f;
    } 
    console.log({smallest, largest})
    if (smallest[0] >= largest[0] || largest[1] <= smallest[1] || smallest[1] >= largest[0]) {
      partialOverlaps++;
    }
  }

  console.log('Part2', partialOverlaps)
}

part1();
part2();
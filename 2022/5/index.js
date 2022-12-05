const { readFileSync } = require('fs');
const data = readFileSync('./data.txt', 'utf-8');
function getCrates (data) {
  const lines = data.split('\n');
  const numberOfItems = (lines[0].length + 1) / 4
  const crates = [];
  for (let index = 0; index < numberOfItems; index++) {
    crates.push([])    
  } 
  let cont = true;
  do {
    if (lines[0].includes('move')){
      cont = false;
    } else {
      const currentLine = lines.shift();
      for (let index = 0; index < numberOfItems; index++) {
        const item = currentLine.substring(index * 4, 4* (index +1));
        if (item.startsWith('[')) {
          crates[index].push(item.substring(1,2));
        }
      }
    }
  } while(cont)
  return {
    lines,
    crates
  };
}
function part1() {
  const {
    crates, lines
  } = getCrates(data)
  const regex = new RegExp(/move (\d*) from (\d*) to (\d*)/)
  for (const line of lines) {
    let [
      , count, from, to
    ] = line.match(regex)
    do {
      const taken = crates[from-1].shift();
      crates[to-1].unshift(taken);
    } while(--count !== 0)
  } 

  const result = crates.reduce((prev, current) => {
    prev += current[0]
    return prev;
  }, '')
  console.log('part1', result)
}

function part2() {
  const {
    crates, lines
  } = getCrates(data)
  const regex = new RegExp(/move (\d*) from (\d*) to (\d*)/)
  for (const line of lines) {
    let [
      , count, from, to
    ] = line.match(regex)
    let stack = []
    do {
      const taken = crates[from -1].shift();
      stack.push(taken);
    } while(--count !== 0)
    crates[to-1].unshift(...stack)
  } 

  const result = crates.reduce((prev, current) => {
    prev += current[0]
    return prev;
  }, '')
  console.log('part2', result)
}

part1();
part2();
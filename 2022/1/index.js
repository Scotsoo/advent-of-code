const fs = require('fs')
const data = fs.readFileSync('./data.txt', 'utf-8')
let current = 0;
let carried = []
for (const line of data.split('\n')) {
  const parsed = parseInt(line)
  if (!isNaN(parsed)) {
    current += parsed
  } else {
    carried.push(current);
    current = 0;
  }
}
carried = carried.sort((a, b) => a - b);
console.log(carried.pop() + carried.pop() + carried.pop());
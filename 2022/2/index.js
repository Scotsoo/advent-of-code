const fs = require('fs')
const data = fs.readFileSync('./data.txt', 'utf-8');  
let score = 0;
const map = {
  A: { // rock
    X: 'C', // lose
    Y: 'A', // draw
    Z: 'B', // wins
    points: 1
  },
  B: { // paper
    X: 'A', // lose
    Y: 'B', // draw
    Z: 'C', // wins
    points: 2

  },
  C: { // scissors
    X: 'B', // lose
    Y: 'C', // draw
    Z: 'A', // wins
    points: 3
  }
}

for (const line of data.split('\n')) {
  const [opponent, me] = line.split(' ');
  const oppoMap = map[opponent];
  const myMapped = map[oppoMap[me]];

  score += myMapped.points;
  
  if (me === 'Z') {
    score += 6;
  } 
  if (me === 'Y') {
    score += 3
  }
}

console.log(score);

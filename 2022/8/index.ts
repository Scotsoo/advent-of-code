import { readFileSync } from 'fs';

const rowsData = readFileSync('./data.txt', 'utf8').split('\n')

function part1() {
  const rows = rowsData.map(line => line.split('').map(Number));
  const cols = rows.map(x => []);
  for (const i in rows) {
    for (const j in rows[i]) {
      cols[j].push(rows[i][j]);
    }
  }

  const width = rows[0].length;
  const height = rows.length;
  let visibleCount = 2 * width + 2*(height-2);
  for (let y = 1; y < height-1; y++) {
    for (let x =1;  x < width-1; x++) {
      const val = rows[y][x];
      const visibleTrees = [
        rows[y].slice(0, x).reverse().findIndex(t => t >= val), // l
        rows[y].findIndex((t, idx) => idx > x && t >= val),  // r
        cols[x].slice(0,y).reverse().findIndex(t => t >= val), // u
        cols[x].findIndex((t, idx) => idx > y && t >= val)]; // d
      if (visibleTrees.findIndex(i => i == -1) >= 0) {
        visibleCount ++
      }
    }
  }
  console.log('part1', visibleCount)
}
function part2() {
  const rows = rowsData.map(line => line.split('').map(Number));
  const cols: number[][] = []
  for (const r in rows) {
    for (const c in rows[r]) {
      if (cols[c] === undefined) {
        cols[c] = []
      }
      cols[c].push(rows[r][c]);
    }
  }
  const width = rows[0].length;
  const height = rows.length;
  let visibleCount = 2 * width + 2*(height-2);
  let bestScenicScore = 0;
  for (let y = 1; y < height-1; y++) {
    for (let x = 1; x < width-1; x++) {
      const val = rows[y][x];
      const visibleTrees = [
        rows[y].slice(0, x).reverse().findIndex(v => v >= val), // l
        rows[y].findIndex((v, idx) => idx > x && v >= val),  // r
        cols[x].slice(0, y).reverse().findIndex(v => v >= val), // u
        cols[x].findIndex((v, idx) => idx > y && v >= val)]; // d
      if (visibleTrees.findIndex(i => i == -1) >= 0) {
        visibleCount++;
      }
      const scenicScore = visibleTrees.map((value: number, index: number) => {
        switch(index) {
          case 0: // l
            return (value == -1) ? x : value + 1;
          case 1: // r
            return (value == -1) ? width - x - 1 : value - x;
          case 2: // u
            return (value == -1) ? y : value + 1;
          case 3: // d
            return (value == -1) ? height - y - 1 : value - y;
        }
      }).reduce((p, c) => p * c, 1);
      if (scenicScore > bestScenicScore) {
        bestScenicScore = scenicScore;
      }
    }
  }
  console.log('part2', bestScenicScore)
}

part1();
part2();
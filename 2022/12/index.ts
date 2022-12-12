import { readFileSync } from 'fs';
const data = readFileSync('./data.txt', 'utf-8').split('\n');
const flags = {
  current: 'S',
  bestSignal: 'E'
}
interface Coordinate {
  x: number
  y: number
}
function makeGrid(): {
  grid: string[][]
  currentPosition: Coordinate
  bestSignal: Coordinate
} {
  const grid: string[][] = []
  const currentPosition: Coordinate = {
    x: 0,
    y: 0
  }
  const bestSignal: Coordinate = {
    x: 0,
    y: 0
  }
  for (const [yIdx, line] of Object.entries(data)) {
    const current: string[] = line.split('').map((m, xIdx) => {
      let valueToPut = m;
      if (m === flags.current) {
        currentPosition.x = xIdx
        currentPosition.y = Number(yIdx)
        valueToPut = 'a'
      } else if (
        m === flags.bestSignal
      ) {
        bestSignal.x = xIdx
        bestSignal.y = Number(yIdx)
        valueToPut = 'z'
      }
      return valueToPut
    })
    grid.push(current);
  }
  return {
    grid,
    currentPosition,
    bestSignal
  }
}

class DijkstraGraph {
  graph: Map<string, string[]> = new Map<string, string[]>()

  public addNode(name: string, neighbors: string[]) {
    this.graph.set(name, neighbors)
  }
  
  public path(start: string, goal: string) {
    const prev: Set<string> = new Set();
    const front: {
      key: string
      cost: number
    }[] = [];
    const visited: Set<string> = new Set();
    front.push({
      cost: 0,
      key: start
    })
    do {
      const node = front.shift();
      if (node.key === goal) {
        return node.cost
      }
      visited.add(node.key);
      const neighbors = this.graph.get(node.key) || [];
      for (const neighbor of neighbors) {
        let fIdx = front.findIndex(f => f.key === neighbor)
        if (visited.has(neighbor)) {
        } else if (fIdx === -1) {
          prev.add(neighbor);
          front.push({
            cost: node.cost + 1,
            key: neighbor
          });
        } else if (front[fIdx].cost > node.cost + 1) {
          prev.add(neighbor);
          front[fIdx].cost = node.cost + 1
        }
      }
    } while(front.length !== 0)
    return 0
  }
}

function coordToString (c: Coordinate): string {
  return `${c.x},${c.y}`
}
function isViableChar(grid: string[][], currentChar: Coordinate, nextChar: Coordinate, history: Set<string>): boolean {
  if (history.has(coordToString(nextChar))) {
    return false;
  }
  const current = grid[currentChar.y][currentChar.x]
  const next = grid[nextChar.y][nextChar.x]
  let currentCharCode = current.charCodeAt(0);
  
  return next.charCodeAt(0) < currentCharCode || [currentCharCode, currentCharCode + 1].includes(next.charCodeAt(0))
}

function findViableNeighbors (grid: string[][], currentPosition: Coordinate, history: Set<string>): Coordinate[] {
  let possibleCoords: Coordinate[] = []
  if (currentPosition.x < grid[0].length - 1) {
    const coords: Coordinate = { x: currentPosition.x + 1, y: currentPosition.y }
    if (isViableChar(grid, currentPosition, coords, history)) {
      possibleCoords.push(coords);
    }
  } 
  if (currentPosition.x !== 0) {
    const coords: Coordinate = { x: currentPosition.x - 1, y: currentPosition.y }
    if (isViableChar(grid, currentPosition, coords, history)) {
      possibleCoords.push(coords);
    }
  }

  if (currentPosition.y < grid.length - 1) {
    const coords: Coordinate = { x: currentPosition.x, y: currentPosition.y + 1, }
    if (isViableChar(grid, currentPosition, coords, history)) {
      possibleCoords.push(coords);
    }
  } 
  if (currentPosition.y !== 0) {
    const coords: Coordinate = { x: currentPosition.x, y: currentPosition.y + -1 }
    if (isViableChar(grid, currentPosition, coords, history)) {
      possibleCoords.push(coords);
    }
  }

  return possibleCoords
}

function printPaths(grid: string[][], history: Set<string>) {
  let printGrid: string[][] = []
  for (const [yidx, values] of Object.entries(grid)) {
    printGrid.push([])
    for (const v of values) {
      printGrid[Number(yidx)].push(v)
    }
  }
  for (const item of history.values()) {  
    const [x, y] = item.split(',').map(Number);
    printGrid[y][x] = 'x'
  }
  console.log('====')
  for (const line of printGrid) {
    console.log(line.join(''))
  }
  console.log('====')
}

const { grid, currentPosition, bestSignal } = makeGrid()
function part1() {
  const graph = new DijkstraGraph();
  for (const [yIdx, line] of Object.entries(grid)) {
    for (const [xIdx] of Object.entries(line)) {
      graph.addNode(coordToString({
        x: Number(xIdx),
        y: Number(yIdx)
      }), findViableNeighbors(grid, {
        x: Number(xIdx),
        y: Number(yIdx)
      }, new Set()).map(coordToString))
    }
  }
  const out = graph.path(coordToString(currentPosition), coordToString(bestSignal))
  console.log('part 1', out)
}

function part2() {
  const graph = new DijkstraGraph();
  let allAs: Coordinate[] = []
  for (const [yIdx, line] of Object.entries(grid)) {
    for (const [xIdx, xVal] of Object.entries(line)) {
      if (xVal === 'a') {
        allAs.push({
          x: Number(xIdx),
          y: Number(yIdx)
        })
      }
      graph.addNode(coordToString({
        x: Number(xIdx),
        y: Number(yIdx)
      }), findViableNeighbors(grid, {
        x: Number(xIdx),
        y: Number(yIdx)
      }, new Set()).map(coordToString))
    }
  }
  
  console.log('part 2', allAs.map(m => {
    return graph.path(coordToString(m), coordToString(bestSignal))
  }).filter(f => f).sort((a, b) => a - b)[0])
}


part1()
part2()
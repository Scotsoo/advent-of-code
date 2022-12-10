import { readFileSync, writeFileSync } from "fs";
interface Coordinate {
  x: number;
  y: number;
}
let history: { h: Coordinate; t: Coordinate }[] = [];

//scuffed print function
const print = (visits: Set<string>) => {
  const negCorrection: Coordinate = {
    x: 0,
    y: 0,
  };
  const grid: Coordinate = {
    x: 0,
    y: 0,
  };
  for (const { h, t } of history) {
    if (h.x < negCorrection.x) {
      negCorrection.x = h.x;
    } else if (t.x < negCorrection.x) {
      negCorrection.x = t.x;
    }
    if (h.y < negCorrection.y) {
      negCorrection.y = h.y;
    } else if (t.y < negCorrection.y) {
      negCorrection.y = t.y;
    }
    if (h.x > grid.x) {
      grid.x = h.x;
    } else if (t.x > grid.x) {
      grid.x = t.x;
    }

    if (h.y > grid.y) {
      grid.y = h.y;
    } else if (t.y > grid.y) {
      grid.y = t.y;
    }
  }

  let g: string[][] = [];
  negCorrection.y = negCorrection.y * -1;
  negCorrection.x = negCorrection.x * -1;
  let v = [...visits].map((m) => {
    let [x, y] = m.split(",").map(Number);
    return {
      x: Math.abs(x + negCorrection.x),
      y: Math.abs(y + negCorrection.y - grid.y),
    };
  });
  for (const visit of v) {
    if (visit.x < negCorrection.x) {
      negCorrection.x = visit.x;
    }
    if (visit.y < negCorrection.y) {
      negCorrection.y = visit.y;
    }
    if (visit.x > grid.x) {
      grid.x = visit.x;
    }

    if (visit.y > grid.y) {
      grid.y = visit.y;
    }
  }
  for (let y = 0; y < grid.y + 1 + negCorrection.y; y++) {
    g[y] = [...new Array(grid.x + negCorrection.x + 1)].fill(".");
  }
  for (const visit of v) {
    g[Math.abs(visit.y - grid.y + negCorrection.y)][visit.x + negCorrection.x] =
      "#";
  }
  for (const i of g) {
    console.log(i.join(" "));
  }
  for (const { h, t } of history.slice(history.length - 10, history.length)) {
    const gr = JSON.parse(JSON.stringify(g));
    gr[Math.abs(t.y - grid.y + negCorrection.y)][t.x + negCorrection.x] = "T";
    gr[Math.abs(h.y - grid.y + negCorrection.y)][h.x + negCorrection.x] = "H";
    console.log("\n=====");
    for (const i of gr) {
      console.log(i.join(" "));
    }
    console.log("=====\n");
  }
};

const rows = readFileSync("./data.txt", "utf8").split("\n");
function part1() {
  const parseInstruction = (instruction: string) => {
    const parts = instruction.split(" ");
    return {
      direction: parts[0],
      steps: parseInt(parts[1]),
    };
  };
  let head: Coordinate = {
    x: 0,
    y: 0,
  };
  let tail: Coordinate = {
    x: 0,
    y: 0,
  };
  let tailVisits: Set<string> = new Set();
  const areTailAndHeadTouching = (t: Coordinate, h: Coordinate): boolean => {
    if ([1, 0, -1].includes(t.x - h.x) && [1, 0, -1].includes(t.y - h.y)) {
      // within 1 block of eachother, we need to move
      return true;
    }
    if (t.x === h.x && t.y === h.y) {
      // on same block
      return true;
    }
    if (t.x === h.x && [1, 0, -1].includes(t.y - h.y)) {
      // touching on same x axis -- diagonal or directly
      return true;
    }
    if (t.y === h.y && [1, 0, -1].includes(t.x - h.x)) {
      // touching on same y axis -- diagonal or directly
      return true;
    }
    return false;
  };
  history.push({
    h: Object.assign({}, head),
    t: Object.assign({}, tail),
  });
  tailVisits.add(`${tail.x},${tail.y}`);
  for (const row of rows) {
    const { direction, steps } = parseInstruction(row);
    const modifier = ["D", "L"].includes(direction) ? -1 : 1;
    for (let index = 0; index < steps; index++) {
      // move head
      if (["D", "U"].includes(direction)) {
        head.y += 1 * modifier;
      } else {
        head.x += 1 * modifier;
      }
      // move tail
      // only move if we're not touching
      const touchState = areTailAndHeadTouching(tail, head);
      if (!touchState) {
        const deltas: Coordinate = {
          x: head.x - tail.x,
          y: head.y - tail.y,
        };
        if (deltas.x !== deltas.y && [deltas.x, deltas.y].includes(0)) {
          // move in one direction
          tail.x += deltas.x / 2;
          tail.y += deltas.y / 2;
        } else {
          // diagonal move?
          if (Math.abs(deltas.x) === 1 && Math.abs(deltas.y) === 2) {
            tail.y += deltas.y / 2;
            tail.x += deltas.x;
          } else if (Math.abs(deltas.y) === 1 && Math.abs(deltas.x) === 2) {
            tail.x += deltas.x / 2;
            tail.y += deltas.y;
          }
        }
      }
      tailVisits.add(`${tail.x},${tail.y}`);
      history.push({
        h: Object.assign({}, head),
        t: Object.assign({}, tail),
      });
    }
    const touchState = areTailAndHeadTouching(tail, head);
    if (!touchState) {
      writeFileSync("./out.json", JSON.stringify(history, null, 2));
      console.log("we have moved and we are not touching");
      throw new Error();
    }
  }
  console.log('part1', [...tailVisits].length);
}
function part2() {
  const state: Coordinate[][] = [];
  let tailParts: Coordinate[] = [...Array.from({ length: 9 })].map((m) => {
    return {
      x: 0,
      y: 0,
    };
  });
  try {
    const parseInstruction = (instruction: string) => {
      const parts = instruction.split(" ");
      return {
        direction: parts[0],
        steps: parseInt(parts[1]),
      };
    };
    let head: Coordinate = {
      x: 0,
      y: 0,
    };
    let tailVisits: Set<string> = new Set();
    const areTwoKnotsTouching = (t: Coordinate, h: Coordinate): boolean => {
      if ([1, 0, -1].includes(t.x - h.x) && [1, 0, -1].includes(t.y - h.y)) {
        // within 1 block of eachother, we need to move
        return true;
      }
      if (t.x === h.x && t.y === h.y) {
        // on same block
        return true;
      }
      if (t.x === h.x && [1, 0, -1].includes(t.y - h.y)) {
        // touching on same x axis -- diagonal or directly
        return true;
      }
      if (t.y === h.y && [1, 0, -1].includes(t.x - h.x)) {
        // touching on same y axis -- diagonal or directly
        return true;
      }
      return false;
    };
    tailVisits.add(`0,0`);
    const moveKnot = (tail: Coordinate, next: Coordinate) => {
      const deltas: Coordinate = {
        x: next.x - tail.x,
        y: next.y - tail.y,
      };
      if (deltas.x !== deltas.y && [deltas.x, deltas.y].includes(0)) {
        // move in one direction
        tail.x += deltas.x / 2;
        tail.y += deltas.y / 2;
      } else {
        // diagonal move?
        if (Math.abs(deltas.x) === 1 && Math.abs(deltas.y) === 2) {
          tail.y += deltas.y / 2;
          tail.x += deltas.x;
        } else if (Math.abs(deltas.y) === 1 && Math.abs(deltas.x) === 2) {
          tail.x += deltas.x / 2;
          tail.y += deltas.y;
        } else if (Math.abs(deltas.y) === 2 && Math.abs(deltas.x) === 2) {
          // move current piece diagonally
          tail.x += deltas.x / 2;
          tail.y += deltas.y / 2;
        } else {
          throw new Error("NOT MOVED");
        }
      }
      return tail;
    };
    for (const row of rows) {
      const { direction, steps } = parseInstruction(row);
      const modifier = ["D", "L"].includes(direction) ? -1 : 1;
      for (let index = 0; index < steps; index++) {
        state.push(JSON.parse(JSON.stringify(tailParts)));
        // move head
        if (["D", "U"].includes(direction)) {
          head.y += 1 * modifier;
        } else {
          head.x += 1 * modifier;
        }
        const [t] = tailParts;
        const touchState = areTwoKnotsTouching(tailParts[0], head);
        let tail = JSON.parse(JSON.stringify(t));
        if (!touchState) {
          for (const [index, tp] of tailParts.entries()) {
            if (index === 0) {
              tailParts[index] = moveKnot(tp, head);
              continue;
            }
            if (!areTwoKnotsTouching(tp, tailParts[index - 1])) {
              const n = moveKnot(tp, tailParts[index - 1]);
              tailParts[index] = n;
            }
          }
        }
        history.push({
          h: Object.assign({}, head),
          t: Object.assign({}, tail),
        });
        tailVisits.add(
          `${tailParts[tailParts.length - 1].x},${
            tailParts[tailParts.length - 1].y
          }`
        );
      }
      const touchState = areTwoKnotsTouching(tailParts[0], head);
      if (!touchState) {
        throw new Error("we have moved and we are not touching");
      }
    }
    console.log("part 2", [...tailVisits].length);
  } catch (e) {
    console.error(e);
    // debug
    writeFileSync("./out.json", JSON.stringify({ tailParts, state }, null, 2));
  }
}

part1();
part2();

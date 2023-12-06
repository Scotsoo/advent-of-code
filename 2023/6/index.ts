import { readFileSync } from "fs";

const inputDataLines = readFileSync("./data.txt", "utf-8").split("\n");
function getTimesAndDistances(data: string[]): {
  times: number[];
  distances: number[];
} {
  const [times, distances] = data.map((m) =>
    m.split(" ").reduce((prev: number[], current: string) => {
      const val = parseInt(current);
      if (!Number.isNaN(val)) {
        prev.push(val);
      }
      return prev;
    }, [])
  );
  return {
    times,
    distances,
  };
}

export function part1(
  data: string[] = inputDataLines,
  {
    times,
    distances,
  }: ReturnType<typeof getTimesAndDistances> = getTimesAndDistances(data)
): number {
  let idx = 0;
  let returnValue: number = 1;
  for (const time of times) {
    const beatTimes: number[] = [];
    const distance = distances[idx++];
    for (let index = 0; index < time; index++) {
      const runTime = time - index;
      if (runTime * index > distance) {
        beatTimes.push(index);
      }
    }
    returnValue *= beatTimes.length || 1;
  }
  return returnValue;
}
export function part2(data: string[] = inputDataLines): number {
  const { times, distances } = getTimesAndDistances(data);
  const timesStr = times.join("");
  const distanceStr = distances.join("");
  return part1(data, {
    times: [parseInt(timesStr)],
    distances: [parseInt(distanceStr)],
  });
}
console.log("part1", part1());
console.log("part2", part2());

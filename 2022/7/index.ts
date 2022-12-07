import { readFileSync } from 'fs';
const lines = readFileSync('./data.txt', 'utf-8').split('\n')
const FILES_CONST = 'FILES_CONST';
const TOTAL_FILE_CONST = 'TOTAL_FILE_CONST';
class Directory {
  children: {[key: string]: Directory}
  files: {[key: string]: number}
  constructor() {
    this.children = {

    };
    this.files = {

    }
  }

  get diskRemaining () {
    return 70000000 - this.fileSize
  }

  get fileSize(): number {
    const myFiles = Object.values(this.files).reduce((p, c) => {
      return p + c
    }, 0)
    return Object.values(this.children).reduce((prev, current) => {
      return prev + current.fileSize;
    }, myFiles)
  }
}
const maptoTree = () => {
  const base = new Directory()
  let currentMap = []
  for (const line of lines) {
    if (line.startsWith('$ cd')) {
      if (line.endsWith('/')) {
        currentMap = [];
      } else if (line.endsWith('..')) {
        currentMap.pop();
      }
      else {
        const dir = line.replace('$ cd ', '');
        currentMap.push(dir);
      }
    } else if (line.startsWith('dir')) {
      let current: Directory = base;
      for (const dir of currentMap) {
        if (current.children[dir] === undefined) {
          current.children[dir] = new Directory();
        }
        current = current.children[dir]
      }
      const dir = line.replace('dir ', '')
      if (current.children[dir] === undefined) {
        current.children[dir] = new Directory();
      }
    } else if (line.startsWith('$ ls')) {
      // ignore
    } else {
      let current = base;
      let [fileSize, fileName] = line.split(' ');
      fileSize = parseInt(fileSize);
      for (const dir of currentMap) {
        if (current.children[dir] === undefined) {
          current.children[dir] = new Directory();
        }
        current = current.children[dir]
      }
      current.files[fileName] = fileSize
    }
  }
  return base
}
function part1() {
  const base = maptoTree();
  let runningTotal = 0;
  const getFileSizes = (dir: Directory) => {
    if (dir.fileSize < 100000) {
      runningTotal += dir.fileSize
    }
    if (dir.children) {
      for (const child of Object.values(dir.children)) {
        getFileSizes(child)
      }
    }
  }
  getFileSizes(base)
  console.log('part 1', runningTotal)
}

function part2() {
  const base = maptoTree();
  const needs = 30000000 - base.diskRemaining;
  console.log({
    needs,
    30000000: '', 
    dr: base.diskRemaining
  })
  let bestNeeds = 99999999
  const getBestMatchedFileToDelete = (dir: Directory) => {
    console.log(dir.fileSize, needs, dir.fileSize < bestNeeds, dir.fileSize > needs)
    if (dir.fileSize > needs && dir.fileSize < bestNeeds) {
      bestNeeds = dir.fileSize;
    }
    if (dir.children) {
      for (const child of Object.values(dir.children)) {
        getBestMatchedFileToDelete(child)
      }
    }
  }
  getBestMatchedFileToDelete(base)
  console.log('part 2', bestNeeds)
}

part1();
part2();

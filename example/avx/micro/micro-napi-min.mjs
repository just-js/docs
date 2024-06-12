import { Bench } from './lib/bench.mjs'
import { openSync, readSync, closeSync } from "node:fs"
import { createRequire } from "node:module"
const { count_avx_min } = createRequire(import.meta.url)("./build/Release/linecount.node")

const file_name = args[1] || '/dev/shm/test.log'
const buf = new Uint8Array(2 * 1024 * 1024)
const fd = openSync(file_name)
const bytes = readSync(fd, buf)
closeSync(fd)
//const runs = parseInt(args[0] || 40000000, 10)
let runs = 10000
const expected = count_avx_min(buf, 10, bytes)
console.log(`bytes ${bytes}`)
console.log(`lines ${expected}`)

let bench = new Bench(false)
let seconds = 0
while (seconds < 1) {
  runs *= 2
  bench.start('warmup')
  for (let i = 0; i < runs; i++) {
    assert(count_avx_min(buf, 10, bytes) === expected)
  }
  seconds = bench.end(runs).seconds
}

bench = new Bench()
for (let j = 0; j < 10; j++) {
  bench.start('count_avx')
  for (let i = 0; i < runs; i++) {
    assert(count_avx_min(buf, 10, bytes) === expected)
  }
  bench.end(runs, bytes)
}

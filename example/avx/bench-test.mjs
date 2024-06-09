import { Bench } from './lib/bench.mjs'
import { createRequire } from "node:module"
const { test } = createRequire(import.meta.url)("./build/Release/linecount.node")

const bench = new Bench()
const runs = 80000000

for (let i = 0; i < 5; i++) {
  bench.start('test')
  for (let i = 0; i < runs; i++) {
    assert(test() === 1)
  }
  bench.end(runs)
}

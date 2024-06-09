import { Bench } from './lib/bench.mjs'

const { memcount } = lo.load('memcount')

const { core, assert } = lo
const { test } = memcount

const bench = new Bench()
const runs = 300000000

for (let i = 0; i < 5; i++) {
  bench.start('count_avx')
  for (let i = 0; i < runs; i++) {
    assert(test() === 1)
  }
  bench.end(runs)
}

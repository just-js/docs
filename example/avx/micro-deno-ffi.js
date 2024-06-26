import { Bench } from './lib/bench.mjs'
import { openSync, readSync, closeSync } from 'node:fs'

const {
  symbols: {
    memcount_avx2
  }
} = Deno.dlopen(
  './linecount.so',
  {
    memcount_avx2: {
      parameters: ['buffer', 'i32', 'u32'],
      result: 'u32',
    }
  }
)

const file_name = args[1] || '/dev/shm/test.log'
const buf = new Uint8Array(2 * 1024 * 1024)
const fd = openSync(file_name)
const bytes = readSync(fd, buf)
closeSync(fd)
const bench = new Bench()
const runs = parseInt(args[0] || 40000000, 10)
const expected = memcount_avx2(buf, 10, bytes)
console.log(expected)

for (let j = 0; j < 10; j++) {
  bench.start('memcount_avx2')
  for (let i = 0; i < runs; i++) {
    assert(memcount_avx2(buf, 10, bytes) === expected)
  }
  bench.end(runs)
}

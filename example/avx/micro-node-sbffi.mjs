import { Bench } from './lib/bench.mjs'
import { openSync, readSync, closeSync } from 'node:fs'
import { createRequire } from "node:module"

const { getNativeFunction, getBufferPointer, sizeof } = createRequire(import.meta.url)('sbffi')


const memcount_avx2 = getNativeFunction('./linecount.so', 'memcount_avx2', 'uint32_t', ['pointer', 'int32_t', 'uint32_t'])
const file_name = args[1] || '/dev/shm/test.log'
const buf = new Uint8Array(2 * 1024 * 1024)
const fd = openSync(file_name)
const bytes = readSync(fd, buf)
closeSync(fd)
const bench = new Bench()
const runs = parseInt(args[0] || 40000000, 10)

const buf_ptr = getBufferPointer(buf)
const expected = memcount_avx2(buf_ptr, 10, bytes)
console.log(expected)


for (let j = 0; j < 10; j++) {
  bench.start('memcount_avx2')
  for (let i = 0; i < runs; i++) {
    assert(memcount_avx2(buf_ptr, 10, bytes) === expected)
  }
  bench.end(runs)
}

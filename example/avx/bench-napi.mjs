import { Bench } from './lib/bench.mjs'
import { openSync, readSync, closeSync } from "node:fs"
import { createRequire } from "node:module"
const { count_avx } = createRequire(import.meta.url)("./build/Release/linecount.node")

const file_name = args[0] || '/dev/shm/test.log'
const buf = globalThis.Deno ? new Uint8Array(2 * 1024 * 1024) : Buffer.alloc(2 * 1024 * 1024)
const fd = openSync(file_name)
const bytes = readSync(fd, buf)
closeSync(fd)

const bench = new Bench()
const runs = 40000000

const expected = count_avx(buf, 10, bytes)

while (1) {
  bench.start('count_avx')
  for (let i = 0; i < runs; i++) {
    assert(count_avx(buf, 10, bytes) === expected)
  }
  bench.end(runs)
}

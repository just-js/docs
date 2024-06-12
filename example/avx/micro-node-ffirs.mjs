import { Bench } from './lib/bench.mjs'
import { openSync, readSync, closeSync } from 'node:fs'
import { createRequire } from "node:module"

const ffirs = createRequire(import.meta.url)('ffi-rs')

const { open, DataType, define } = ffirs

open({ library: 'linecount', path: './linecount.so' })
const { memcount_avx2 } = define({ memcount_avx2: { library: 'linecount', retType: DataType.I32, paramsType: [DataType.U8Array, DataType.I32, DataType.I32] }})
const file_name = args[1] || '/dev/shm/test.log'
const buf = new Uint8Array(2 * 1024 * 1024)
const fd = openSync(file_name)
const bytes = readSync(fd, buf)
closeSync(fd)
const bench = new Bench()
const runs = parseInt(args[0] || 40000000, 10)

const params = [buf, 10, bytes]
const expected = memcount_avx2(params)
console.log(`bytes ${bytes}`)
console.log(`lines ${expected}`)

for (let j = 0; j < 10; j++) {
  bench.start('memcount_avx2')
  for (let i = 0; i < runs; i++) {
    assert(memcount_avx2(params) === expected)
  }
  bench.end(runs)
}

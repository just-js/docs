import { Bench } from './lib/bench.mjs'
import { openSync, readSync, closeSync } from "node:fs"

const wasm = await readFileAsBytes('./wasm/linecount.wasm')
const mem = new WebAssembly.Memory({ initial: 256, maximum: 256 })
const mod = new WebAssembly.Module(wasm)
const instance = new WebAssembly.Instance(mod, { env: { memory: mem }})
const { malloc, memcount_sse2, _initialize } = instance.exports

_initialize()

function allocate_buffer (size) {
  const address = malloc(size)
  const buf = new Uint8Array(mem.buffer, address, size)
  buf.addr = address
  return buf
}

const file_name = args[1] || '/dev/shm/test.log'
const len = 2 * 1024 * 1024
const buf = allocate_buffer(len)
const fd = openSync(file_name)
const bytes = readSync(fd, buf)
closeSync(fd)
const bench = new Bench()
const runs = parseInt(args[0] || 40000000, 10)
const expected = memcount_sse2(buf.addr, 10, bytes)
console.log(`bytes ${bytes}`)
console.log(`lines ${expected}`)

for (let j = 0; j < 10; j++) {
  bench.start('count_avx')
  for (let i = 0; i < runs; i++) {
    assert(memcount_sse2(buf.addr, 10, bytes) === expected)
  }
  bench.end(runs)
}

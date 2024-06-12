import { Bench } from './lib/bench.mjs'
const { core, assert } = lo
const { close, open, read, O_RDONLY } = core

function allocate_buffer (size) {
  const address = malloc(size)
  const buf = new Uint8Array(mem.buffer, address, size)
  buf.addr = address
  return buf
}

const wasm = await readFileAsBytes('./wasm/linecount.wasm')
const mem = new WebAssembly.Memory({ initial: 256, maximum: 256 })
const mod = new WebAssembly.Module(wasm)
const instance = new WebAssembly.Instance(mod, { env: { memory: mem }})
const { malloc, memcount_sse2, _initialize } = instance.exports
_initialize()
const file_name = args[1] || '/dev/shm/test.log'
const len = 2 * 1024 * 1024
const buf = allocate_buffer(len)
const fd = open(file_name, O_RDONLY)
const bytes = read(fd, buf, len)
close(fd)
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

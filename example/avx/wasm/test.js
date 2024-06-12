import { Bench } from './lib/bench.mjs'

const { core, assert, ptr } = lo
const { 
  close, open, read2, O_RDONLY
} = core

const wasm = lo.core.read_file('./linecount.wasm')
const mem = new WebAssembly.Memory({ initial: 256, maximum: 256 })
const mod = new WebAssembly.Module(wasm)
const instance = new WebAssembly.Instance(mod, { env: { memory: mem }})
const { malloc, free, memcount_sse2, stackSave, stackAlloc, stackRestore, __errno_location, _initialize } = instance.exports

_initialize()

function allocate_buffer (size) {
  const address = malloc(size)
  const buf = ptr(new Uint8Array(mem.buffer, address, size))
  buf.addr = address
  return buf
}

function count_avx (ptr, c, len) {
  const sp = stackSave()
  const rc = memcount_sse2(ptr, c, len)
  stackRestore(sp)
  return rc
}

const len = 2 * 1024 * 1024
const buf = allocate_buffer(len)

const file_name = lo.args[lo.args[0] === 'lo' ? 3 : 2] || '/dev/shm/test.log'
const fd = open(file_name, O_RDONLY)
const bytes = read2(fd, buf.ptr, len)
close(fd)
const expected = count_avx(buf.addr, 10, bytes)
console.log(expected)

const bench = new Bench()
const runs = parseInt(lo.args[lo.args[0] === 'lo' ? 2 : 1] || 40000000, 10)
console.log(expected)

for (let j = 0; j < 10; j++) {
  bench.start('count_avx')
  for (let i = 0; i < runs; i++) {
    assert(memcount_sse2(buf.addr, 10, bytes) === expected)
  }
  bench.end(runs)
}

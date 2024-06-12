import { Bench } from './lib/bench.mjs'

const { core, assert, ptr } = lo
const { 
  close, open, read, O_RDONLY
} = core

/*
--experimental-wasm-revectorize (enable 128 to 256 bit revectorization for Webassembly SIMD (experimental))
      type: bool  default: --no-experimental-wasm-revectorize

--wasm-opt (enable wasm optimization)
  type: bool  default: --wasm-opt   

--turboshaft-wasm-wrappers (compile the wasm wrappers with Turboshaft (instead of TurboFan) (experimental))
      type: bool  default: --no-turboshaft-wasm-wrappers

--wasm-fast-api (Enable direct calls from wasm to fast API functions with bound call function to pass the the receiver as first parameter (experimental))

--experimental-wasm-skip-null-checks (enable skip null checks for call.ref and array and struct operations (unsafe) for Wasm (experimental))
      type: bool  default: --no-experimental-wasm-skip-null-checks
--experimental-wasm-skip-bounds-checks (enable skip array bounds checks (unsafe) for Wasm (experimental))
      type: bool  default: --no-experimental-wasm-skip-bounds-checks
--experimental-wasm-branch-hinting (enable branch hinting for Wasm (experimental))
      type: bool  default: --no-experimental-wasm-branch-hinting
--experimental-wasm-stack-switching (enable stack switching for Wasm (experimental))
      type: bool  default: --no-experimental-wasm-stack-switching

--experimental-wasm-shared (enable shared-everything threads for Wasm (experimental))
*/

const wasm = lo.core.read_file('./wasm/linecount.wasm')
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

const len = 2 * 1024 * 1024
const buf = allocate_buffer(len)
const file_name = lo.args[lo.args[0] === 'lo' ? 3 : 2] || '/dev/shm/test.log'
const fd = open(file_name, O_RDONLY)
const bytes = read(fd, buf, len)
close(fd)
const expected = memcount_sse2(buf.addr, 10, bytes)
const bench = new Bench()
const runs = parseInt(lo.args[lo.args[0] === 'lo' ? 2 : 1] || 40000000, 10)
console.log(`bytes ${bytes}`)
console.log(`lines ${expected}`)

for (let j = 0; j < 10; j++) {
  bench.start('count_avx')
  for (let i = 0; i < runs; i++) {
    assert(memcount_sse2(buf.addr, 10, bytes) === expected)
  }
  bench.end(runs)
}

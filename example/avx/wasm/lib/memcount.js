const wasm = lo.core.read_file('./linecount.wasm')
const mem = new WebAssembly.Memory({ initial: 256, maximum: 256 })
const mod = new WebAssembly.Module(wasm)
const instance = new WebAssembly.Instance(mod, { env: { memory: mem }})
const { malloc, free, memcount_sse2, stackSave, stackAlloc, stackRestore, __errno_location, _initialize } = instance.exports

_initialize()
const ptr = malloc(1024)
const buf = new Uint8Array(mem.buffer, ptr, 1024)
buf.ptr = ptr

function count_avx (ptr, c, len) {
  const sp = stackSave()
  const rc = memcount_sse2(ptr, c, len)
  stackRestore(sp)
  return rc
}

instance.exports.memcount_sse2()
const count = count_avx(buf.ptr, 10, buf.length)
console.log(count)

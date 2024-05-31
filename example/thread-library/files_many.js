import { bind } from 'lib/ffi.js'
import { dump } from 'lib/binary.js'

const { assert, core, ptr, addr, wrap_memory, unwrap_memory } = lo
const { dlsym, dlopen } = core

const handle = assert(dlopen('./read_file.so', 1))
const read_file = bind(assert(dlsym(handle, 'read_file')), 'i32', ['string', 'pointer', 'u32array'])
const u32 = new Uint32Array(2)
const stat = ptr(new Uint8Array(144))

const file_name = lo.args[2] || './read_file.c'
const concurrent = parseInt(lo.args[3] || '10', 10)
for (let i = 0; i < concurrent; i++) {
  const size = read_file(file_name, stat.ptr, u32)
  const buf = new Uint8Array(wrap_memory(addr(u32), size, 1))
  console.log(dump(buf.subarray(0, 256)))
  unwrap_memory(buf.buffer)
}

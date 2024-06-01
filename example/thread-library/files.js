import { bind } from 'lib/ffi.js'
import { dump } from 'lib/binary.js'

const { assert, core, ptr, wrap_memory, unwrap_memory } = lo
const { dlsym, dlopen } = core
/*
using the assembler, we could automatically create thread wrappers
for C functions with a trampoline for mapping the thread context into the
function call

so we could spin up a bunch of threads that read files into memory
we can then dynamically wrap and unwrap segments of those files
using wrap_memory and unwrap_memory
*/
const handle = assert(dlopen('./read_file.so', 1))
const read_file = bind(assert(dlsym(handle, 'read_file')), 'i32', ['string', 'pointer', 'u32array'])
const addr = new Uint32Array(2)
const stat = ptr(new Uint8Array(144))
const size = read_file('/dev/shm/bzImage', stat.ptr, addr)
const buf = new Uint8Array(wrap_memory(lo.addr(addr), size, 1))
console.log(dump(buf.subarray(0, 1024)))
unwrap_memory(buf.buffer)

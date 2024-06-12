import { Bench } from './lib/bench.mjs'
import { bind } from 'lib/ffi.js'

const { core, assert } = lo
const { 
  close, open, read2, mmap, madvise, dlopen, dlsym, RTLD_NOW,
  O_RDONLY, MAP_PRIVATE, MAP_ANONYMOUS, MADV_HUGEPAGE, PROT_READ, PROT_WRITE
} = core
const memory_flags = MAP_ANONYMOUS | MAP_PRIVATE

const dlentry = assert(dlopen('./linecount.so', RTLD_NOW))
const count_avx = bind(assert(dlsym(dlentry, 'memcount_avx2')), 'u32', ['pointer', 'i32', 'u32'])

function create_buffer (size, prot = PROT_READ | PROT_WRITE) {
  const ptr = assert(mmap(0, size, prot, memory_flags, -1, 0))
  assert(madvise(ptr, size, MADV_HUGEPAGE) === 0)
  return ptr
}

const len = 2 * 1024 * 1024
const buf_ptr = create_buffer(len)
const file_name = lo.args[lo.args[0] === 'lo' ? 3 : 2] || '/dev/shm/test.log'
const fd = open(file_name, O_RDONLY)
const bytes = read2(fd, buf_ptr, len)
close(fd)
const expected = count_avx(buf_ptr, 10, bytes)
const bench = new Bench()
const runs = parseInt(lo.args[lo.args[0] === 'lo' ? 2 : 1] || 40000000, 10)
console.log(`bytes ${bytes}`)
console.log(`lines ${expected}`)

for (let j = 0; j < 10; j++) {
  bench.start('count_avx ffi')
  for (let i = 0; i < runs; i++) {
    assert(count_avx(buf_ptr, 10, bytes) === expected)
  }
  bench.end(runs)
}

import { dump } from 'lib/binary.js'
import { Bench } from 'lib/bench.mjs'

const { core, wrap_memory, assert } = lo
const { 
  memcpy, memfd_create, mmap, madvise, mprotect, munmap, free, calloc, memmove,
  MAP_PRIVATE, MAP_SHARED, MAP_ANONYMOUS, MADV_HUGEPAGE, PROT_READ, PROT_WRITE
} = core
const memory_flags = MAP_ANONYMOUS | MAP_PRIVATE

function create_buffer (size, prot) {
  const ptr = assert(mmap(0, size, prot, memory_flags, -1, 0))
  assert(madvise(ptr, size, MADV_HUGEPAGE) === 0)
//  const ptr = assert(calloc(1, size))
  const buf = wrap_memory(ptr, size, 1)
  assert(buf.length === size)
  buf.ptr = ptr
  return buf
}

function create_src_and_dest (size) {
  return { src: create_buffer(size, PROT_READ | PROT_WRITE), dest: create_buffer(size, PROT_READ | PROT_WRITE) }
}

const size = parseInt(lo.args[2] || '1024')
const runs = parseInt(lo.args[3] || '50_000_000')

const { src, dest } = create_src_and_dest(size)

src.fill(1)

assert(memmove(dest.ptr, src.ptr, src.length) === dest.ptr)
//Array.from(dest).forEach(v => assert(v === 1))

const bench = new Bench()

console.log('start')
for (let i = 0; i < 5; i++) {
  bench.start(`memcpy ${size}`)
  for (let j = 0; j < runs; j++) {
    assert(memmove(dest.ptr, src.ptr, src.length) === dest.ptr)
  }
  bench.end(runs)
}

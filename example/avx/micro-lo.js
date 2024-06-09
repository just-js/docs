import { Bench } from './lib/bench.mjs'

const { memcount } = lo.load('memcount')

const { core, assert } = lo
const { count_avx } = memcount
const { 
  close, open, read2, mmap, madvise, 
  O_RDONLY, MAP_PRIVATE, MAP_ANONYMOUS, MADV_HUGEPAGE, PROT_READ, PROT_WRITE
} = core
const memory_flags = MAP_ANONYMOUS | MAP_PRIVATE

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
console.log(expected)

for (let j = 0; j < 10; j++) {
  bench.start('count_avx')
  for (let i = 0; i < runs; i++) {
    assert(count_avx(buf_ptr, 10, bytes) === expected)
  }
  bench.end(runs)
}

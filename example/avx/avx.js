import { Bench } from 'lib/bench.mjs'

const { memcount } = lo.load('memcount')
const { core, assert } = lo
const { count_avx, count_sse } = memcount
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

function count_chars_avx (file_name) {
  let total = 0
  let bytes = 0
  const fd = open(file_name, O_RDONLY)
  assert(fd > 2)
  while ((bytes = read2(fd, buf_ptr, len)) > 0) {
    total += count_avx(buf_ptr, LF, bytes)
  }
  close(fd)
  return total
}

function count_chars_sse (file_name) {
  let total = 0
  let bytes = 0
  const fd = open(file_name, O_RDONLY)
  assert(fd > 2)
  while ((bytes = read2(fd, buf_ptr, len)) > 0) {
    total += count_sse(buf_ptr, LF, bytes)
  }
  close(fd)
  return total
}

const LF = '\n'.charCodeAt(0)
const len = 2 * 1024 * 1024
const buf_ptr = create_buffer(len)
const file_name = lo.args[2] || './test.log'
const expected = count_chars_avx(file_name)
assert(expected === count_chars_sse(file_name))
const bench = new Bench()
const runs = 10

while (1) {
  bench.start('count_chars_avx')
  for (let i = 0; i < runs; i++) {
    assert(count_chars_avx(file_name) === expected)
  }
  bench.end(runs)

  bench.start('count_chars_sse')
  for (let i = 0; i < runs; i++) {
    assert(count_chars_sse(file_name) === expected)
  }
  bench.end(runs)
}

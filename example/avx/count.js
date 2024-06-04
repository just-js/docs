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

function count_chars (file_name) {
  let total = 0
  let bytes = 0
  const fd = open(file_name, O_RDONLY)
  assert(fd > 2)
  while ((bytes = read2(fd, buf_ptr, len)) > 0) {
    total += count_avx(buf_ptr, 10, bytes)
  }
  close(fd)
  return total
}

const len = 2 * 1024 * 1024
const buf_ptr = create_buffer(len)
const file_name = lo.args[2] || '/dev/shm/test.log'
const expected = count_chars(file_name)
console.log(expected)

while (1) {
  const start = lo.hrtime()
  assert(count_chars(file_name) === expected)
  console.log(`time ${lo.hrtime() - start} ns`)
}

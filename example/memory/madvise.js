import { mem } from 'lib/proc.js'
import { system } from 'lib/system.js'

const {
  core, assert,  ptr, wrap, wrap_memory, unwrap_memory, cstr, colors, hrtime
} = lo
const { 
  open, close, mmap, munmap, free, ioctl2, ioctl3, putchar, aligned_alloc,
  little_endian, madvise, posix_fadvise, read2, fstat, memcpy, memmove, lseek,
  sleep
} = core
const {
  PROT_READ, PROT_WRITE, MAP_PRIVATE, MAP_ANONYMOUS, MAP_SHARED, EINTR, EAGAIN, 
  O_RDWR, MADV_HUGEPAGE, POSIX_FADV_SEQUENTIAL, POSIX_FADV_WILLNEED, O_RDONLY,
  POSIX_FADV_RANDOM, MAP_FIXED, SEEK_SET
} = core
const { AY, AD, AG, AM } = colors
const memory_flags = MAP_ANONYMOUS | MAP_PRIVATE

let reads = 0

const read3 = (...args) => {
  reads++
  return read2(...args)
}

function read_file (fd, ptr, size) {
  let off = 0
  let len = read2(fd, ptr + off, size - off)
  if (len === size) return len
  console.log(len)
  console.log(size)
  off += len
  while ((len = read2(fd, ptr + off, size - off)) > 0) off += len
  console.log(len)
  console.log(system.strerror())
  return off
}

function create_guest_memory (ram_size = RAM_SIZE) {
  // mmap guest memory
  const mem_ptr = assert(mmap(0, ram_size, PROT_READ | PROT_WRITE, memory_flags, -1, 0))
  // huge pages is 17ms v 28 ms for 32 MB guest kernel boot
  // https://blog.davidv.dev/minimizing-linux-boot-times.html
  assert(madvise(mem_ptr, ram_size, MADV_HUGEPAGE) === 0)
  return mem_ptr
}

const stat = new Uint8Array(160)
const st = new BigUint64Array(stat.buffer)

function open_src_file (path, rv) {
  rv[0] = open(path, O_RDONLY)
  assert(rv[0] > 0)
  assert(fstat(rv[0], stat) === 0)
  rv[1] = Number(st[6])
  assert(posix_fadvise(rv[0], 0, rv[1], POSIX_FADV_WILLNEED | POSIX_FADV_SEQUENTIAL) === 0)
  return rv
}

const ram_size = 1024 * 1024 * 1024
const mem_ptr = create_guest_memory(ram_size)
const file_name = lo.args[2] || './30M.bin'

const rv = [0, 0]

let start = 0
while (1) {
  start = hrtime()
  const [ fd, size ] = open_src_file(file_name, rv)
  assert(read_file(fd, mem_ptr, size) === size)
  close(fd)
  const elapsed = hrtime() - start
  const rate = size / (elapsed / 1000000000)
  const MBps = Math.ceil(rate / (1024 * 1024))
  const Mbps = MBps * 8
  console.log(`${AY}time${AD} ${elapsed} rss ${AG}${mem()}${AD} ${AM}rate${AD} ${MBps} MB/sec ${Mbps} Mbit/sec`)
  sleep(1)
}

//console.log(reads)

//close(fd)

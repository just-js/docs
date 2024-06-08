import { write_flags, write_mode } from 'lib/fs.js'
const { core, assert } = lo
const { open, write, close, read_file } = core
const file_name = lo.args[2] || '/dev/shm/test.log'
const size = parseInt(lo.args[3] || 1024, 10)
const fd = open(file_name, write_flags, write_mode)
const buf = read_file('count.js')
const chunks = Math.floor(size / buf.length)
const remainder = size % buf.length
for (let i = 0; i < chunks; i++) {
  assert(write(fd, buf, buf.length) === buf.length)
}
assert(write(fd, buf, remainder) === remainder)
/*
const chunk_size = Math.min(size, 2 * 1024 * 1024)
const chunks = Math.floor(size / chunk_size)
const buf = new Uint8Array((new Array(chunk_size)).fill(0).map(v => Math.floor(Math.random() * 256)))
for (let i = 0; i < chunks; i++) {
  assert(write(fd, buf, buf.length) === buf.length)
}
*/
close(fd)

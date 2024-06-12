import { write_flags, write_mode } from 'lib/fs.js'
const { core, assert } = lo
const { open, write, close, read_file } = core
const file_name = lo.args[2] || '/dev/shm/test.log'
const size = parseInt(lo.args[3] || 1024, 10)
const fd = open(file_name, write_flags, write_mode)
const buf = read_file('create_test_file.js')
const chunks = Math.floor(size / buf.length)
const remainder = size % buf.length
for (let i = 0; i < chunks; i++) {
  assert(write(fd, buf, buf.length) === buf.length)
}
assert(write(fd, buf, remainder) === remainder)
close(fd)

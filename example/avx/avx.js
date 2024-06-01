const { memcount } = lo.load('memcount')

const { core, assert, ptr } = lo
const { close, dlopen, dlsym, open, O_RDONLY, read } = core
const { count } = memcount

const LF = '\n'.charCodeAt(0)
const len = 2 * 1024 * 1024
const buf = ptr(new Uint8Array(len))

function count_chars (file_name) {
  let total = 0
  let bytes = 0
  const fd = open(file_name, O_RDONLY)
  assert(fd > 2)
  while (bytes = read(fd, buf, len)) {
    total += count(buf.ptr, LF, bytes)
  }
  close(fd)
  return total
}

console.log(count_chars(lo.args[2] || './test.log'))

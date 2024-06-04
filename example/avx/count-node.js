const fs = require('fs')

function assert (condition, message, ErrorType = Error) {
  if (!condition) {
    throw new ErrorType(message || "Assertion failed")
  }
}

function on_chunk (chunk, length) {
  let pos = 0
  let count = 0
  while ( pos < length ) {
    const next = chunk.indexOf(10, pos)
    if ( next === -1 ) break
    pos = next + 1
    count += 1
  }
  return count
}

function count_chars (file_name) {
  let count = 0
  const fd = fs.openSync(file_name)
  let bytes = fs.readSync(fd, buf)
  while (bytes > 0) {
    count += on_chunk(buf, bytes)
    bytes = fs.readSync(fd, buf)
  }
  fs.closeSync(fd)
  return count
}

const file_name = process.argv[2] || '/dev/shm/test.log'
const buf = Buffer.alloc(2 * 1024 * 1024)
const expected = count_chars(file_name)
console.log(expected)

while (1) {
  const start = performance.now()
  assert(count_chars(file_name) === expected)
  console.log(`time ${Math.floor((performance.now() - start) * 1000000)} ns`)
}

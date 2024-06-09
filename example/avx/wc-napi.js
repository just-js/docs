const fs = require('fs')

const { count_avx } = require('./build/Release/linecount.node')
const { openSync, readSync } = fs

const fd = openSync(process.argv[2] || '/dev/shm/test.log')
const buf = Buffer.alloc(2 * 1024 * 1024)
let count = 0
let bytes = readSync(fd, buf)
while (bytes > 0) {
  count += count_avx(buf, 10, bytes)
  bytes = readSync(fd, buf)
}
console.log(count)

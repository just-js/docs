const fs = require('fs')

function on_chunk (chunk, length) {
  let pos = 0;
  while ( pos < length ) {
    const next = chunk.indexOf(10, pos);
    if ( next === -1 ) break;
    pos = next + 1;
    count += 1;
  }
}

const fd = fs.openSync(process.argv[2] || '/dev/shm/test.log')
const buf = Buffer.alloc(2 * 1024 * 1024)
let count = 0
let bytes = fs.readSync(fd, buf)
while (bytes > 0) {
  on_chunk(buf, bytes)
  bytes = fs.readSync(fd, buf)
}
console.log(count)

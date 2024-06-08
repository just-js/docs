let count = 0;

function on_chunk (chunk) {
  let pos = 0;
  let length = chunk.length;
  while ( pos < length ) {
    const next = chunk.indexOf(10, pos);
    if ( next === -1 ) break;
    pos = next + 1;
    count += 1;
  }
}

const file = Bun.file(process.argv[2] || '/dev/shm/test.log');
const stream = file.stream();
for await (const chunk of stream) {
  on_chunk(chunk)
}
console.log(count);

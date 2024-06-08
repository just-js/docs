let count = 0;

function on_chunk (chunk, length = chunk.length) {
  let pos = 0;
  while ( pos < length ) {
    const next = chunk.indexOf('\n', pos);
    if ( next === -1 ) break;
    pos = next + 1;
    count += 1;
  }
}

const file = Bun.file(process.argv[2] || '/dev/shm/test.log');
const decoder = new TextDecoder();
const stream = file.stream();
for await (const chunk of stream) {
  on_chunk(decoder.decode(chunk));
}
console.log(count);

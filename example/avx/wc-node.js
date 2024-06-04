var count = 0;

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

require('fs').createReadStream(process.argv[2] || '/dev/shm/test.log', { highWaterMark: 2 * 1024 * 1024 })
  .on('data', on_chunk)
  .on('end', function() {
    console.log(count);
  });

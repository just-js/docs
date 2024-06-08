import { measure } from "./lib/bench.mjs"

function on_chunk (chunk, length = chunk.length) {
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

async function count_chars (file_name) {
  let count = 0
  const file = Bun.file(file_name);
  const stream = file.stream();
  for await (const chunk of stream) {
    count += on_chunk(chunk)
  }
  return count
}

const file_name = process.argv[2] || '/dev/shm/test.log'
const expected = await count_chars(file_name)
console.log(expected)

while (1) {
  measure.start()
  assert((await count_chars(file_name)) === expected)
  measure.log()
}

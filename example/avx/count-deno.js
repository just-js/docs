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
  const file = await Deno.open(file_name)
  let bytes = await file.read(chunk)
  while (bytes > 0) {
    count += on_chunk(chunk, bytes)
    bytes = await file.read(chunk)
  }
  return count
}

const file_name = Deno.args[2] || '/dev/shm/test.log'
const chunk = new Uint8Array(2 * 1024 * 1024)
const expected = await count_chars(file_name)
console.log(expected)

while (1) {
  measure.start()
  assert((await count_chars(file_name)) === expected)
  measure.log()
}

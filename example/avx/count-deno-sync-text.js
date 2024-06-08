import { measure } from "./lib/bench.mjs"

function on_chunk (chunk, length = chunk.length) {
  let pos = 0
  let count = 0
  while ( pos < length ) {
    const next = chunk.indexOf('\n', pos)
    if ( next === -1 ) break
    pos = next + 1
    count += 1
  }
  return count
}

function count_chars (file_name) {
  let count = 0
  const file = Deno.openSync(file_name)
  let bytes = file.readSync(chunk)
  while (bytes > 0) {
    if (bytes === chunk.length) {
      count += on_chunk(decoder.decode(chunk), bytes)
    } else {
      count += on_chunk(decoder.decode(chunk.subarray(0, bytes), bytes))
    }
    bytes = file.readSync(chunk)
  }
  return count
}

const decoder = new TextDecoder();
const file_name = Deno.args[2] || '/dev/shm/test.log'
const chunk = new Uint8Array(2 * 1024 * 1024)
const expected = count_chars(file_name)
console.log(expected)

while (1) {
  measure.start()
  assert((count_chars(file_name)) === expected)
  measure.log()
}

import { measure } from "./lib/bench.mjs"
import * as fs from "node:fs"

function on_chunk (chunk, length) {
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
  const fd = fs.openSync(file_name)
  let bytes = fs.readSync(fd, buf)
  while (bytes > 0) {
    if (bytes === buf.length) {
      count += on_chunk(decoder.decode(buf), bytes)
    } else {
      count += on_chunk(decoder.decode(buf.subarray(0, bytes)), bytes)
    }
    bytes = fs.readSync(fd, buf)
  }
  fs.closeSync(fd)
  return count
}

const decoder = new TextDecoder()
const file_name = args[0] || '/dev/shm/test.log'
const buf = globalThis.Deno ? new Uint8Array(2 * 1024 * 1024) : Buffer.alloc(2 * 1024 * 1024)
const expected = count_chars(file_name)
console.log(expected)

while (1) {
  measure.start()
  assert(count_chars(file_name) === expected)
  measure.log()
}

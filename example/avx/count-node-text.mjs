import { measure } from "./lib/bench.mjs"
import * as fs from "node:fs"

const { createReadStream } = fs

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
  return new Promise((resolve, reject) => {
    let count = 0
    createReadStream(file_name, { encoding: 'utf-8', highWaterMark: 2 * 1024 * 1024 })
      .on('data', chunk => {
        count += on_chunk(chunk);
      })
      .on('error', reject)
      .on('end', function() {
        resolve(count);
      });
  })
}

const file_name = args[0] || '/dev/shm/test.log'
const expected = await count_chars(file_name)
console.log(expected)

while (1) {
  measure.start()
  assert((await count_chars(file_name)) === expected)
  measure.log()
}

import { measure } from "./lib/bench.mjs"
import { openSync, readSync, closeSync } from "node:fs"
import { createRequire } from "node:module"
const { count_avx } = createRequire(import.meta.url)("./build/Release/linecount.node")

function count_chars (file_name) {
  let count = 0
  const fd = openSync(file_name)
  let bytes = readSync(fd, buf)
  while (bytes > 0) {
    count += count_avx(buf, 10, bytes)
    bytes = readSync(fd, buf)
  }
  closeSync(fd)
  return count
}

const file_name = args[0] || '/dev/shm/test.log'
const buf = globalThis.Deno ? new Uint8Array(2 * 1024 * 1024) : Buffer.alloc(2 * 1024 * 1024)
const expected = count_chars(file_name)
console.log(expected)

while (1) {
  measure.start()
  assert(count_chars(file_name) === expected)
  measure.log()
}

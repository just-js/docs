import { Bench } from './lib/bench.mjs'

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

function on_chunk_linear (chunk, length = chunk.length) {
  let count = 0
  for (let i = 0; i < length; i++) {
    if (chunk[i] === 10) count++
  }
  return count
}

function on_chunk_string (chunk, length = chunk.length) {
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

function on_chunk_string_split (chunk) {
  return chunk.split('\n').length - 1
}

const rx = /\n/g

function on_chunk_string_regex (chunk) {
  return chunk.match(rx).length
}

const file_name = args[1] || '/dev/shm/test.log'
const buf = new Uint8Array(2 * 1024 * 1024)
const fd = openSync(file_name)
const bytes = readSync(fd, buf)
closeSync(fd)
const expected = on_chunk(buf, bytes)
console.log(`bytes ${bytes}`)
console.log(`lines ${expected}`)

function benchmark (fn, name = fn.name) {
  let bench = new Bench(false)
  let runs = 100
  while (1) {
    bench.start(name)
    for (let i = 0; i < runs; i++) {
      assert(fn() === expected)
    }
    const { rate, elapsed } = bench.end(runs)
    if (elapsed >= 1000) {
      runs = rate
      break
    } else {
      runs *=2
    }
  }
  bench = new Bench()
  for (let j = 0; j < 10; j++) {
    bench.start(name)
    for (let i = 0; i < runs; i++) {
      assert(fn() === expected)
    }
    bench.end(runs)
  }
}

const decoder = new TextDecoder()
const str = decoder.decode(buf.subarray(0, bytes))

benchmark(() => on_chunk(buf, bytes), 'buffer-index')
benchmark(() => on_chunk_linear(buf, bytes), 'buffer-linear')
benchmark(() => on_chunk_string(str), 'string-index')
benchmark(() => on_chunk_string_split(str), 'string-split')
benchmark(() => on_chunk_string_regex(str), 'string-regex')
benchmark(() => on_chunk_string(decoder.decode(buf.subarray(0, bytes))), 'string-decode-index')

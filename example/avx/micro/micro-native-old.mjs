import { Bench } from './lib/bench.mjs'
import { openSync, readSync, closeSync } from 'node:fs'

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

function on_chunk2 (chunk, length = chunk.length) {
  let count = 0
  for (let i = 0; i < length; i++) {
    if (chunk[i] === 10) count++
  }
  return count
}

const file_name = args[1] || '/dev/shm/test.log'
const buf = new Uint8Array(2 * 1024 * 1024)
const fd = openSync(file_name)
const bytes = readSync(fd, buf)
closeSync(fd)
const expected = on_chunk(buf, bytes)
console.log(expected)

let bench = new Bench(false)
let runs = parseInt(args[0] || 40000000, 10)

for (let j = 0; j < 3; j++) {
  bench.start('on_chunk')
  for (let i = 0; i < runs; i++) {
    assert(on_chunk(buf, bytes) === expected)
  }
  const { ns_iter, rate } = bench.end(runs)
  runs = rate * 2
}

bench = new Bench()

for (let j = 0; j < 5; j++) {
  bench.start('on_chunk')
  for (let i = 0; i < runs; i++) {
    assert(on_chunk(buf, bytes) === expected)
  }
  bench.end(runs)
}

bench = new Bench(false)

for (let j = 0; j < 3; j++) {
  bench.start('on_chunk2')
  for (let i = 0; i < runs; i++) {
    assert(on_chunk2(buf, bytes) === expected)
  }
  const { ns_iter, rate } = bench.end(runs)
  runs = rate * 2
}

bench = new Bench()

for (let j = 0; j < 5; j++) {
  bench.start('on_chunk2')
  for (let i = 0; i < runs; i++) {
    assert(on_chunk2(buf, bytes) === expected)
  }
  bench.end(runs)
}

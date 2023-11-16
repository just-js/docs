/*
taskset --cpu-list 0 dd status=none if=/dev/zero bs=65536 count=1000000 | taskset --cpu-list 1 lo util/bench/wc.js
*/
const { read } = lo.core
const buf = new Uint8Array(65536)
const len = buf.length
let total = 0
const start = Date.now()
let bytes = read(0, buf, len)
while (bytes = read(0, buf, len)) total += bytes
const end = Date.now()
const elapsed = end - start
let rate = Math.ceil(total / (elapsed / 1000))
if (rate < 1000) {
  console.log(`${rate} Bytes p/sec`)
} else if (rate < 1000 * 1000) {
  console.log(`${rate / 1000} KBytes p/sec`)
} else if (rate < 1000 * 1000 * 1000) {
  console.log(`${rate / (1000 * 1000)} MBytes p/sec`)
} else {
  console.log(`${rate / (1000 * 1000 * 1000)} GBytes p/sec`)
}

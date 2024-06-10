import { colors } from './lib/bench.mjs'

const { AM, AY, AG, AD, AC } = colors

const results = `lo-binding 19.88
lo-ffi 17.48
node-napi 88.36
node-napi-min 79.67
bun-napi 63.11
bun-napi-min 54.49
deno-napi 147.24
deno-napi-min 121.72
bun-ffi 57.28
deno-ffi 19.78
node-sbffi 342.66
node-koffi 378.06
bun-sbffi 168.06
bun-koffi 254.14
deno-sbffi 534.42`

const lines = results.split('\n')
const data = []
for (const line of lines) {
  const [ name, nanos ] = line.split(' ').map((v, i) => i === 0 ? v : parseFloat(v))
  data.push({ name, nanos })
}
data.sort((a, b) => {
  if (a.nanos > b.nanos) return 1
  if (a.nanos < b.nanos) return -1
  return 0
})

const max = Math.max(...data.map(v => v.nanos))
const min = Math.min(...data.map(v => v.nanos))
//const f = '⬜'
//const f = '💩'
//const f = '👾'
//const f = '🤖'
//const f = '🐞'
//const f = '🚨'
//const f = '⭐'
//const f = '⚡'
//const f = '🔥'
//const f = '✨'
//const f = '🎗'
//const f = '🏆'
//const f = '👑'
//const f = '💎'
//const f = '🔔'
//const f = '🪙'
//const f = '💊'
//const f = '⚰'
//const f = '🪦'
//const f = '⚠'
//const f = '☢'
//const f = '⏹'
//const f = '🔅'
//const f = '🟠'
//const f = '🟡'
//const f = '🔴'
//const f = '🟢'
//const f = '🔵'
//const f = '🟣'
//const f = '🟥'
//const f = '🔶'
//const f = '💀'
const dots = ['🟢', '🟡', '🟠', '🔴']
console.log('')
console.log(`${AY}${'name'.padEnd(16, ' ')}${AD} | ${AY}${'nanos'.padStart(8, ' ')}${AD} | ${AY}${'%'.padStart(8, ' ')}${AD} |`)
console.log('-'.repeat(40))
let best = data[0].nanos
for (const { name, nanos } of data) {
  const blocks = Math.ceil((nanos / max) * 30)
  const pc = ((nanos / best) * 100)
  let f = dots[0]
  if (pc > 1000) {
    f = dots[3]
  } else if (pc > 500) {
    f = dots[2]
  } else if (pc > 100) {
    f = dots[1]
  }
  console.log(`${AM}${name.slice(0, 16).padEnd(16, ' ')}${AD} | ${AD}${nanos.toFixed(2).padStart(8, ' ')}${AD} | ${AG}${pc.toFixed(2).padStart(8, ' ')}${AD} | ${(new Array(blocks)).fill(f).join('')}`)
}
console.log('')

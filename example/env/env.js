const { colors, core, wrap_memory, addr, assert, utf8_decode } = lo
const { dlsym, strnlen } = core

const { AY, AD } = colors
const MAX_LEN = 4096

function read_string (ptr) {
  return utf8_decode(ptr, strnlen(ptr, MAX_LEN))
}

function deref (ptr) {
  return addr(new Uint32Array(wrap_memory(ptr, 8).buffer))
//  return Number(new BigUint64Array(wrap_memory(ptr, 8).buffer)[0])
}

let next = deref(assert(dlsym(0, 'environ')))
let ptr = deref(next)
while (ptr) {
  //console.log(`${next}: ${ptr} ${read_string(ptr)}`)
  const parts = read_string(ptr).split('=')
  console.log(`${AY}${parts[0]}${AD} ${parts.slice(1).join('=')}`)
  next += 8
  ptr = deref(next)
}

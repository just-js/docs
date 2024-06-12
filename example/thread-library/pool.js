import { mem } from 'lib/proc.js'

const { fd, ptr, utf8_decode, core } = lo
const { read, write } = core

const szbuf = new Uint8Array(8)
const sz32 = new Uint32Array(lo.buffer, 0, 4)
const payload = ptr(new Uint8Array(lo.buffer, 4))

while (1) {
  const bytes = read(fd, szbuf, 8)
  if (bytes <= 0) break
  const size = sz32[0]
  const src = utf8_decode(payload.ptr, size)
  try {
    eval(src)
  } catch (err) {
    console.log(err.stack)
  }
}

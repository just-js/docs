import { Compiler } from 'lib/tcc.js'
import { bind } from 'lib/ffi.js'

const { ptr, registerCallback, assert, core } = lo
const { dlsym } = core

const compiler = new Compiler()

// for some reason on debian i have to add these paths to tcc
compiler.includes('/usr/lib/gcc/x86_64-linux-gnu/12/include')
compiler.paths('/usr/lib/x86_64-linux-gnu/tcc')

compiler.compile(`
#include <unistd.h>

typedef void (*noop_callback)(void*);

void callmulti (noop_callback cb, void* ctx) {
  for (int i = 0; i < 100000000; i++) {
    cb(ctx);
  }
}
`)

const callmulti = bind(compiler.symbol('callmulti'), 'void', ['pointer', 'pointer'])

let calls = 0
const ctx = ptr(new Uint8Array(1024))
const callback_address = dlsym(0, 'lo_callback')
assert(callback_address)
registerCallback(ctx.ptr, () => calls++)
const start = Date.now()
callmulti(callback_address, ctx.ptr)
const elapsed = Date.now() - start
const rate = Math.floor(calls / (elapsed / 1000))
const nanos = Math.floor((1 / rate) * 1e9)
console.log(`${calls} calls in ${elapsed} ms, rate = ${rate}, ns/iter = ${nanos}`)

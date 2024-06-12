import { spawn, join, try_join, pthread } from 'lib/thread.js'
import { Bench } from 'lib/bench.mjs'
import * as tcc from 'lib/tcc.js'

const { ptr } = lo
const { EBUSY } = pthread

const c_compiler = new tcc.Compiler()
c_compiler.compile(`
#include <unistd.h>

void sleeper () {
  sleep(100);
}
`)

const ctx = new Uint8Array(0)
const sym = assert(c_compiler.symbol('sleeper'))
const tid = spawn(sym, ctx)

const rcbuf = ptr(new Uint32Array(2))

const bench = new Bench()
const runs = 100000000

while (1) {
  bench.start('try_join')
  for (let i = 0; i < runs; i++) {
    assert(try_join(tid, rcbuf.ptr)[0] === EBUSY)
  }
  bench.end(runs)
}

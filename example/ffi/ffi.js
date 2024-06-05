import { Compiler } from 'lib/tcc.js'
import { bind } from 'lib/ffi.js'
import { Bench } from 'lib/bench.mjs'

const { assert } = lo
const { noop } = lo.load('noop')

const compiler = new Compiler()

compiler.compile(`
void noop () {
}
`)

const noop_fast_ffi = bind(compiler.symbol('noop'), 'void', [])
const noop_slow_ffi = bind(compiler.symbol('noop'), 'void', [], true)

const { noop_fast, noop_slow } = noop

const bench = new Bench()

while (1) {
  {
    const runs = 300000000
    bench.start('noop_fast')
    for (let i = 0; i < runs; i++) assert(noop_fast() === undefined)
    bench.end(runs)
  }

  {
    const runs = 100000000
    bench.start('noop_slow')
    for (let i = 0; i < runs; i++) assert(noop_slow() === undefined)
    bench.end(runs)
  }

  {
    const runs = 300000000
    bench.start('noop_fast_ffi')
    for (let i = 0; i < runs; i++) assert(noop_fast_ffi() === undefined)
    bench.end(runs)
  }

  {
    const runs = 100000000
    bench.start('noop_slow_ffi')
    for (let i = 0; i < runs; i++) assert(noop_slow_ffi() === undefined)
    bench.end(runs)
  }

}

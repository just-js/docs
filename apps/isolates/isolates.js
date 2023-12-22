import { Bench } from 'lib/bench.js'
import { dump } from 'lib/binary.js'
import { mem } from 'lib/proc.js'

const { core, assert, ptr, hrtime } = lo
const {
  isolate_context_create, isolate_context_size, isolate_start,
  isolate_context_destroy
} = core

const runtime = `
const time = new Uint32Array(2)

function addr (u32) {
  return u32[0] + ((2 ** 32) * u32[1])  
}

function hrtime () {
  lo.hrtime(time)
  return addr(time)
}

globalThis.console = {
  log: str => lo.print(str + '\\n')
}

globalThis.hrtime = hrtime
globalThis.onExit = () => {
  lo.buffer[0] = 255
}
lo.buffer = new Uint8Array(lo.buffer)

new Function(lo.workerSource)()
/*
async function on_module_load (specifier, resource) {
  if (!mod) {
    mod = lo.loadModule(lo.workerSource, specifier)
    mod.namespace = await lo.evaluateModule(mod.identity)
  }
  return mod.namespace
}

let mod

function on_module_instantiate (specifier) {
  return mod.identity
}

lo.setModuleCallbacks(on_module_load, on_module_instantiate)

await import('@thread')
*/
`
const script = `
const { buffer } = lo
const i = buffer[0] + 1
buffer.fill(i)
`

let n = 0
const buf = ptr(new Uint8Array(32))
buf.fill(n)
console.log(dump(buf))
const context = new Uint8Array(isolate_context_size())
const argc = 0
const argv = 0
const fd = 0
const cleanup = 1
const on_exit = 1
const snapshot = 0
isolate_context_create(argc, argv, runtime, runtime.length, script, 
  script.length, buf.ptr, buf.length, fd, hrtime(), 'lo', 'test.js', cleanup, 
  on_exit, snapshot, context)
isolate_start(context)
console.log(dump(buf))
console.log(dump(context))
assert(buf[0] === 255)

const bench = new Bench(true, mem)
let iter = 20
const runs = 3000
for (let i = 0; i < iter; i++) {
  bench.start('isolate_start')
  for (let j = 0; j < runs; j++) {
    isolate_start(context)
    assert(buf[0] === 255)
  }
  bench.end(runs)
}

isolate_context_destroy(context)
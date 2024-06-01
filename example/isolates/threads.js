import { Bench } from 'lib/bench.js'
import { dump } from 'lib/binary.js'

const { pthread } = lo.load('pthread')

const { core, assert, ptr, hrtime, utf8Length, addr } = lo
const {
  isolate_context_create, isolate_context_size, isolate_start,
  isolate_context_destroy, dlsym
} = core

let RTLD_MAIN_ONLY = 0
if (core.os === 'mac') RTLD_MAIN_ONLY = Number(core.RTLD_MAIN_ONLY)

const runtime = `
const { core } = lo.library('core')

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

globalThis.onUnhandledRejection = err => {
  console.log(err.stack)
}

const AsyncFunction = async function () {}.constructor
const time = new Uint32Array(2)
lo.core = core
lo.buffer = new Uint8Array(lo.buffer)
await (new AsyncFunction(lo.workerSource))()
`

const worker = `
const { core } = lo.library('core')
const { curl } = lo.library('curl')

const { buffer, fd } = lo
const len = buffer.length

for (let i = 0; i < len; i++) {
  buffer[i] = Math.ceil(Math.random() * 255)
}
`

const buffer_size = 32
const buf = ptr(new Uint8Array(buffer_size))
const context = new Uint8Array(isolate_context_size())
const argc = 0
const argv = 0
const fd = 0
const cleanup = 1
const on_exit = 1
const snapshot = 0

isolate_context_create(argc, argv, runtime, utf8Length(runtime), worker, 
  utf8Length(worker), buf.ptr, buf.length, fd, hrtime(), 'lo', 'test.js', 
  cleanup, on_exit, snapshot, context)

const start_isolate_address = dlsym(RTLD_MAIN_ONLY, 'lo_start_isolate')
const tbuf = new Uint32Array(2)
const rcbuf = new Uint32Array(2)

function waitfor () {
  assert(pthread.create(tbuf, 0, start_isolate_address, context) === 0)
  pthread.join(addr(tbuf), rcbuf)
  assert(buf[0] === 255)
}

const bench = new Bench()
let iter = 20
const runs = 1000
for (let i = 0; i < iter; i++) {
  bench.start('isolate_start')
  for (let j = 0; j < runs; j++) {
    waitfor()
  }
//  console.log(dump(buf))
  bench.end(runs)
}

isolate_context_destroy(context)

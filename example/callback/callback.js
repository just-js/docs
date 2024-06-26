import { Assembler, Compiler, Registers } from 'lib/asm/asm.js'
import { bind } from 'lib/ffi.js'
import { exec, mem } from 'lib/proc.js'
import { isFile } from 'lib/fs.js'

const { ptr, core, colors, hrtime, nextTick, assert, registerCallback } = lo
const { AD, AG, AY, AC } = colors
const { dlopen, dlsym } = core

function js_callback (counter) {
  counter += 1
  if (counter === runs) {
    stop()
    const elapsed = hrtime() - then
    const rate = Math.floor(runs / (elapsed / 1e9))
    const ns_iter = Math.floor(elapsed / runs)
    console.log(`${runs} ${AG}in${AD} ${elapsed} ${AG}ns${AD} = ${rate} ${AY}per/sec${AD} ${ns_iter} ${AY}ns/iter${AD} ${mem()} ${AC}rss${AD}`)
    then = hrtime()
    if (--total) {
      nextTick(start)
      counter = 0
    }
  }
  return counter
}

function callback () {
  u32[4] = js_callback(u32[6])
}

if (!isFile('./callback.so')) {
  const compiler = core.os === 'linux' ? 'gcc' : 'clang'
  assert(exec(compiler, ['-fPIC', '-O3', '-s', '-shared', '-o', 'callback.so', 'callback.c'])[0] === 0)
}

const handle = assert(dlopen('./callback.so', 1))
const register_callback = bind(assert(dlsym(handle, 'register_callback')), 'void', ['pointer'])
const stop = bind(assert(dlsym(handle, 'stop_callbacks')), 'void', [])
const start = bind(assert(dlsym(handle, 'start_callbacks')), 'void', [], true)

const asm = new Assembler()
const nArgs = 1
const ctx = ptr(new Uint8Array(((nArgs + 3) * 8)))
const u32 = new Uint32Array(ctx.buffer)

const callback_address = assert(dlsym(0, 'lo_callback'))
registerCallback(ctx.ptr, callback)

const runs = 30000000
let total = 5

const { rax, rdi, r15 } = Registers

asm.reset()
asm.movabs(ctx.ptr, rax)
asm.movdest(rdi, rax, 24)
asm.movreg(rax, rdi)
asm.movreg(rax, r15)
asm.call(callback_address)
asm.movsrc(r15, rax, 16)
asm.ret()

const compiler = new Compiler()
const wrapper = compiler.compile(asm.bytes())
let then = hrtime()
register_callback(wrapper)
start()


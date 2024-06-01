import { spawn, join, try_join, pthread } from 'lib/thread.js'
import { Assembler, Compiler, Registers } from 'lib/asm/asm.js'
import { dump } from 'lib/binary.js'

const { assert, core, ptr, wrap_memory, unwrap_memory, cstr } = lo
const { dlsym, dlopen } = core

const handle = assert(dlopen('./read_file.so', 1))
const sym = assert(dlsym(handle, 'read_file'))

const asm = new Assembler()

const { rdi, rsi, rdx, rbx } = Registers

asm.reset()
asm.push(rbx)
asm.movreg(rdi, rbx)
asm.movsrc(rbx, rdi, 0)
asm.movsrc(rbx, rsi, 8)
asm.movsrc(rbx, rdx, 16)
asm.call(sym)
asm.pop(rbx)
asm.ret()

const compiler = new Compiler()
const thread_func = compiler.compile(asm.bytes())
const ctx = new Uint8Array(24)
const dv = new DataView(ctx.buffer)
const path = cstr('/dev/shm/bzImage')
dv.setBigUint64(0, BigInt(path.ptr), true)
const stat = ptr(new Uint8Array(144))
dv.setBigUint64(8, BigInt(stat.ptr), true)
const addr = ptr(new Uint32Array(2))
dv.setBigUint64(16, BigInt(addr.ptr), true)
const tid = spawn(thread_func, ctx)
const res = join(tid)
const [ status, ret ] = res
//console.log(`thread exited with status ${status} and wrapped function returned ${ret}`)
const size = ret

const buf = new Uint8Array(wrap_memory(lo.addr(addr), size, 1))
console.log(dump(buf.subarray(0, 1024)))
unwrap_memory(buf.buffer)

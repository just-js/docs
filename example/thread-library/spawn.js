import { spawn, join, try_join, pthread } from 'lib/thread.js'
import { exec } from 'lib/proc.js'

const { assert, core } = lo
const { dlopen, dlsym, sleep } = core
const { EBUSY } = pthread

// compile our c library
const [ret, pid] = exec('gcc', ['-shared', '-o', 'lib.so', 'lib.c'])
assert(ret === 0 && pid > 0)
// open the library
const handle = assert(dlopen('./lib.so', 1))
// look up the thread function
const sym = assert(dlsym(handle, 'thread_func'))
// create the thread context we will pass into the thread
const ctx = new Uint8Array(64)
// spawn the thread, passing in the context
let tid = spawn(sym, ctx)
// blocking wait for the thread to complete
let res = join(tid)
// return of join and thread status should be 0
assert(res[0] === 0 && res[1] === 0)
// verify the bytes were changed
assert(ctx[0] === 255)
assert(ctx[63] === 1)

// clear the context buffer
ctx.fill(0)
assert(ctx[0] === 0)
assert(ctx[63] === 0)
console.log(`${tid} completed successfully`)
tid = spawn(sym, ctx)
// poll the thread every second until it is complete
res = try_join(tid)
while (res[0] === EBUSY) {
  console.log(`${tid} still running`)
  sleep(1)
  res = try_join(tid)
}
// return of join and thread status should be 0
assert(res[0] === 0 && res[1] === 0)
// verify the bytes were changed
assert(ctx[0] === 255)
assert(ctx[63] === 1)
console.log(`${tid} completed successfully`)

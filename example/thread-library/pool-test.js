import { Worker } from 'lib/worker.js'
import { system } from 'lib/system.js'
import { Loop } from 'lib/loop.js'
import { Timer } from 'lib/timer.js'

const { core, assert } = lo
const { read_file, write } = core

const EFD_NONBLOCK = 2048
const decoder = new TextDecoder()
const src = decoder.decode(read_file('pool.js'))
const fd = system.eventfd(0, EFD_NONBLOCK)
const worker = new Worker(src)

worker.create(fd).start()

const loop = new Loop()

const sigbuf = new BigInt64Array([0xfffffffffffffffen])

const timer = new Timer(loop, 1000, () => {
  assert(write(fd, sigbuf, 8) === 8)
})

while (loop.poll() > 0) {

}

console.log('done')

let then = lo.hrtime()

import { bind } from 'lib/ffi.js'
import { system } from 'lib/system.js'
import { mem } from 'lib/proc.js'

const { assert, core, hrtime, start, wrap, wrapMemory } = lo
const { dlsym, dlopen } = core
const { sleep } = system

console.log(`imports ${hrtime() - then} mem ${mem()}`)

const calloc = wrap(new Uint32Array(2), core.calloc, 2)

const ICANON = 2
const ECHO = 8
const flags = ~(ICANON | ECHO)
const termios_t = new Int8Array(256)
//const vm_t = new Uint8Array(4096)

const vm_t = wrapMemory(calloc(1, 1024), 1024, 0)
const kernelPath = '/dev/shm/bzImage'
const initrdPath = '/dev/shm/initrd.cpio'
const sharedLibPath = '/dev/shm/kvm.so'

function set_tty () {
  if (!isatty(0)) return
  assert(tcgetattr(0, termios_t) === 0)
  const tmp = termios_t.slice(0, 256)
  const dv = new DataView(tmp.buffer)
  dv.setInt32(12, dv.getInt32(12, true) & flags)
  assert(tcsetattr(0, 0, tmp) === 0)
}

function reset_tty () {
  assert(tcsetattr(0, 0, termios_t) === 0)
}

//then = hrtime()
const isatty = bind(dlsym(0, 'isatty'), 'i32', ['i32'])
const tcgetattr = bind(dlsym(0, 'tcgetattr'), 'i32', ['i32', 'buffer'])
const tcsetattr = bind(dlsym(0, 'tcsetattr'), 'i32', ['i32', 'i32', 'buffer'])
console.log(`tty_bindings ${hrtime() - then} mem ${mem()}`)

//then = hrtime()
set_tty()
console.log(`set_tty ${hrtime() - then} mem ${mem()}`)

//then = hrtime()
const handle = dlopen(sharedLibPath, 1)
assert(handle)
console.log(`dlopen ${hrtime() - then} mem ${mem()}`)

//then = hrtime()
const vm_init = bind(dlsym(handle, 'vm_init'), 'i32', ['buffer'])
assert(vm_init.state.ptr)
const vm_load_image = bind(dlsym(handle, 'vm_load_image'), 'i32', [
  'buffer', 'string'
])
assert(vm_load_image.state.ptr)
const vm_load_diskimg = bind(dlsym(handle, 'vm_load_diskimg'), 'i32', [
  'buffer', 'string'
])
assert(vm_load_diskimg.state.ptr)
const vm_load_initrd = bind(dlsym(handle, 'vm_load_initrd'), 'i32', [
  'buffer', 'string'
])
assert(vm_load_initrd.state.ptr)
const vm_run = bind(dlsym(handle, 'vm_run'), 'i32', ['buffer'])
assert(vm_run.state.ptr)
const vm_exit = bind(dlsym(handle, 'vm_exit'), 'void', ['buffer'])
assert(vm_exit.state.ptr)
console.log(`vm_bindings ${hrtime() - then} mem ${mem()}`)

//then = hrtime()
assert(vm_init(vm_t) === 0)
console.log(`vm_init ${hrtime() - then} mem ${mem()}`)

//then = hrtime()
assert(vm_load_image(vm_t, kernelPath) === 0)
console.log(`vm_load_image ${hrtime() - then} mem ${mem()}`)

//then = hrtime()
assert(vm_load_initrd(vm_t, initrdPath) === 0)

//assert(vm_load_diskimg(vm_t, '../../github/kvm-host/build/rootfs.busy') === 0)
console.log(`vm_load_initrd ${hrtime() - then} mem ${mem()}`)

//for (let i = 0; i < 10; i++) {
//  then = hrtime()
  assert(vm_run(vm_t) === 0)
  console.log(`vm_run ${hrtime() - then} mem ${mem()}`)
  vm_exit(vm_t)
//  sleep(1)
//}

reset_tty()

console.log(`end ${hrtime() - start} mem ${mem()}`)





/*
is ~ 100ms to get to vm_run
113 ms for everything, 13ms for just the bindings

then takes ~3ms to load 2.5 MB initrd
*/

/*
50ms to do vm_init
1.3ms to load kernel image
2.5ms to load initrd


start 6108947
imports 2617 mem 15360
tty_bindings 1353567 mem 15744
set_tty 62733 mem 15744
dlopen 135418 mem 15744
vm_bindings 1229573 mem 16128
vm_init 36902855 mem 16128
vm_load_image 1245275 mem 17408
vm_load_initrd 2096235 mem 19840
end 49765170 mem 19840


*/

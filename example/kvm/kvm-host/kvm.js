import { bind } from 'lib/ffi.js'

const { assert, core, wrap, wrapMemory } = lo
const { dlsym, dlopen } = core

const calloc = wrap(new Uint32Array(2), core.calloc, 2)

const vm_t = wrapMemory(calloc(1, 1024), 1024, 0)
const kernelPath = '/dev/shm/bzImage'
const initrdPath = '/dev/shm/initrd.cpio'
const sharedLibPath = '/dev/shm/kvm.so'

const handle = assert(dlopen(sharedLibPath, 1))
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
assert(vm_init(vm_t) === 0)
assert(vm_load_image(vm_t, kernelPath) === 0)
assert(vm_load_initrd(vm_t, initrdPath) === 0)
//assert(vm_load_diskimg(vm_t, '../../github/kvm-host/build/rootfs.busy') === 0)
assert(vm_run(vm_t) === 0)
vm_exit(vm_t)

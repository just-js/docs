import { bind } from 'lib/ffi.js'

const { assert, core } = lo
const { dlsym } = core

const mknod_sym = dlsym(0, 'mknod')
assert(mknod_sym)
const mknod = bind(mknod_sym, 'i32', ['string', 'i32', 'i32'])
assert(mknod.state.ptr)
const makedev_sym = dlsym(0, 'gnu_dev_makedev')
assert(makedev_sym)
const makedev = bind(makedev_sym, 'u32', ['u32', 'u32'])
assert(makedev.state.ptr)


const S_IFCHR = 8192

const S_IRUSR = 256
const S_IWUSR = 128
const S_IRGRP = 32
const S_IWGRP = 16
const S_IROTH = 4
const S_IWOTH = 2

const full = S_IRUSR | S_IWUSR | S_IRGRP | S_IWGRP | S_IROTH | S_IWOTH
const user = S_IRUSR | S_IWUSR | S_IRGRP | S_IROTH
const grwrite = S_IRUSR | S_IWUSR | S_IWGRP

const target_path = './initrd'

const dev_mem = makedev(1, 1)
assert(dev_mem)
assert(mknod(`${target_path}/dev/mem`, S_IFCHR | user, dev_mem) === 0)
const dev_tty = makedev(5, 0)
assert(dev_tty)
assert(mknod(`${target_path}/dev/tty`, S_IFCHR | user, dev_tty) === 0)
const dev_console = makedev(5, 1)
assert(dev_console)
assert(mknod(`${target_path}/dev/console`, S_IFCHR | user, dev_console) === 0)
const dev_null = makedev(1, 3)
assert(dev_null)
assert(mknod(`${target_path}/dev/null`, S_IFCHR | full, dev_null) === 0)
const dev_zero = makedev(1, 5)
assert(dev_zero)
assert(mknod(`${target_path}/dev/zero`, S_IFCHR | full, dev_zero) === 0)
const dev_urandom = makedev(1, 9)
assert(dev_urandom)
assert(mknod(`${target_path}/dev/urandom`, S_IFCHR | full, dev_urandom) === 0)
const dev_tty0 = makedev(4, 0)
assert(dev_tty0)
assert(mknod(`${target_path}/dev/tty0`, S_IFCHR | grwrite, dev_tty0) === 0)
const dev_tty1 = makedev(4, 1)
assert(dev_tty1)
assert(mknod(`${target_path}/dev/tty1`, S_IFCHR | grwrite, dev_tty1) === 0)
const dev_tty2 = makedev(4, 2)
assert(dev_tty2)
assert(mknod(`${target_path}/dev/tty2`, S_IFCHR | grwrite, dev_tty2) === 0)
const dev_tty3 = makedev(4, 3)
assert(dev_tty3)
assert(mknod(`${target_path}/dev/tty3`, S_IFCHR | grwrite, dev_tty3) === 0)
const dev_tty4 = makedev(4, 4)
assert(dev_tty4)
assert(mknod(`${target_path}/dev/tty4`, S_IFCHR | grwrite, dev_tty4) === 0)


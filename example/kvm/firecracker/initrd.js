import { dir_flags, rmDirAll } from 'lib/fs.js'

const { assert, core } = lo
const { mkdir } = core

const target_path = './initrd'

rmDirAll(target_path)
assert(mkdir(target_path, dir_flags) === 0)
assert(mkdir(`${target_path}/dev`, dir_flags) === 0)

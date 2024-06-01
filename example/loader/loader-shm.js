import { isFile } from 'lib/fs.js'
import { fetch_fd } from 'lib/curl.js'
import { ResponseParser } from 'lib/pico.js'
import { system } from 'lib/system.js'

const { core, assert } = lo
const { ftruncate, fstat, read, lseek, shm_open, O_CREAT, O_EXCL, O_RDWR, S_IWUSR, S_IRUSR, close } = core

const decoder = new TextDecoder()
const stat = new Uint8Array(160)
const st = new BigUint64Array(stat.buffer)

core.loader = (specifier, resource) => {
  console.log(specifier)
  if (isFile(specifier)) return
  return new Promise (resolve => {
    const url = `https://raw.githubusercontent.com/just-js/lo/${lo.version.lo}/${specifier}`
    console.log(`fetching ${url} for ${specifier} from ${resource}`)
    try {
      const fd = shm_open('/foo', O_CREAT | O_EXCL | O_RDWR, S_IWUSR | S_IRUSR)
      assert(fd > 2)
      ftruncate(fd, 0)
      const { size, status } = fetch_fd(url, fd)
      assert(status === 200)
      assert(fstat(fd, stat) === 0)
      const file_size = Number(st[6])
      const buf = new Uint8Array(file_size)
      const parser = new ResponseParser(buf, 64)
      assert(lseek(fd, 0) === 0)
      const to_read = buf.length
      assert(read(fd, buf, to_read) === to_read)
      assert(parser.parse(buf.ptr, file_size - size) === file_size - size)
      resolve(decoder.decode(buf.subarray(file_size - size)))
      close(fd)
    } catch (err) {
      console.log(err.stack)
      console.log(lo.errno)
      console.log(system.strerror())
    }
  })
}

import(lo.args[2]).then(mod => {
  console.log(Object.getOwnPropertyNames(mod))
})

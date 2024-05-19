import { isFile } from 'lib/fs.js'
import { fetch_fd } from 'lib/curl.js'
import { ResponseParser } from 'lib/pico.js'

const { core, assert } = lo
const { memfd_create, ftruncate, fstat, read, lseek } = core

const decoder = new TextDecoder()
const stat = new Uint8Array(160)
const st = new BigUint64Array(stat.buffer)

core.loader = (specifier, resource) => {
  console.log(specifier)
  if (isFile(specifier)) return
  return new Promise (resolve => {
    const url = `https://raw.githubusercontent.com/just-js/lo/${lo.version.lo}/${specifier}`
    console.log(`fetching ${url} for ${specifier} from ${resource}`)
    const fd = memfd_create('/tmp/foo.txt', 0)
    assert(fd > 2)
    ftruncate(fd, 0)
    const { size, status } = fetch_fd(url, fd)
    assert(status === 200)
    assert(fstat(fd, stat) === 0)
    const file_size = Number(st[6])
    const buf = new Uint8Array(file_size)
    const parser = new ResponseParser(buf, 64)
    console.log(file_size)
    assert(lseek(fd, 0) === 0)
    assert(read(fd, buf, buf.length) === buf.length)
    assert(parser.parse(buf.ptr, file_size - size) === file_size - size)
    resolve(decoder.decode(buf.subarray(file_size - size)))
    close(fd)
  })
}

import(lo.args[2]).then(mod => {
  console.log(Object.getOwnPropertyNames(mod))
})

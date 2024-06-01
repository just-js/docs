import { isFile } from 'lib/fs.js'

const { core, assert } = lo
const { unlink, readFile, memfd_create, ftruncate, fstat, read, lseek } = core

const decoder = new TextDecoder()

const fd = memfd_create('/tmp/foo.txt', 0)
assert(fd > 2)
const stat = new Uint8Array(160)
const st = new BigUint64Array(stat.buffer)

Promise.all([import('lib/curl.js'), import('lib/pico.js')])
  .then(([ curl, pico ]) => {
    const { fetch_fd } = curl
    core.loader = specifier => {
      if (isFile(specifier)) return
      return new Promise (resolve => {
        const url = `https://raw.githubusercontent.com/just-js/lo/${lo.version.lo}/${specifier}`
        console.log(`fetching ${url}`)
        ftruncate(fd, 0)
        const { size, status } = fetch_fd(url, fd)
        //console.log(size)
        //console.log(status)
        assert(fstat(fd, stat) === 0)
        const file_size = Number(st[6])
        //console.log(file_size)
        const buf = new Uint8Array(file_size)
        const parser = new pico.ResponseParser(buf, 32)
        assert(lseek(fd, 0) === 0)
        assert(read(fd, buf, buf.length) === buf.length)
//        console.log(dump(buf))
        const headers_len = parser.parse(buf.ptr, file_size - size)
        if (headers_len > 0) {
          const { status, message, headers } = parser
          //console.log(JSON.stringify({ status, message, headers }, null, '  '))
        }
        const src = decoder.decode(buf.subarray(file_size - size))
        resolve(src)
      })
    }
    return import(lo.args[2])
  })
//  .then(({ mem }) => {
//    console.log(mem())
//  })
  .catch(err => console.error(err.stack))


/*
with this i could just build a runtime from a url
*/

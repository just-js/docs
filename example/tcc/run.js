import { isFile } from 'lib/fs.js'

const { core, library } = lo
const { unlink, readFile } = core

const LO_HOME = lo.getenv('LO_HOME') || '.'

let fetch
const decoder = new TextDecoder()

import('lib/curl.js')
  .then(mod => {
    fetch = mod.fetch

    core.loader = specifier => {
      if (isFile(specifier)) return
      const home_path = `${LO_HOME}/${specifier}`
      if (isFile(home_path)) return decoder.decode(readFile(home_path))
      return new Promise (resolve => {
        const url = `https://raw.githubusercontent.com/just-js/lo/${lo.version.lo}/${specifier}`
        console.log(`fetching ${url}`)
        fetch(url, '/dev/shm/gen.js')
        const src = decoder.decode(readFile('/dev/shm/gen.js'))
        unlink('/dev/shm/gen.js')
        resolve(src)
      })
    }

    core.binding_loader = name => {
      const handle = core.dlopen(`${LO_HOME}/lib/${name}/${name}.so`, 1)
      if (!handle) return
      const sym = core.dlsym(handle, `_register_${name}`)
      if (!sym) return
      const lib = library(sym)
      if (!lib) return
      lib.fileName = `lib/${name}/${name}.so`
      lo.libCache.set(name, lib)
      return lib
    }

    return import(lo.args[2] || './callback.js')
  })
  .catch(err => console.error(err.stack))

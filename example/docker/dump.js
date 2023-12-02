const { core, library, colors, getenv, libraries } = lo
const { AC, AY, AM, AG, AD } = colors
const { dlopen, dlsym } = core

// if we are running in docker container, this should be set to /root/.lo/
const LO_HOME = getenv('LO_HOME') || '.'

/*
there is functionality missing in how we resolve bindings. currently we will
only look in memory, where the library has been statically linked, or we will 
look in lib/<binding_name>/<binging_name>.so to find the binding shared library.
to get around this for now, we will use this method to override the loader and 
prefix any search for bindings with the LO_HOME directory where the bindings
have been compiled
*/

core.binding_loader = name => {
  // try to open the shared library in the home directory
  const handle = dlopen(`${LO_HOME}/lib/${name}/${name}.so`, 1)
  // if this fails, we return null so the built in loader will try to load
  // from ./lib/${name}/${name}.so and fail if the shared library does not exist
  if (!handle) return
  // look up the initialization function
  const sym = dlsym(handle, `_register_${name}`)
  if (!sym) return
  // load the binding from the pointer to the function
  const lib = library(sym)
  if (!lib) return
  // set the filename on the lib (used as cache key)
  lib.fileName = `lib/${name}/${name}.so`
  // put the binding in the cache for future loads
  lo.libCache.set(name, lib)
  return lib
}


// these are all the bindings currently defined for lo
const names = [
  'core', 'curl', 'encode', 'epoll', 'inflate', 'libffi', 'libssl', 'lz4',
  'mbedtls', 'net', 'pico', 'pthread', 'seccomp', 'sqlite', 'system', 'tcc',
  'wireguard', 'zlib', 'duckdb'
]

// iterate through the bindings and pretty print their definitions
for (const name of names) {
  const lib = lo.load(name)
  const binding = lib[name]
  const entries = Object.entries(binding)
  entries.sort((a, b) => a < b ? -1 : (a === b ? 0 : 1))
  console.log(`${AM}${name}${AD} (${AY}${libraries().includes(name) ? 'internal' : 'external'}${AD})`)
  const { api } = await import(`lib/${name}/api.js`)
  for (const [key, value] of entries) {
    if (value.constructor.name === 'Function') {
      const { result, parameters = [] } = api[key]
      console.log(`  ${AC}${key}${AD}: ${value.constructor.name} (${AG}${parameters.join(AD + ', ' + AG)}${AD}) -> ${AM}${result}${AD}`)
    } else if (['AsyncFunction', 'Object'].includes(value.constructor.name)) {
      console.log(`  ${AC}${key}${AD}: ${value.constructor.name}`)
    } else {
      console.log(`  ${AY}${key}${AD}: ${value.constructor.name} = ${value}`)
    }
  }
}

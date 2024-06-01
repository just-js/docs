const { core, library } = lo
const LO_HOME = lo.getenv('LO_HOME') || '.'

const { AY, AG, AD } = lo.colors

let fetch
const decoder = new TextDecoder()

function debug (message) {
  const now = lo.hrtime()
  console.log(`${AY}${message.padEnd(60, ' ')}${AD}${(now - last).toString().padStart(10, ' ')} ${(now - lo.start).toString().padStart(10, ' ')}`)
  last = now
}

// should we have after_load hooks?
core.loader = (specifier, resource) => {
  debug(`load module ${specifier} from ${resource}`)
}

core.binding_loader = name => {
  debug(`load binding ${name}`)
}

let last = lo.hrtime()

for (const builtin of lo.builtins()) {
  if (builtin.match(/lib\/\w+\.js/)) await import(builtin)
}

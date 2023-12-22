const { core } = lo.library('core')

const { RUSAGE_SELF, getpid, STDOUT } = core

const isatty = core.isatty(STDOUT)

const AD = isatty ? '\u001b[0m' : '' // ANSI Default
const AY = isatty ? '\u001b[33m' : '' // ANSI Yellow
const AM = isatty ? '\u001b[35m' : '' // ANSI Magenta
const AG = isatty ? '\u001b[32m' : '' // ANSI Green

function wrap_hrtime () {
  const h = new Uint32Array(2)

  return () => {
    lo.hrtime(h)
    return h[0] + ((2 ** 32) * h[1])  
  }
}

const hrtime = wrap_hrtime()

function wrap_rusage () {
  const rusage = new Uint8Array(148)
  const stats = (new Uint32Array(rusage.buffer)).subarray(8)

  return (flags = RUSAGE_SELF) => {
    core.getrusage(flags, rusage)
    return stats
  }
}

const rusage = wrap_rusage()

const boot = hrtime() - lo.start

while (1) {
  lo.print(`${AG}boot${AD} ${boot} ${AM}pid${AD} ${getpid()} ${AY}rss${AD} ${rusage()[0]}\n`)
  core.sleep(1)
}

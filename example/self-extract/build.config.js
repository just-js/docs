
const bindings = ['core', 'curl', 'inflate']
const libs = ['lib/proc.js', 'lib/curl.js', 'lib/fs.js', 'lib/build.js']
const embeds = []

const target = 'build'
const opt = '-O3 -march=native -mtune=native'

const v8_opts = {
  v8_cleanup: 0, v8_threads: 2, on_exit: 0,
  v8flags: '--stack-trace-limit=10 --use-strict --turbo-fast-api-calls --no-freeze-flags-after-init --cppgc-young-generation'
}

let link_type = '-rdynamic -static-libstdc++'
if (lo.core.os === 'linux') {
  link_type += ' -static-libgcc'
} else if (lo.core.os === 'mac') {
  bindings.push('mach')
}

const index = 'build.js'
export default { bindings, libs, embeds, target, opt, v8_opts, link_type, index }

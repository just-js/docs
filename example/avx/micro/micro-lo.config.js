
const bindings = ['core', 'memcount']
const libs = []
const embeds = []

const target = 'micro-lo'
const opt = '-O3 -march=native -mtune=native -mavx2 -msse4.2'

const v8_opts = {
  v8_cleanup: 0, v8_threads: 2, on_exit: 0,
  v8flags: '--stack-trace-limit=10 --use-strict --turbo-fast-api-calls --no-freeze-flags-after-init --max-heap-size 1024'
}

let link_type = '-rdynamic -static-libstdc++ -static-libgcc'

const index = 'micro-lo.js'
export default { bindings, libs, embeds, target, opt, v8_opts, link_type, index }

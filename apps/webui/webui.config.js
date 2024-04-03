const bindings = [
  'core', 
  'epoll',
  'webui',
  'system'
]

const libs = [
  'lib/asm.js', 
  'lib/loop.js', 
  'lib/proc.js', 
  'lib/timer.js', 
]

const embeds = []

const target = 'webui' 
const link_type = '-rdynamic -static-libstdc++ -static-libgcc'
const opt = '-O3 -march=native -mtune=native'
const v8_opts = {
  v8_cleanup: 0, v8_threads: 2, on_exit: 0,
  v8flags: '--no-expose-wasm --memory-reducer --optimize-for-size --lite-mode --jitless --stack-trace-limit=10 --use-strict --turbo-fast-api-calls --no-freeze-flags-after-init --cppgc-young-generation'
}
const index = 'webui.js'

export default { bindings, libs, embeds, target, link_type, opt, v8_opts, index }

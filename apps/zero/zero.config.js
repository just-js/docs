const bindings = []
const libs = []
const embeds = []
const target = 'zero' 
const link_type = '-static'
const opt = '-O3 -march=native -mtune=native'
const v8_opts = {
  v8_cleanup: 0, v8_threads: 1, on_exit: 0,
  v8flags: '--lite-mode --jitless --single-threaded --disable-write-barriers --max-heap-size=16 --no-verify-heap --no-expose-wasm --memory-reducer --optimize-for-size --stack-trace-limit=10 --use-strict --turbo-fast-api-calls'
}
const main = 'zero.js'

/*
  '--stack-trace-limit=10',
  '--use-strict',
  '--disallow-code-generation-from-strings',
  '--single-threaded',
  '--single-threaded-gc',
  '--no-concurrent-inlining',
  '--no-concurrent-recompilation',
  '--no-turbo-jt',
  '--jitless',
  '--lite-mode',
  '--optimize-for-size',
  '--no-expose-wasm',
  '--memory-reducer',
  '--memory-reducer-for-small-heaps',
  '--use-idle-notification',
  '--max-heap-size=48',
  '--initial-heap-size=48'

*/

export default { bindings, libs, embeds, target, link_type, opt, v8_opts, main }

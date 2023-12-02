import { exec } from 'lib/proc.js'

const { core, assert } = lo

const status = new Int32Array(2)
const VERSIONS="v0.2.9 v0.3.0 v0.4.0 v0.5.0 v0.6.0 v0.7.0 v0.8.0 v0.9.0 v0.9.2".split(' ')

for (const VERSION of VERSIONS) {
  console.log(`setting up ${VERSION}`)
  exec('lo', ['setup.js', VERSION, '-d'], status)
  assert(status[0] === 0)
  core.setenv('LD_PRELOAD', './duckdb/libduckdb.so')
  console.log(`benchmarking ${VERSION}`)
  exec('nice', ['-n', '20', 'taskset', '--cpu-list', '0', 'lo', 'bench.js'], status)
  assert(status[0] === 0)
}

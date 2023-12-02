import { fetch } from 'lib/curl.js'
import { exec } from 'lib/proc.js'
import { isFile, isDir, rmDirAll } from 'lib/fs.js'

const { assert, colors, core } = lo
const {
  mkdir, S_IRWXU, S_IRWXG, S_IROTH, S_IXOTH, unlink
} = core
const { AY, AD } = colors

let args = lo.args.slice(2)
if (args.includes('-d')) {
  args = args.filter(a => a !== '-d')
  rmDirAll('duckdb')
}

const status = new Int32Array(2)
const duckdb_version = args[0] || 'v0.9.2'
const duckdb_archive_name = 'libduckdb-linux-amd64.zip'
const duckdb_url = `https://github.com/duckdb/duckdb/releases/download/${duckdb_version}/${duckdb_archive_name}`
const duckdb_dir = './duckdb'

if (!isDir(duckdb_dir)) {
  if (!isFile(duckdb_archive_name)) {
    console.log(`${AY}fetch${AD} ${duckdb_url} ${AY}to${AD} ${duckdb_archive_name}`)
    try {
      fetch(duckdb_url, duckdb_archive_name)
    } catch (err) {
      unlink(duckdb_archive_name)
      throw err
    }
  }
  assert(mkdir(duckdb_dir, S_IRWXU | S_IRWXG | S_IROTH | S_IXOTH) === 0)
  exec('unzip', ['-d', duckdb_dir, duckdb_archive_name], status)
  assert(status[0] === 0)
  assert(unlink(duckdb_archive_name) === 0)
} else if (isFile(duckdb_archive_name)) {
  assert(unlink(duckdb_archive_name) === 0)
}

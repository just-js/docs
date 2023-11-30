import { Bench } from 'lib/bench.js'
import { mem } from 'lib/proc.js'

const { duckdb } = lo.load('duckdb')

const { ptr, assert, addr, wrap, utf8Decode, core } = lo
const { strnlen, free } = core
const {
  struct_duckdb_config_size,
  struct_duckdb_result_size,
  struct_duckdb_prepared_statement_size,
  create_config,
  open_ext,
  set_config,
  connect,
  query,
  row_count,
  column_count,
  close,
  destroy_result,
  value_uint32,
  prepare,
  destroy_prepare,
  execute_prepared
} = duckdb

const handle = new Uint32Array(2)
const value_varchar = wrap(handle, duckdb.value_varchar, 3)
const config = ptr(new Uint8Array(struct_duckdb_config_size))
assert(create_config(config.ptr) === 0)
assert(set_config(config.ptr, 'threads', '1') === 0)
assert(set_config(config.ptr, 'access_mode', 'READ_WRITE') === 0)
assert(set_config(config.ptr, 'max_memory', '1GB') === 0)
assert(set_config(config.ptr, 'default_order', 'DESC') === 0)
const db_ptr = new Uint32Array(2)
open_ext(':memory:', db_ptr, 0, 0)
const db = assert(addr(db_ptr))
const conn_ptr = new Uint32Array(2)
connect(db, conn_ptr)
const conn = assert(addr(conn_ptr))
const res = ptr(new Uint8Array(struct_duckdb_result_size))
assert(query(conn, 'CREATE TABLE integers(i INTEGER, j INTEGER);', res.ptr) === 0)
assert(query(conn, 'INSERT INTO integers VALUES (3, 4), (5, 6), (7, NULL);', res.ptr) === 0)

function run_query () {
  assert(query(conn, 'SELECT * FROM integers;', res.ptr) === 0)
  const rows = row_count(res.ptr)
  const cols = column_count(res.ptr)
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const v = value_uint32(res.ptr, col, row)
    }
  }
}

function run_prepared () {
  assert(execute_prepared(stmt, res.ptr) === 0)
  const rows = row_count(res.ptr)
  const cols = column_count(res.ptr)
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const v = value_uint32(res.ptr, col, row)
    }
  }
  destroy_result(res.ptr)
}

const stmt_ptr = new Uint32Array(2)
assert(prepare(conn, 'SELECT * FROM integers;', stmt_ptr) === 0)
const stmt = addr(stmt_ptr)
assert(execute_prepared(stmt, res.ptr) === 0)

run_query()
run_prepared()

const iter = 5
const runs = 100000

const bench = new Bench(true, mem)

while (1) {
  for (let i = 0; i < iter; i++) {
    bench.start('run_query')
    for (let j = 0; j < runs; j++) {
      run_prepared()
    }
    bench.end(runs)
  }
}

//close(db)

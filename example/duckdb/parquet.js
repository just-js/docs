import { Bench } from 'lib/bench.js'

const { duckdb } = lo.load('duckdb')

const {
  open_ext, connect, query, row_count, close, destroy_result, value_uint32, 
  prepare, execute_prepared, disconnect, value_is_null, DuckDBSuccess, 
  struct_duckdb_result_size, DuckDBError, column_count, column_type, 
  value_int32
} = duckdb

const { assert, addr, ptr, utf8Decode, core, wrap } = lo
const { strnlen } = core

function to_string (ptr) {
  return utf8Decode(ptr, strnlen(ptr, 1024))
}

const handle = new Uint32Array(2)
const result_error = wrap(handle, duckdb.result_error, 1)
const column_name = wrap(handle, duckdb.column_name, 2)
const value_timestamp = wrap(handle, duckdb.value_timestamp, 3)

const db_ptr = new Uint32Array(2)
const conn_ptr = new Uint32Array(2)
const stmt_ptr = new Uint32Array(2)

function get_uint32 (res_ptr, c, r) {
  return value_is_null(res_ptr, c, r) ? null : value_uint32(res_ptr, c, r)
}

function get_int32 (res_ptr, c, r) {
  return value_is_null(res_ptr, c, r) ? null : value_int32(res_ptr, c, r)
}

function get_timestamp (res_ptr, c, r) {
  if (value_is_null(res_ptr, c, r)) return null
  return new Date(Math.floor(value_timestamp(res_ptr, c, r) / 1000))
}

open_ext(':memory:', db_ptr, 0, 0)
const db = assert(addr(db_ptr))
connect(db, conn_ptr)
const conn = assert(addr(conn_ptr))
const res = ptr(new Uint8Array(struct_duckdb_result_size))
const res_ptr = res.ptr

assert(query(conn, 'INSTALL parquet;', res_ptr) === DuckDBSuccess), () => to_string(assert(result_error(res_ptr)))
assert(query(conn, 'LOAD parquet;', res_ptr) === DuckDBSuccess), () => to_string(assert(result_error(res_ptr)))

function prepare_stmt (sql) {
  assert(prepare(conn, sql, stmt_ptr) === DuckDBSuccess), 
    () => to_string(assert(result_error(res.ptr)))
  const stmt = assert(addr(stmt_ptr))
  assert(execute_prepared(stmt, res_ptr) === DuckDBSuccess)
  const ncols = column_count(res_ptr)
  const names = []
  const types = []
  for (let i = 0; i < ncols; i++) {
    names.push(to_string(assert(column_name(res.ptr, i))))
    types.push(column_type(res.ptr, i))
  }
  function all () {
    assert(execute_prepared(stmt, res_ptr) === DuckDBSuccess)
    const nrows = row_count(res_ptr)
    const rows = (new Array(nrows)).fill(0).map(v => ({}))
    let n = 0
    for (let r = 0; r < nrows; r++) {
      const row = rows[n++]
      row.creative_id = get_int32(res.ptr, 0, r)
      row.object_id = get_int32(res.ptr, 1, r)
      row.hits = get_int32(res.ptr, 2, r)
      row.hour_bucket = get_timestamp(res.ptr, 3, r)
    }
    destroy_result(res_ptr)
    return rows
  }
  return { all }
}

const stmt = prepare_stmt('SELECT creative_id, object_id, hits, hour_bucket FROM parquet_scan(\'test.parquet\') LIMIT 10;')
const bench = new Bench()
const runs = 10000
console.log(JSON.stringify(stmt.all()))
while (1) {
  bench.start('stmt.all()')
  for (let i = 0; i < runs; i++) {
    stmt.all()
  }
  bench.end(runs)
}

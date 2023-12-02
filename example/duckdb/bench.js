const { core, library } = lo
const LO_HOME = lo.getenv('LO_HOME') || '.'

/*
there is functionality missing in how we resolve bindings. currently we will
only look in memory, where the library has been statically linked, or we will 
look in lib/<binding_name>/<binging_name>.so to find the binding shared library.
to get around this for now, we will use this method to override the loader and 
prefix any search for bindings with the LO_HOME directory where the bindings
have been compiled
*/

core.binding_loader = name => {
  const handle = core.dlopen(`${LO_HOME}/lib/${name}/${name}.so`, 1)
  if (!handle) return
  const sym = core.dlsym(handle, `_register_${name}`)
  if (!sym) return
  const lib = library(sym)
  if (!lib) return
  lib.fileName = `lib/${name}/${name}.so`
  lo.libCache.set(name, lib)
  return lib
}

import { Bench } from 'lib/bench.js'

const { duckdb } = lo.load('duckdb')
const { ptr, assert, addr } = lo
const {
  open_ext, connect, query, row_count, close, destroy_result, value_uint32, 
  prepare, execute_prepared, disconnect, value_is_null, DuckDBSuccess, 
  struct_duckdb_result_size
} = duckdb

function get_uint32 (res_ptr, c, r) {
  return value_is_null(res_ptr, c, r) ? null : value_uint32(res_ptr, c, r)
}

function run_prepared (stmt, res_ptr) {
  assert(execute_prepared(stmt, res_ptr) === DuckDBSuccess)
  const rows = row_count(res_ptr)
  const res = (new Array(rows))
  for (let r = 0; r < rows; r++) {
    res[r] = { i: get_uint32(res_ptr, 0, r), j: get_uint32(res_ptr, 1, r) }
  }
  destroy_result(res_ptr)
  return res
}

const db_ptr = new Uint32Array(2)
const conn_ptr = new Uint32Array(2)
const stmt_ptr = new Uint32Array(2)

open_ext(':memory:', db_ptr, 0, 0)
const db = assert(addr(db_ptr))
connect(db, conn_ptr)
const conn = assert(addr(conn_ptr))
const res = ptr(new Uint8Array(struct_duckdb_result_size))
assert(query(conn, 'CREATE TABLE integers(i INTEGER, j INTEGER);', 
  res.ptr) === DuckDBSuccess)
assert(query(conn, 'INSERT INTO integers VALUES (3, 4), (5, 6), (7, NULL);', 
  res.ptr) === DuckDBSuccess)
assert(prepare(conn, 'SELECT * FROM integers;', stmt_ptr) === DuckDBSuccess)
const stmt = assert(addr(stmt_ptr))
const rows = run_prepared(stmt, res.ptr)
assert(rows.length === 3 && rows[0].i === 3 && rows[0].j === 4 && 
  rows[1].i === 5 && rows[1].j === 6 && rows[2].i === 7 && rows[2].j === null)

const bench = new Bench()
const runs = 100000
let iter = 10
while (iter--) {
  bench.start('run_prepared')
  for (let j = 0; j < runs; j++) run_prepared(stmt, res.ptr)
  bench.end(runs)
}

destroy_result(res.ptr)
disconnect(conn_ptr)
close(db_ptr)

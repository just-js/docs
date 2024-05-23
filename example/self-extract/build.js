import { exec } from 'lib/proc.js'
import { is_file, file_size } from 'lib/fs.js'
import { init, build } from 'lib/build.js'
import { fetch } from 'lib/curl.js'

const { assert, args, getenv, core } = lo
const { read_file, write_file, unlink } = core

function cleanup (app_name) {
  unlink(`${app_name}.gz`)
  unlink(`_binary.S`)
  unlink(`_binary.o`)
  unlink(`wrapper.o`)
  unlink(`em_inflate.o`)
  unlink(`em_inflate.h`)
  unlink(`em_inflate.c`)
  unlink(`wrapper.c`)
}

function create_assembly_file (app_name) {
  return encoder.encode(`.global _binary_start
_binary_start:
  .incbin "${app_name}.gz"
.global _binary_end
_binary_end:
.section .note.GNU-stack,"",@progbits
`)
}

function create_c_wrapper (app_name) {
  return encoder.encode(`#include <stdio.h>
#include <sys/mman.h>
#include <unistd.h>

#include "em_inflate.h"

extern char _binary_start[];
extern char _binary_end[];

int main (int argc, char** argv) {
  unsigned int _binary_len = _binary_end - _binary_start;
  unsigned char* out = calloc(1, ${file_size(app_name)});
  size_t sz = em_inflate(_binary_start, _binary_len, out, ${file_size(app_name)});
  int fd = memfd_create("/memfd/1", MFD_CLOEXEC);
  if (fd <= 0) exit(1);
  int written = write(fd, out, sz);
  if (written < sz) exit(1);
  free(out);
  return fexecve(fd, argv, environ);
}
`)
}

function assemble (...args) {
  assert(exec(asm[0], [...asm.slice(1), ...args])[0] === 0)
}

function compile (...args) {
  assert(exec(cc[0], [...cc.slice(1), ...args])[0] === 0)
}

async function build_app (app_name) {
  if (!is_file(`${app_name}.config.js`)) await init([app_name])
  await build(['runtime', app_name])
}

function compress (app_name) {
  const lib = lo.load('zlib')
  if (!lib) {
    console.error('zlib binding not found, using system gzip program')
    assert(exec('gzip', ['-f', '-6', app_name])[0] === 0)
    return
  }
  const { zlib } = lib  
  const src = read_file('hello')
  const dest = new Uint8Array(src.length)
  write_file(`${app_name}.gz`, dest.subarray(0, zlib.deflate(src, src.length, dest, dest.length)))
}

function pack (app_name) {
  if (!is_file(`wrapper.c`)) write_file(`wrapper.c`, create_c_wrapper(app_name))
  if (!is_file(`_binary.S`)) write_file(`_binary.S`, create_assembly_file(app_name))
  compress(app_name)
  assemble('-c', '-o', '_binary.o', '_binary.S')
  compile('-I.', '-c', '-o', 'em_inflate.o', '-O3', 'em_inflate.c')
  compile('-D_GNU_SOURCE', '-c', '-o', 'wrapper.o', '-O3', 'wrapper.c')
  compile('-O3', '-s', '-o', app_name, '_binary.o', 'em_inflate.o', 'wrapper.o')
}

function setup () {
  if (!is_file('em_inflate.h')) fetch(`${dl_prefix}/em_inflate.h`, 'em_inflate.h')
  if (!is_file('em_inflate.c')) fetch(`${dl_prefix}/em_inflate.c`, 'em_inflate.c')
}

const encoder = new TextEncoder()
const dl_prefix = 'https://raw.githubusercontent.com/emmanuel-marty/em_inflate/master/lib'
const app_name = args[2] || 'hello'
const cc = (getenv('CC') || 'gcc').split(' ')
const asm = (getenv('AS') || 'gcc').split(' ')

setup()
await build_app(app_name)
pack(app_name)
cleanup(app_name)

import { exec } from 'lib/proc.js'
import { is_file, file_size } from 'lib/fs.js'
import { init, build } from 'lib/build.js'
import { fetch } from 'lib/curl.js'

const { assert, args, getenv, core } = lo
const { read_file, write_file, unlink } = core

/**
* remove the temporary files created during the build
* @param app_name { string } the name of the app (without extension)
*/
function cleanup (app_name) {
  unlink(`${app_name}.gz`)
  unlink(`_binary.S`)
  unlink(`_binary.o`)
  unlink(`wrapper.o`)
  unlink(`em_inflate.o`)
}

/**
* generate an assembly file which we can use to compile the compressed
* binary into an object file with a symbol we can look up at runtime
* @param app_name { string } the name of the app (without extension)
*/
function create_assembly_file (app_name) {
  return encoder.encode(`.global _binary_start
_binary_start:
  .incbin "${app_name}.gz"
.global _binary_end
_binary_end:
.section .note.GNU-stack,"",@progbits
`)
}

/**
* create the c program that will do the extraction, passing in the size of 
* the uncompressed binary it will be decompressing and running
* @param app_name { string } the name of the app (without extension)
*/
function create_c_wrapper (app_name) {
  return encoder.encode(`#include <stdio.h>
#include <sys/mman.h>
#include <unistd.h>

#include "em_inflate.h"

// these external symbols will be replaced with the start and end of the 
// compressed program when the application is linked
extern char _binary_start[];
extern char _binary_end[];

int main (int argc, char** argv) {
  unsigned int _binary_len = _binary_end - _binary_start;
  // allocate enough space for the uncompressed program
  unsigned char* out = calloc(1, ${file_size(app_name)});
  // inflate the program from the symbol we looked up in memory
  size_t sz = em_inflate(_binary_start, _binary_len, out, ${file_size(app_name)});
  // create a memfd we can write the uncompressed program into
  int fd = memfd_create("/memfd/1", MFD_CLOEXEC);
  if (fd <= 0) exit(1);
  // write the uncompressed program to the memfd
  int written = write(fd, out, sz);
  if (written < sz) exit(1);
  free(out);
  // execute the program from the memfd. see man memfd_create.2 and man fexecve.3
  return fexecve(fd, argv, environ);
}
`)
}

/**
* run the assembler with a set of commands. you can use 'as', 'gcc', 'clang'
* @param args { ...string } any arguments will be passed to the assembler
*/
function assemble (...args) {
  assert(exec(asm[0], [...asm.slice(1), ...args])[0] === 0)
}

/**
* run the c compiler with the arguments passed in
* @param args { ...string } any arguments will be passed to the assembler
*/
function compile (...args) {
  assert(exec(cc[0], [...cc.slice(1), ...args])[0] === 0)
}

/**
* build the lo.js application 
* @param app_name { string } the name of the app (without extension)
*/
async function build_app (app_name) {
  // if we don't have a config, then generate a default one
  if (!is_file(`${app_name}.config.js`)) await init([app_name])
  // build the app
  await build(['runtime', app_name, '-v'])
}

/**
* compress the application named app_name using gzip/deflate with default
* compression level
* if the lo.js zlib binding is not available, use system gzip program 
* @param app_name { string } the name of the app (without extension)
*/
function compress (app_name) {
  // try to load the lo.js zlib binding
  const lib = lo.load('zlib')
  if (!lib) {
    console.error('zlib binding not found, using system gzip program')
    assert(exec('gzip', ['-f', `-${Math.abs(compression_level)}`, 
      app_name])[0] === 0)
    return
  }
  const { zlib } = lib
  const src = read_file(app_name)
  const dest = new Uint8Array(src.length)
  write_file(`${app_name}.gz`, dest.subarray(0, zlib.deflate(src, src.length, 
    dest, dest.length, compression_level)))
}

/**
* compress the original program and build the wrapper to replace it 
* @param app_name { string } the name of the app (without extension)
*/
function pack (app_name) {
  // create the c source file for the wrapper program
  write_file(`wrapper.c`, create_c_wrapper(app_name))
  // create the assembly file to link in the compressed program
  write_file(`_binary.S`, create_assembly_file(app_name))
  // compress the program
  compress(app_name)
  // create the object file from the compressed program which can be linked into#
  // the wrapper
  assemble('-c', '-o', '_binary.o', '_binary.S')
  // compile the gzip inflate object file
  compile('-I.', '-c', '-o', 'em_inflate.o', '-O3', 'em_inflate.c')
  // compile the wrapper program object file
  compile('-D_GNU_SOURCE', '-c', '-o', 'wrapper.o', '-O3', 'wrapper.c')
  // link everything into the wrapper program, overwriting the original
  compile('-O3', '-o', app_name, '_binary.o', 'em_inflate.o', 'wrapper.o')
}

/**
* download the zlib inflate source we will link into the wrapper program
* @param prefix { string } ["https://raw.githubusercontent.com/emmanuel-marty/em_inflate/master/lib"] the url prefix to download from
*/
function setup (prefix = 
  'https://raw.githubusercontent.com/emmanuel-marty/em_inflate/master/lib') {
  if (!is_file('em_inflate.h')) fetch(`${prefix}/em_inflate.h`, 'em_inflate.h')
  if (!is_file('em_inflate.c')) fetch(`${prefix}/em_inflate.c`, 'em_inflate.c')
}

const encoder = new TextEncoder()
// pass in the program name. lo will expect a `${app_name}.js` to exist
const app_name = args[1] || 'hello'
// we can override the c compiler with a CC env var
const cc = (getenv('CC') || 'gcc').split(' ')
// we can override the assembler with an AS env var
const asm = (getenv('AS') || 'gcc').split(' ')
// we can override the compression level with 0...9 (worst...best). -1 = default
const compression_level = parseInt(getenv('GZ') || '-1', 10)

setup()
await build_app(app_name)
pack(app_name)
cleanup(app_name)

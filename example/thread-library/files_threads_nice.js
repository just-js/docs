import { spawn, join } from 'lib/thread.js'
import { Assembler, Compiler, Registers } from 'lib/asm/asm.js'
import * as tcc from 'lib/tcc.js'
import { dump } from 'lib/binary.js'

const { 
  assert, ptr, wrap_memory, utf8_encode_into_ptr
} = lo
const { rdi, rsi, rdx, rbx } = Registers

class FileReader {
  ctx = new Uint8Array(24)
  dv = new DataView(this.ctx.buffer)
  stat = ptr(new Uint8Array(144))
  addr = ptr(new Uint32Array(2))
  path = ptr(new Uint8Array(MAX_PATH))
  tid = 0
  status = 0
  size = 0

  constructor () {
    const { dv, stat, addr, path } = this
    dv.setBigUint64(0, BigInt(path.ptr), true)
    dv.setBigUint64(8, BigInt(stat.ptr), true)
    dv.setBigUint64(16, BigInt(addr.ptr), true)
  }

  read (file_name) {
    if (this.tid) throw new Error('thread running')
    const { ctx, path } = this
    utf8_encode_into_ptr(file_name, path.ptr)
    this.status = 0
    this.tid = spawn(thread_func, ctx)
    return this.tid
  }

  wait () {
    if (!this.tid) return 0
    const [ status, ret ] = join(this.tid)
    this.tid = 0
    this.status = status
    this.size = ret
    return ret
  }

  slice (len = this.size, off = 0) {
    if (len > this.size) len = this.size
    // todo: checks
    // this will return a uint8array and underlying memory will be freed
    // when the arraybuffer is collected
    return new Uint8Array(wrap_memory(
      lo.addr(this.addr) + off, len, FREE_ON_RELEASE))
  }
}

function bench (file_name, concurrent) {
  const readers = []

  for (let i = 0; i < concurrent; i++) {
    const reader = new FileReader()
    reader.read(file_name)
    readers.push(reader)
  }

  readers.forEach(reader => {
    const file_size = reader.wait()
    assert(file_size) === expected_size
    console.log(`read ${file_size} bytes for ${file_name}`)
    console.log(dump(reader.slice(256)))
  })
}

const MAX_PATH = 4096
const FREE_ON_RELEASE = 1

const c_compiler = new tcc.Compiler()
c_compiler.compile(`
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <stdlib.h>
#include <fcntl.h>
#include <stdint.h>

int read_file (const char* pathname, struct stat* st, char** ptr) {
  int fd = open(pathname, O_RDONLY);
  if (fd == -1) return -1;
  if(fstat(fd, st) != 0) return -1;
  char* buf = (char*)malloc(st->st_size);
  int bytes = read(fd, buf, st->st_size);
  close(fd);
  ptr[0] = buf;
  return bytes;
}
`)

const sym = assert(c_compiler.symbol('read_file'))
const asm = new Assembler()
/*
we could take any of the bindings defined functions and call them on a thread
this way
*/
asm.reset()
// save the rbx register as we are using it
asm.push(rbx)
// the thread is passed a pointer to a thread context
// the thread context holds three pointers to the arguments for read_file
// we set rbx to the address of the context
asm.movreg(rdi, rbx)
// the first context pointer is passed as first argument
asm.movsrc(rbx, rdi, 0)
// the second context pointer is passed as second argument
asm.movsrc(rbx, rsi, 8)
// the third context pointer is passed as third argument
asm.movsrc(rbx, rdx, 16)
// call the read_file function
asm.call(sym)
// restore the rbx register
asm.pop(rbx)
// rax will be set to the return value of read_file
asm.ret()

const compiler = new Compiler()
const thread_func = compiler.compile(asm.bytes())

const file_name = lo.args[2] || lo.args[1]
const concurrent = parseInt(lo.args[3] || '10', 10)
const reader = new FileReader()
reader.read(file_name)
const expected_size = reader.wait()

bench(file_name, concurrent)

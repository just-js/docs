import { getHeader, dumpHeader } from 'lib/elf.js'
import { stringify } from 'lib/stringify.js'
import { dump } from 'lib/binary.js'

const { assert, core, ptr } = lo
const { dlsym, strnlen } = core

const header = getHeader(lo.args[2])
const decoder = new TextDecoder()

dumpHeader(header)

let { bytes, shoff, shteSize, shEntries } = header

const rx = /_binary_(start|end)/
let symbols = new Map()

/*
elf section header

https://man7.org/linux/man-pages/man5/elf.5.html

typedef struct {
  uint32_t   sh_name;
  uint32_t   sh_type;
  uint64_t   sh_flags;
  Elf64_Addr sh_addr;
  Elf64_Off  sh_offset;
  uint64_t   sh_size;
  uint32_t   sh_link;
  uint32_t   sh_info;
  uint64_t   sh_addralign;
  uint64_t   sh_entsize;
} Elf64_Shdr;

id 176 type 1 start 16096688 offset 4304 size 16077670

*/
for (let i = 0; i < shEntries; i++) {
  const start = Number(shoff) + (i * shteSize)
  const dv = new DataView(bytes.buffer, start, shteSize)
  const id = dv.getUint32(0, true)
  const type = dv.getUint32(4, true)
  const offset = Number(dv.getBigUint64(24, true))
  const size = Number(dv.getBigUint64(32, true))
  console.log(`id ${id} type ${type} start ${start} offset ${offset} size ${size}`)
  const bb = ptr(bytes.subarray(offset, offset + size))
  console.log(dump(bb.subarray(0, Math.min(size, 1024))))
  if (id === 176) {
    lo.core.write_file('vmm.gz', bb.subarray(0, size))
  }
  if (type === 3) {

    let off = 1
    while (1) {
      const len = strnlen(bb.ptr + off, 1024)
      const sym = decoder.decode(bb.subarray(off, off + len))
/*
      if (sym.match(rx)) {
        symbols.set(sym, {
          name: sym,
          offset,
          size
        })
      }
*/
      console.log(sym)
      off += len + 1
      if (off >= bb.length) break
    }


  }
}



console.log(Array.from(symbols.values()).map(e => stringify(e)))

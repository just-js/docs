const { core } = lo.library('core')

core.mmio_signal()

const { fsmount } = lo.library('fsmount')
const { mount } = fsmount
const r = mount('proc', '/proc', 'proc', 0, 0)

function addr (u32) {
  return u32[0] + ((2 ** 32) * u32[1])  
}

function findmem (str) {
  const space = ' '
  let spaces = 0
  let last = 0
  while (spaces < 24) {
    const i = str.indexOf(space, last)
    if (i > 0) {
      if (spaces++ === 23) return (Number(str.slice(last, i)) * 4096) / 1024
      last = i + 1
    } else {
      break
    }
  }
}

const handle = new Uint32Array(2)
const buf = new Uint8Array(1024)
const fd = core.open(`/proc/self/stat`, core.O_RDONLY)
const bytes = core.pread(fd, buf, 1024, 0)
lo.getAddress(buf, handle)
const str = lo.utf8Decode(addr(handle), buf.length)
lo.print(`rss ${findmem(str)}\n`)
lo.print(`lo ${lo.version.lo}\n`)
lo.print(`v8 ${lo.version.v8}\n`)
//core.sleep(30)


/*
   int fd = open("/dev/mem", (O_RDWR | O_SYNC | O_CLOEXEC));
   int mapped_size = getpagesize();
   unsigned long FIRST_ADDR_PAST_32BITS = (1UL << 32);
   unsigned long MEM_32BIT_GAP_SIZE = (768UL << 20);
   char *map_base = mmap(NULL,
        mapped_size,
        PROT_WRITE,
        MAP_SHARED,
        fd,
        FIRST_ADDR_PAST_32BITS - MEM_32BIT_GAP_SIZE);
   *map_base = 123;

*/

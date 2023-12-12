# building a custom js runtime on lo

you can build your own custom runtime as follows

## download and build lo runtime

instructions [here](building-from-scratch.md)

## create a config for your runtime

this can be automated behind a cli command at some point

let's call it ```nocurl.config.js```

```JavaScript

const bindings = [
  'core', 
  'inflate', 
  'curl', 
]

const libs = [
  'lib/bench.js', 
  'lib/gen.js', 
  'lib/fs.js', 
  'lib/untar.js', 
  'lib/proc.js', 
  'lib/path.js', 
  'lib/curl.js',
  'lib/inflate.js', 
  'lib/build.js', 
  'lib/asm.js', 
  'lib/ffi.js', 
  'lib/binary.js'
]

const embeds = [
  'main.cc',
  'lo.cc', 
  'lo.h',
  'lib/core/api.js',
  'lib/curl/api.js',
  'lib/duckdb/api.js',
  'lib/duckdb/build.js',
  'lib/encode/api.js',
  'lib/epoll/api.js',
  'lib/inflate/api.js',
  'lib/inflate/build.js',
  'lib/libffi/api.js',
  'lib/libssl/api.js',
  'lib/lz4/api.js',
  'lib/mbedtls/api.js',
  'lib/mbedtls/build.js',
  'lib/net/api.js',
  'lib/pico/api.js',
  'lib/pico/build.js',
  'lib/pthread/api.js',
  'lib/seccomp/api.js',
  'lib/sqlite/api.js',
  'lib/system/api.js',
  'lib/tcc/api.js',
  'lib/tcc/build.js',
  'lib/wireguard/api.js',
  'lib/wireguard/build.js',
  'lib/zlib/api.js',
]

export default { bindings, libs, embeds }

```

this is the same definition as the default builder runtime [here](https://github.com/just-js/lo/blob/0.0.13-pre/lib/build.js#L320)

let's build it. we will work from the LO_HOME directory with all the source files
available for now, until the tooling improves.

```shell
TARGET=nocurl ./lo build runtime nocurl.config.js
```

we should see something like this

```shell
create builtins
create main header
compile builtins
compile main.cc
compile lo.cc
link runtime 
compile binding core in /media/andrew/OCZ/source2023/just-js/lo/lib/core
create  /media/andrew/OCZ/source2023/just-js/lo/lib/core/core.cc
change dir to  /media/andrew/OCZ/source2023/just-js/lo/lib/core
compile core.cc with g++
static lib  core.a
shared lib  core.so with g++
change dir to  /media/andrew/OCZ/source2023/just-js/lo
compile binding inflate in /media/andrew/OCZ/source2023/just-js/lo/lib/inflate
create  /media/andrew/OCZ/source2023/just-js/lo/lib/inflate/inflate.cc
building dependencies inflate in /media/andrew/OCZ/source2023/just-js/lo/lib/inflate
change dir to  /media/andrew/OCZ/source2023/just-js/lo/lib/inflate
compile inflate.cc with g++
static lib  inflate.a
shared lib  inflate.so with g++
change dir to  /media/andrew/OCZ/source2023/just-js/lo
compile binding curl in /media/andrew/OCZ/source2023/just-js/lo/lib/curl
create  /media/andrew/OCZ/source2023/just-js/lo/lib/curl/curl.cc
change dir to  /media/andrew/OCZ/source2023/just-js/lo/lib/curl
compile curl.cc with g++
static lib  curl.a
shared lib  curl.so with g++
change dir to  /media/andrew/OCZ/source2023/just-js/lo
```

and we should have a new binary called ```nocurl```

let's run the tests on it and see if it's ok

```shell
# this should print version to console
./nocurl
# this should run successfully and display nothing
./nocurl eval 1
# this should run successfully and display nothing
./nocurl test/runtime.js
# this should dump all the internals of the runtime
./nocurl test/dump.js
```

so, we called it nocurl, but we still have curl as an internal binding. let's remove it and all that other cruft.

here is our new ```nocurl.config.js```

```JavaScript
const bindings = [
  'core', 
  'inflate'
]

const libs = [
  'lib/bench.js', 
  'lib/gen.js', 
  'lib/fs.js', 
  'lib/untar.js', 
  'lib/proc.js', 
  'lib/path.js', 
  'lib/curl.js',
  'lib/inflate.js', 
  'lib/build.js', 
  'lib/asm.js', 
  'lib/ffi.js', 
  'lib/binary.js'
]

const embeds = []

export default { bindings, libs, embeds }

```

let's build it again

```shell
./lo build binding nocurl
```

we should see something like this

```shell
create builtins
create main header
compile builtins
compile main.cc
compile lo.cc
link runtime 
compile binding core in /media/andrew/OCZ/source2023/just-js/lo/lib/core
create  /media/andrew/OCZ/source2023/just-js/lo/lib/core/core.cc
change dir to  /media/andrew/OCZ/source2023/just-js/lo/lib/core
compile core.cc with g++
static lib  core.a
shared lib  core.so with g++
change dir to  /media/andrew/OCZ/source2023/just-js/lo
compile binding inflate in /media/andrew/OCZ/source2023/just-js/lo/lib/inflate
create  /media/andrew/OCZ/source2023/just-js/lo/lib/inflate/inflate.cc
building dependencies inflate in /media/andrew/OCZ/source2023/just-js/lo/lib/inflate
change dir to  /media/andrew/OCZ/source2023/just-js/lo/lib/inflate
compile inflate.cc with g++
static lib  inflate.a
shared lib  inflate.so with g++
change dir to  /media/andrew/OCZ/source2023/just-js/lo
```


now, when we dump the internals, we see only the things in our definition

```shell
------------------------
        lo.js
------------------------
args       ./nocurl,test/dump.js
tests      ok
os         linux  
arch       x64  
boot       4.96 ms  
version    0.0.13pre  
rss        18816  
v8         12.0.267.8
builtins
  lib/asm.js                      : 8297 bytes
    Assembler: Function
    Registers: Object
    address_as_bytes: Function
    compile: Function
  lib/bench.js                    : 1196 bytes
    Bench: Function
  lib/binary.js                   : 1074 bytes
    dump: Function
  lib/build.js                    : 17009 bytes
    build: AsyncFunction
  lib/curl.js                     : 1649 bytes
    fetch: Function
  lib/ffi.js                      : 5549 bytes
    Assembler: Function
    Types: Object
    asm: Assembler = [object Object]
    bind: Function
    bind_fastcall: Function
    bindall: Function
    compile_function_call: Function
    fastcall: Function
  lib/fs.js                       : 3164 bytes
    isDir: Function
    isFile: Function
    mkDirAll: Function
    read_flags: Number = 0
    rmDirAll: Function
    write_flags: Number = 577
    write_mode: Number = 420
  lib/gen.js                      : 20247 bytes
    bindings: Function
    config: Object
    gen: AsyncFunction
    headerFile: Function
    linkArgs: AsyncFunction
    linkerScript: Function
    makeFile: Function
    wrapper: Function
  lib/inflate.js                  : 1098 bytes
    header: Function
    inflate: Function
  lib/path.js                     : 3137 bytes
    baseName: Function
    extName: Function
    fileName: Function
    join: Function
    normalize: Function
  lib/proc.js                     : 3370 bytes
    exec: Function
    exec_env: Function
    exec_path_env: Function
    mem: Function
  lib/untar.js                    : 3168 bytes
    untar: Function
  main.js                         : 11556 bytes
bindings
  core
    EAGAIN: Number = 11
    F_OK: Number = 0
    F_SETFL: Number = 4
    NAME_MAX: Number = 255
    O_CLOEXEC: Number = 524288
    O_CREAT: Number = 64
    O_DIRECTORY: Number = 65536
    O_NONBLOCK: Number = 2048
    O_RDONLY: Number = 0
    O_RDWR: Number = 2
    O_TRUNC: Number = 512
    O_WRONLY: Number = 1
    RTLD_LAZY: Number = 1
    RTLD_NOW: Number = 2
    RUSAGE_SELF: Number = 0
    SEEK_CUR: Number = 1
    SEEK_END: Number = 2
    SEEK_SET: Number = 0
    STDERR: Number = 2
    STDIN: Number = 0
    STDOUT: Number = 1
    S_IFBLK: Number = 24576
    S_IFCHR: Number = 8192
    S_IFDIR: Number = 16384
    S_IFIFO: Number = 4096
    S_IFMT: Number = 61440
    S_IFREG: Number = 32768
    S_IRGRP: Number = 32
    S_IROTH: Number = 4
    S_IRUSR: Number = 256
    S_IRWXG: Number = 56
    S_IRWXO: Number = 7
    S_IRWXU: Number = 448
    S_IWGRP: Number = 16
    S_IWOTH: Number = 2
    S_IWUSR: Number = 128
    S_IXOTH: Number = 1
    access: Function
    bind_fastcall: Function
    bind_slowcall: Function
    calloc: Function
    chdir: Function
    close: Function
    closedir: Function
    dlclose: Function
    dlopen: Function
    dlsym: Function
    dup: Function
    dup2: Function
    execve: Function
    execvp: Function
    fastcall: Function
    fchdir: Function
    fcntl: Function
    fork: Function
    free: Function
    fstat: Function
    getcwd: Function
    getenv: Function
    getpid: Function
    getrusage: Function
    isolate_context_create: Function
    isolate_context_destroy: Function
    isolate_context_size: Function
    isolate_create: Function
    isolate_start: Function
    kill: Function
    lseek: Function
    lstat: Function
    memcpy: Function
    memmove: Function
    mkdir: Function
    mmap: Function
    mprotect: Function
    open: Function
    openat: Function
    opendir: Function
    pread: Function
    read: Function
    readdir: Function
    readlink: Function
    rename: Function
    rmdir: Function
    setenv: Function
    sleep: Function
    stat: Function
    strnlen: Function
    strnlen_str: Function
    times: Function
    unlink: Function
    unsetenv: Function
    usleep: Function
    waitpid: Function
    write: Function
    write_string: Function
  inflate
    inflate: Function
```

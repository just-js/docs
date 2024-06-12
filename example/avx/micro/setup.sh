#!/bin/bash
go mod init github.com/billywhizz/linecount
go get github.com/prometheus/procfs
go get gopkg.ilharper.com/x/isatty
node-gyp configure
node-gyp build
npm install sbffi
npm install koffi
npm install ffi-rs
gcc -flto -c -fPIC -D_GNU_SOURCE -std=c99 -O3 -o linecount.o linecount-avx.c -march=native -mtune=native
#gcc -flto -c -fPIC -D_GNU_SOURCE -std=c99 -O3 -o micro.o micro.c -march=native -mtune=native
#gcc -flto -fpic -static -s -O3 -o micro-c micro.o linecount.o -march=native -mtune=native
gcc -D_GNU_SOURCE -std=c99 -s -O3 -mavx2 -o micro-c micro.c
gcc -flto -fPIC -D_GNU_SOURCE -std=c99 -shared -O3 -o linecount.so linecount-avx.c -march=native -mtune=native
gcc -flto -fPIC -D_GNU_SOURCE -std=c99 -shared -O3 -o linecount-sse.so linecount-sse.c -march=native -mtune=native
GOAMD64=v2 go build micro-go.go
#cd wasm && ./build.sh && cd ..
lo build binding memcount
uname -a
cat /proc/cpuinfo | grep "model name" | head -n 1
dmidecode --type 17
lo --version
bun --version
deno --version
node --version
go version
lo create_test_file.js /dev/shm/test.log 64
#./micro-c
#./micro-go
#lo micro-lo.js
#lo micro-lo-ffi.js
#lo micro-lo-wasm.js
#lo micro-native.mjs
#bun micro-bun-ffi.js
#bun micro-node-koffi.mjs
#bun micro-node-sbffi.mjs
#bun micro-wasm.mjs
#bun micro-napi.mjs
#bun micro-napi-min.mjs
#bun micro-native.mjs
#node micro-node-koffi.mjs
#node micro-node-sbffi.mjs
#node micro-wasm.mjs
#node micro-napi.mjs
#node micro-napi-min.mjs
#node micro-native.mjs
#deno run -A --unstable-ffi micro-deno-ffi.js
#deno run -A micro-node-sbffi.mjs
#deno run -A micro-wasm.mjs
#deno run -A micro-napi.mjs
#deno run -A micro-napi-min.mjs
#deno run -A micro-native.mjs
#node micro-node-ffirs.mjs
#bun micro-node-ffirs.mjs
#deno run -A micro-node-ffirs.mjs
#deno run -A micro-node-koffi.mjs

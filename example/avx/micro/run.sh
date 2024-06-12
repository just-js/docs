lo create_test_file.js /dev/shm/test.log $1
echo "C" && nice -n 20 taskset --cpu-list 6 ./micro-c 2>/dev/null
echo "GO" && nice -n 20 taskset --cpu-list 6 ./micro-go 2>/dev/null
echo "lo-binding" && nice -n 20 taskset --cpu-list 6 lo micro-lo.js 2>/dev/null
echo "lo-ffi" && nice -n 20 taskset --cpu-list 6 lo micro-lo-ffi.js 2>/dev/null
echo "lo-wasm" && nice -n 20 taskset --cpu-list 6 lo micro-lo-wasm.js 2>/dev/null
echo "lo-native" && nice -n 20 taskset --cpu-list 6 lo micro-native.mjs 2>/dev/null
echo "bun-ffi" && nice -n 20 taskset --cpu-list 6 bun micro-bun-ffi.js 2>/dev/null
echo "bun-koffi" && nice -n 20 taskset --cpu-list 6 bun micro-node-koffi.mjs 2>/dev/null
echo "bun-sbffi" && nice -n 20 taskset --cpu-list 6 bun micro-node-sbffi.mjs 2>/dev/null
echo "bun-wasm" && nice -n 20 taskset --cpu-list 6 bun micro-wasm.mjs 2>/dev/null
echo "bun-napi" && nice -n 20 taskset --cpu-list 6 bun micro-napi.mjs 2>/dev/null
echo "bun-napi-min" && nice -n 20 taskset --cpu-list 6 bun micro-napi-min.mjs 2>/dev/null
echo "bun-native" && nice -n 20 taskset --cpu-list 6 bun micro-native.mjs 2>/dev/null
echo "node-koffi" && nice -n 20 taskset --cpu-list 6 node micro-node-koffi.mjs 2>/dev/null
echo "node-sbffi" && nice -n 20 taskset --cpu-list 6 node micro-node-sbffi.mjs 2>/dev/null
echo "node-wasm" && nice -n 20 taskset --cpu-list 6 node micro-wasm.mjs 2>/dev/null
echo "node-napi" && nice -n 20 taskset --cpu-list 6 node micro-napi.mjs 2>/dev/null
echo "node-napi-min" && nice -n 20 taskset --cpu-list 6 node micro-napi-min.mjs 2>/dev/null
echo "node-native" && nice -n 20 taskset --cpu-list 6 node micro-native.mjs 2>/dev/null
echo "deno-ffi" && nice -n 20 taskset --cpu-list 6 deno run -A --unstable-ffi micro-deno-ffi.js 2>/dev/null
echo "deno-sbffi" && nice -n 20 taskset --cpu-list 6 deno run -A micro-node-sbffi.mjs 2>/dev/null
echo "deno-wasm" && nice -n 20 taskset --cpu-list 6 deno run -A micro-wasm.mjs 2>/dev/null
echo "deno-napi" && nice -n 20 taskset --cpu-list 6 deno run -A micro-napi.mjs 2>/dev/null
echo "deno-napi-min" && nice -n 20 taskset --cpu-list 6 deno run -A micro-napi-min.mjs 2>/dev/null
echo "deno-native" && nice -n 20 taskset --cpu-list 6 deno run -A micro-native.mjs 2>/dev/null

## Install emscripten


## Links

- [Optimizing Code](https://emscripten.org/docs/optimizing/Optimizing-Code.html)

## Tools

to disassemble the wasm into a wat file

```shell
wasm-dis linecount.wasm
```

to recompile wat to wasm

```shell
wasm-dis linecount.wasm > linecount.wat
wat2wasm linecount.wat -o linecount.wasm
```

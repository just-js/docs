example FFI bindings for [WebGPU native](https://github.com/gfx-rs/wgpu-native/releases) C api

## ```test.js```

a JS version of the device enumeration example [here](https://github.com/gfx-rs/wgpu-native/blob/trunk/examples/enumerate_adapters/main.c).

```shell
curl -L -o wgpu-linux-x86_64-release.zip https://github.com/gfx-rs/wgpu-native/releases/download/v0.19.4.1/wgpu-linux-x86_64-release.zip
unzip wgpu-linux-x86_64-release.zip
lo adapters.js
```

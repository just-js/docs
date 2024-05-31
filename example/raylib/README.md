A simple example of using raylib with ffi

to download and build raylib on Ubuntu 22.04 the following worked, after some
frustration.

## download raylib for linux/x64

```shell
curl -L -o raylib.tar.gz https://github.com/raysan5/raylib/releases/download/5.0/raylib-5.0_linux_amd64.tar.gz
tar -xvf raylib.tar.gz
mv raylib-5.0_linux_amd64 raylib
cp raylib/lib/libraylib.so.5.0.0 ./libraylib.so
```

## building from source with options that work on ubuntu 22.04

```shell
curl -L -o raylib.tar.gz https://github.com/raysan5/raylib/archive/refs/tags/5.0.tar.gz
tar -xvf raylib.tar.gz
mv raylib-5.0 raylib
cd raylib
mkdir build
cd build
cmake -DCUSTOMIZE_BUILD=ON -DGLFW_BUILD_WAYLAND=OFF -DGLFW_BUILD_X11=ON -DSUPPORT_FILEFORMAT_JPG=ON -DSUPPORT_FILEFORMAT_FLAC=ON -DWITH_PIC=ON -DBUILD_SHARED_LIBS=ON -DCMAKE_BUILD_TYPE=Release ../
make -j 4
cp raylib/libraylib.so.4.5.0 ../../libraylib.so
```

## building on macos/x64

```shell

```

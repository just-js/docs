this example shows how to dynamically bind to system libcurl and use FFI. the program will download a github tarball and write the bytes to stdout.

you can count the number of bytes downloaded

```shell
lo curl.js | wc -c
```

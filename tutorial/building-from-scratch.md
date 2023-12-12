# building lo from scratch

in this tutorial, we will 

- download lo source and build it from scratch
- create a new binding for boringssl, build it and test it

## build lo from scratch on Linux

on debian/linux, do the following

### install build dependencies if not already installed

```shell
apt install -y curl g++ make libcurl4-openssl-dev
```

### download lo source and build lo runtime

```shell
curl -L -o 0.0.13-pre.tar.gz https://github.com/just-js/lo/archive/refs/tags/0.0.13-pre.tar.gz
tar -xf 0.0.13-pre.tar.gz
cd lo-0.0.13-pre
make C=gcc CC=g++ cleanall lo
```

## build lo from scratch on macos

...coming soon

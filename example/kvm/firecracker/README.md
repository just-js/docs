## build the runtime

```
lo build runtime mini.config.js
```

## create the initrd directory

```
lo initrd.js
```

## create the devices (as root)

```
sudo lo devices.js
```

## copy the runtime into initrd and generate the cpio archive

```
cp mini initrd/
cd initrd/
find . -print0 | cpio --null --create --verbose --format=newc > ../initrd.cpio
cd ..
```

## run the vmm

```
./firecracker --config-file config.json --boot-timer --level error --no-api --no-seccomp --log-path ./mini.log
```

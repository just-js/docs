#!/bin/bash
#rm -f mini.sock && ./firecracker --config-file config.json --api-sock mini.sock --boot-timer --level 0
./firecracker --config-file config.json --boot-timer --level error --no-api --no-seccomp --log-path ./mini.log
#reset
# 330 ms

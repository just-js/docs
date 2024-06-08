#!/bin/bash
docker run -it --rm -v $(pwd):/bench --privileged --shm-size=8192m linecount-bench /bin/bash

# duckdb bindings example

this shows an example of how to download and build lo, the duckdb bindings 
and run a benchmark on duckdb.

you can follow the instructions here to install lo from scratch or you can
build the docker image in the [docker example](../docker/README.md) and run it
in this directory like this

## running with docker image

```
docker run -it --rm --privileged -v $(pwd):/app lo
```

## building lo from scratch

install libcurl, which is required by lo (for now)
```
apt install -y libcurl4-openssl-dev
```

create lo home directory and change directory to it

```
export LO_HOME=$HOME/.lo
mkdir -p $LO_HOME
cd $LO_HOME
```

download lo

```
curl -L -o lo.gz https://github.com/just-js/lo/releases/download/0.0.9-pre/lo-linux-x64.gz
```

extract and change permissions

```
gunzip lo.gz
chmod +x lo
```

rebuild lo and create files in home (-v flag displays the c++ compiler commands)

```
./lo build -v
```

install dependencies for duckdb build

```
apt install -y python3 git
```

compile the duckdb bindings

```
./lo build binding duckdb -v
```

## run the duckdb benches

to download a specific version of duckdb shared library

```
lo setup.js v0.3.0
```

pass the '-d' command line flag to delete the existing directory

```
lo setup.js v0.3.0 -d
```

run the bench, preloading the downloaded duckdb shared library

```
LD_PRELOAD=./duckdb/libduckdb.so nice -n 20 taskset --cpu-list 0 lo bench.js
```

```
run_prepared                     rate     147821 μs/iter       6.76 rss 86528
run_prepared                     rate     151225 μs/iter       6.61 rss 120996
run_prepared                     rate     151578 μs/iter       6.60 rss 156196
run_prepared                     rate     152997 μs/iter       6.54 rss 189476
run_prepared                     rate     153373 μs/iter       6.52 rss 222628
run_prepared                     rate     152106 μs/iter       6.57 rss 260004
run_prepared                     rate     152684 μs/iter       6.55 rss 293156
run_prepared                     rate     153717 μs/iter       6.51 rss 326436
run_prepared                     rate     153075 μs/iter       6.53 rss 359588
```

run the bench across multiple duckdb versions

```
lo all.js
```

or, just run the bench against the duckdb version linked into the lo shared
library

```
nice -n 20 taskset --cpu-list 0 lo bench.js
```

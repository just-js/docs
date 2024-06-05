```shell
$ lo build binding noop
$ lo ffi.js

noop_fast            time 1465 rate 204732093 rate/core 204732093 ns/iter 4.89  rss 36992 usr 100 sys    0 tot 100
noop_slow            time 1053 rate 94925336  rate/core 94925336  ns/iter 10.54 rss 37248 usr 100 sys    0 tot 100
noop_fast_ffi        time 1340 rate 223851276 rate/core 226112400 ns/iter 4.47  rss 37248 usr  99 sys    0 tot  99
noop_slow_ffi        time 1997 rate 50057102  rate/core 50057102  ns/iter 19.98 rss 37248 usr 100 sys    0 tot 100
noop_fast            time 1253 rate 239262462 rate/core 239262462 ns/iter 4.18  rss 37760 usr 100 sys    0 tot 100
noop_slow            time 846  rate 118197667 rate/core 119391583 ns/iter 8.47  rss 37760 usr  99 sys    0 tot  99
noop_fast_ffi        time 1241 rate 241633384 rate/core 241633384 ns/iter 4.14  rss 37760 usr 100 sys    0 tot 100
noop_slow_ffi        time 2062 rate 48479330  rate/core 48969021  ns/iter 20.63 rss 37760 usr  99 sys    0 tot  99
noop_fast            time 1247 rate 240560448 rate/core 240560448 ns/iter 4.16  rss 37760 usr 100 sys    0 tot 100
noop_slow            time 887  rate 112688265 rate/core 113826531 ns/iter 8.88  rss 37888 usr  99 sys    0 tot  99
noop_fast_ffi        time 1245 rate 240807707 rate/core 240807707 ns/iter 4.16  rss 37888 usr 100 sys    0 tot 100
noop_slow_ffi        time 2071 rate 48265074  rate/core 48752600  ns/iter 20.72 rss 37888 usr  99 sys    0 tot  99
noop_fast            time 1289 rate 232710843 rate/core 232710843 ns/iter 4.30  rss 37888 usr 100 sys    0 tot 100
noop_slow            time 944  rate 105930770 rate/core 105930770 ns/iter 9.45  rss 37888 usr 100 sys    0 tot 100
noop_fast_ffi        time 1253 rate 239370271 rate/core 241788153 ns/iter 4.18  rss 37888 usr  99 sys    0 tot  99
noop_slow_ffi        time 2070 rate 48302010  rate/core 48789910  ns/iter 20.71 rss 37888 usr  99 sys    0 tot  99
```


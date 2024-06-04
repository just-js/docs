an example using avx2 and sse2 to find count of a character in a file. should be optimally performant.

lo create_test_file.js /dev/shm/test.log $(calc "8 * 1024 * 1024 * 1024")
GOAMD64=v2 go build count.go
GOAMD64=v2 go build wc-go.go
gcc -static -s -O3 -o wc wc.c -march=native -mtune=native
lo init wc
lo build binding memcount

https://lemire.me/blog/2017/02/14/how-fast-can-you-count-lines/
https://x.com/t3dotgg/status/1796689128207368687

gcc -D_GNU_SOURCE -std=c99 -static -s -O3 -o count-c count.c -march=native -mtune=native

create an 8GB test file

```shell
lo create_test_file.js /dev/shm/test.log $(calc "8 * 1024 * 1024 * 1024")
```

```shell
nice -n -20 taskset --cpu-list 2 hyperfine "wc -l /dev/shm/test.log" "./wc" "./wc-lo" "./wc-go" "lo wc.js" "node wc-node.js" "node wc-node-sync.js" "bun wc-node.js" "bun wc-node-sync.js" 2>/dev/null
Benchmark 1: wc -l /dev/shm/test.log
  Time (mean ± σ):      1.892 s ±  0.028 s    [User: 0.915 s, System: 0.976 s]
  Range (min … max):    1.877 s …  1.963 s    10 runs
 
Benchmark 2: ./wc
  Time (mean ± σ):      1.030 s ±  0.003 s    [User: 0.175 s, System: 0.855 s]
  Range (min … max):    1.028 s …  1.037 s    10 runs
 
Benchmark 3: ./wc-lo
  Time (mean ± σ):      1.019 s ±  0.005 s    [User: 0.146 s, System: 0.873 s]
  Range (min … max):    1.012 s …  1.031 s    10 runs
 
Benchmark 4: ./wc-go
  Time (mean ± σ):      1.179 s ±  0.007 s    [User: 0.274 s, System: 0.904 s]
  Range (min … max):    1.173 s …  1.194 s    10 runs
 
Benchmark 5: lo wc.js
  Time (mean ± σ):      1.025 s ±  0.007 s    [User: 0.158 s, System: 0.866 s]
  Range (min … max):    1.018 s …  1.036 s    10 runs
 
Benchmark 6: node wc-node.js
  Time (mean ± σ):      5.154 s ±  0.023 s    [User: 3.580 s, System: 1.573 s]
  Range (min … max):    5.136 s …  5.211 s    10 runs
 
Benchmark 7: node wc-node-sync.js
  Time (mean ± σ):      4.472 s ±  0.042 s    [User: 3.442 s, System: 1.028 s]
  Range (min … max):    4.414 s …  4.580 s    10 runs
 
Benchmark 8: bun wc-node.js
  Time (mean ± σ):     11.320 s ±  0.736 s    [User: 7.984 s, System: 3.329 s]
  Range (min … max):   10.859 s … 12.991 s    10 runs
 
Benchmark 9: bun wc-node-sync.js
  Time (mean ± σ):      2.343 s ±  0.022 s    [User: 1.484 s, System: 0.858 s]
  Range (min … max):    2.305 s …  2.363 s    10 runs
 
Summary
  './wc-lo' ran
    1.01 ± 0.01 times faster than 'lo wc.js'
    1.01 ± 0.01 times faster than './wc'
    1.16 ± 0.01 times faster than './wc-go'
    1.86 ± 0.03 times faster than 'wc -l /dev/shm/test.log'
    2.30 ± 0.02 times faster than 'bun wc-node-sync.js'
    4.39 ± 0.05 times faster than 'node wc-node-sync.js'
    5.06 ± 0.03 times faster than 'node wc-node.js'
   11.11 ± 0.72 times faster than 'bun wc-node.js'
```

```shell
$ nice -n -20 taskset --cpu-list 2 poop "wc -l /dev/shm/test.log" "./wc" "./wc-lo" "./wc-go" "lo wc.js" "node wc-node.js" "node wc-node-sync.js" "bun wc-node.js" "bun wc-node-sync.js"

Benchmark 1 (3 runs): wc -l /dev/shm/test.log
  measurement          mean ± σ            min … max           outliers         delta
  wall_time          1.89s  ± 1.99ms    1.88s  … 1.89s           0 ( 0%)        0%
  peak_rss           2.18MB ± 75.7KB    2.10MB … 2.23MB          0 ( 0%)        0%
  cpu_cycles         2.42G  ± 6.62M     2.41G  … 2.42G           0 ( 0%)        0%
  instructions       2.58G  ± 2.11M     2.58G  … 2.58G           0 ( 0%)        0%
  cache_references   4.62M  ±  476K     4.17M  … 5.12M           0 ( 0%)        0%
  cache_misses       21.9K  ±  470      21.4K  … 22.3K           0 ( 0%)        0%
  branch_misses      47.9M  ±  294K     47.6M  … 48.1M           0 ( 0%)        0%
Benchmark 2 (5 runs): ./wc
  measurement          mean ± σ            min … max           outliers         delta
  wall_time          1.03s  ± 1.52ms    1.03s  … 1.04s           0 ( 0%)        ⚡- 45.2% ±  0.2%
  peak_rss           3.63MB ± 1.83KB    3.63MB … 3.64MB          0 ( 0%)        💩+ 66.4% ±  3.6%
  cpu_cycles          590M  ± 1.89M      588M  …  592M           0 ( 0%)        ⚡- 75.6% ±  0.3%
  instructions       1.48G  ± 6.12      1.48G  … 1.48G           0 ( 0%)        ⚡- 42.7% ±  0.1%
  cache_references    231M  ± 41.0K      231M  …  231M           0 ( 0%)        💩+4910.8% ± 10.7%
  cache_misses        102K  ± 18.9K     88.5K  …  135K           0 ( 0%)        💩+366.8% ± 125.7%
  branch_misses      20.3K  ± 1.53K     18.4K  … 22.7K           0 ( 0%)        ⚡-100.0% ±  0.6%
Benchmark 3 (5 runs): ./wc-lo
  measurement          mean ± σ            min … max           outliers         delta
  wall_time          1.03s  ± 17.3ms    1.02s  … 1.06s           0 ( 0%)        ⚡- 45.5% ±  1.3%
  peak_rss           25.4MB ±    0      25.4MB … 25.4MB          0 ( 0%)        💩+1064.0% ±  3.6%
  cpu_cycles          537M  ± 19.9M      525M  …  572M           0 ( 0%)        ⚡- 77.8% ±  1.2%
  instructions       1.40G  ± 1.36K     1.40G  … 1.40G           1 (20%)        ⚡- 45.8% ±  0.1%
  cache_references    217M  ±  201K      217M  …  218M           0 ( 0%)        💩+4607.2% ± 12.4%
  cache_misses        795K  ±  540K      457K  … 1.72M           0 ( 0%)          +3525.8% ± 3591.7%
  branch_misses       205K  ± 6.77K      200K  …  217K           0 ( 0%)        ⚡- 99.6% ±  0.6%
Benchmark 4 (5 runs): ./wc-go
  measurement          mean ± σ            min … max           outliers         delta
  wall_time          1.20s  ± 1.54ms    1.20s  … 1.20s           0 ( 0%)        ⚡- 36.2% ±  0.2%
  peak_rss           3.67MB ±    0      3.67MB … 3.67MB          0 ( 0%)        💩+ 68.0% ±  3.6%
  cpu_cycles          778M  ± 4.92M      774M  …  786M           0 ( 0%)        ⚡- 67.8% ±  0.4%
  instructions       2.17G  ±  135K     2.17G  … 2.17G           1 (20%)        ⚡- 15.9% ±  0.1%
  cache_references    248M  ± 25.6K      248M  …  248M           0 ( 0%)        💩+5272.3% ± 10.7%
  cache_misses        571K  ±  172K      441K  …  858K           0 ( 0%)        💩+2501.3% ± 1142.1%
  branch_misses       105K  ± 1.68K      102K  …  107K           0 ( 0%)        ⚡- 99.8% ±  0.6%
Benchmark 5 (5 runs): lo wc.js
  measurement          mean ± σ            min … max           outliers         delta
  wall_time          1.03s  ± 4.17ms    1.02s  … 1.03s           0 ( 0%)        ⚡- 45.5% ±  0.3%
  peak_rss           34.2MB ±  234KB    34.1MB … 34.6MB          0 ( 0%)        💩+1467.2% ± 16.1%
  cpu_cycles          538M  ± 5.44M      530M  …  543M           0 ( 0%)        ⚡- 77.7% ±  0.4%
  instructions       1.40G  ± 1.86K     1.40G  … 1.40G           0 ( 0%)        ⚡- 45.6% ±  0.1%
  cache_references    218M  ± 54.2K      218M  …  218M           0 ( 0%)        💩+4612.1% ± 10.8%
  cache_misses        803K  ±  162K      563K  …  997K           0 ( 0%)        💩+3561.6% ± 1075.3%
  branch_misses       238K  ± 1.01K      236K  …  239K           1 (20%)        ⚡- 99.5% ±  0.6%
Benchmark 6 (3 runs): node wc-node.js
  measurement          mean ± σ            min … max           outliers         delta
  wall_time          5.44s  ±  242ms    5.16s  … 5.59s           0 ( 0%)        💩+188.6% ± 20.6%
  peak_rss           89.7MB ±  146KB    89.6MB … 89.9MB          0 ( 0%)        💩+4008.3% ± 12.1%
  cpu_cycles         12.2G  ±  110M     12.0G  … 12.3G           0 ( 0%)        💩+403.9% ±  7.3%
  instructions       17.0G  ± 2.97M     17.0G  … 17.0G           0 ( 0%)        💩+559.6% ±  0.2%
  cache_references    310M  ± 1.27M      309M  …  311M           0 ( 0%)        💩+6613.3% ± 47.2%
  cache_misses       59.1M  ± 1.76M     57.4M  … 60.9M           0 ( 0%)        💩+269177.8% ± 12877.5%
  branch_misses      49.9M  ±  446K     49.6M  … 50.4M           0 ( 0%)        💩+  4.2% ±  1.8%
Benchmark 7 (3 runs): node wc-node-sync.js
  measurement          mean ± σ            min … max           outliers         delta
  wall_time          4.47s  ± 24.1ms    4.45s  … 4.50s           0 ( 0%)        💩+137.0% ±  2.1%
  peak_rss           55.4MB ±  267KB    55.1MB … 55.6MB          0 ( 0%)        💩+2436.6% ± 20.4%
  cpu_cycles         11.6G  ± 58.2M     11.5G  … 11.6G           0 ( 0%)        💩+379.1% ±  3.9%
  instructions       17.5G  ± 20.0M     17.5G  … 17.5G           0 ( 0%)        💩+580.4% ±  1.2%
  cache_references    252M  ± 1.79M      250M  …  253M           0 ( 0%)        💩+5346.9% ± 64.2%
  cache_misses       3.27M  ± 1.43M     1.91M  … 4.77M           0 ( 0%)        💩+14821.1% ± 10481.1%
  branch_misses      48.1M  ±  578K     47.8M  … 48.8M           0 ( 0%)          +  0.5% ±  2.2%
Benchmark 8 (3 runs): bun wc-node.js
  measurement          mean ± σ            min … max           outliers         delta
  wall_time          11.6s  ±  613ms    11.2s  … 12.3s           0 ( 0%)        💩+514.5% ± 52.1%
  peak_rss            129MB ±  228KB     129MB …  129MB          0 ( 0%)        💩+5797.4% ± 17.6%
  cpu_cycles         22.8G  ± 44.1M     22.8G  … 22.8G           0 ( 0%)        💩+843.3% ±  3.0%
  instructions       22.0G  ± 17.3M     22.0G  … 22.0G           0 ( 0%)        💩+752.7% ±  1.1%
  cache_references   2.10G  ± 2.50M     2.10G  … 2.11G           0 ( 0%)        💩+45441.0% ± 88.4%
  cache_misses       1.56G  ± 1.37M     1.56G  … 1.56G           0 ( 0%)        💩+7108361.0% ± 9988.3%
  branch_misses      74.4M  ±  245K     74.1M  … 74.5M           0 ( 0%)        💩+ 55.3% ±  1.3%
Benchmark 9 (3 runs): bun wc-node-sync.js
  measurement          mean ± σ            min … max           outliers         delta
  wall_time          2.32s  ± 14.2ms    2.31s  … 2.33s           0 ( 0%)        💩+ 23.2% ±  1.2%
  peak_rss           53.0MB ±  961KB    51.9MB … 53.7MB          0 ( 0%)        💩+2324.6% ± 70.7%
  cpu_cycles         4.90G  ± 40.7M     4.86G  … 4.93G           0 ( 0%)        💩+102.9% ±  2.7%
  instructions       9.08G  ± 11.8M     9.07G  … 9.10G           0 ( 0%)        💩+252.6% ±  0.7%
  cache_references    245M  ± 77.1K      245M  …  245M           0 ( 0%)        💩+5209.0% ± 16.7%
  cache_misses       1.72M  ±  206K     1.50M  … 1.91M           0 ( 0%)        💩+7731.5% ± 1507.4%
  branch_misses      47.2M  ± 33.6K     47.2M  … 47.3M           0 ( 0%)          -  1.4% ±  1.0%
```

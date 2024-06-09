# environment

## memory 

```shell
$ dmidecode --type 17

Handle 0x003C, DMI type 17, 40 bytes
Memory Device
        Array Handle: 0x003B
        Error Information Handle: Not Provided
        Total Width: 64 bits
        Data Width: 64 bits
        Size: 16 GB
        Form Factor: SODIMM
        Set: None
        Locator: DIMM A
        Bank Locator: BANK 0
        Type: DDR4
        Type Detail: Synchronous Unbuffered (Unregistered)
        Speed: 2400 MT/s
        Manufacturer: 859B0000802C
        Serial Number: E2DB3FE1
        Asset Tag: 1A192600
        Part Number: CT16G4SFD824A.M16FE 
        Rank: 2
        Configured Memory Speed: 2400 MT/s
        Minimum Voltage: 1.2 V
        Maximum Voltage: 1.2 V
        Configured Voltage: 1.2 V

Handle 0x003D, DMI type 17, 40 bytes
Memory Device
        Array Handle: 0x003B
        Error Information Handle: Not Provided
        Total Width: 64 bits
        Data Width: 64 bits
        Size: 16 GB
        Form Factor: SODIMM
        Set: None
        Locator: DIMM B
        Bank Locator: BANK 2
        Type: DDR4
        Type Detail: Synchronous Unbuffered (Unregistered)
        Speed: 2400 MT/s
        Manufacturer: 859B0000802C
        Serial Number: E2DB3FDF
        Asset Tag: 1A192600
        Part Number: CT16G4SFD824A.M16FE 
        Rank: 2
        Configured Memory Speed: 2400 MT/s
        Minimum Voltage: 1.2 V
        Maximum Voltage: 1.2 V
        Configured Voltage: 1.2 V
```

## cpu

```shell
$ cat /proc/cpuinfo

processor       : 7
vendor_id       : GenuineIntel
cpu family      : 6
model           : 142
model name      : Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz
stepping        : 10
microcode       : 0xf4
cpu MHz         : 3400.070
cache size      : 6144 KB
physical id     : 0
siblings        : 8
core id         : 3
cpu cores       : 4
apicid          : 7
initial apicid  : 7
fpu             : yes
fpu_exception   : yes
cpuid level     : 22
wp              : yes
flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm constant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp vnmi md_clear flush_l1d arch_capabilities
vmx flags       : vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple pml ept_mode_based_exec
bugs            : cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs itlb_multihit srbds mmio_stale_data retbleed gds
bogomips        : 3600.00
clflush size    : 64
cache_alignment : 64
address sizes   : 39 bits physical, 48 bits virtual
```

## os and kernel

```shell
$ uname -a

Linux dde7afe7ebba 6.5.0-35-generic #35~22.04.1-Ubuntu SMP PREEMPT_DYNAMIC Tue May  7 09:00:52 UTC 2 x86_64 GNU/Linux

$ cat /etc/issue

Debian GNU/Linux 12

```

# results

```shell
$ lo micro-lo.js 
count_avx            time 892 rate 44821687 rate/core 44821687 ns/iter 22.31 rss 30592 usr 100 sys    0 tot 100
count_avx            time 908 rate 44029986 rate/core 44029986 ns/iter 22.71 rss 31104 usr 100 sys    0 tot 100
count_avx            time 804 rate 49733270 rate/core 50235627 ns/iter 20.10 rss 31232 usr  99 sys    0 tot  99
count_avx            time 796 rate 50206390 rate/core 50206390 ns/iter 19.91 rss 31488 usr 100 sys    0 tot 100
count_avx            time 811 rate 49298743 rate/core 49796711 ns/iter 20.28 rss 31616 usr  99 sys    0 tot  99
count_avx            time 797 rate 50139170 rate/core 50139170 ns/iter 19.94 rss 31872 usr 100 sys    0 tot 100
count_avx            time 803 rate 49766689 rate/core 50269383 ns/iter 20.09 rss 31872 usr  99 sys    0 tot  99
count_avx            time 797 rate 50147857 rate/core 50147857 ns/iter 19.94 rss 31872 usr 100 sys    0 tot 100
count_avx            time 795 rate 50274720 rate/core 50274720 ns/iter 19.89 rss 32000 usr 100 sys    0 tot 100
count_avx            time 795 rate 50284884 rate/core 50792813 ns/iter 19.88 rss 32000 usr  99 sys    0 tot  99
$ lo micro-lo-ffi.js 
count_avx ffi        time 684 rate 58400130 rate/core 58400130 ns/iter 17.12 rss 33064 usr 100 sys    0 tot 100
count_avx ffi        time 699 rate 57200184 rate/core 57200184 ns/iter 17.48 rss 33388 usr 100 sys    0 tot 100
count_avx ffi        time 717 rate 55766480 rate/core 55766480 ns/iter 17.93 rss 33644 usr 100 sys    0 tot 100
count_avx ffi        time 713 rate 56026037 rate/core 56591957 ns/iter 17.84 rss 33900 usr  99 sys    0 tot  99
count_avx ffi        time 723 rate 55255471 rate/core 55255471 ns/iter 18.09 rss 34156 usr 100 sys    0 tot 100
count_avx ffi        time 712 rate 56155023 rate/core 56722246 ns/iter 17.80 rss 34284 usr  99 sys    0 tot  99
count_avx ffi        time 717 rate 55771406 rate/core 55771406 ns/iter 17.93 rss 34284 usr 100 sys    0 tot 100
count_avx ffi        time 723 rate 55309520 rate/core 55868203 ns/iter 18.08 rss 34284 usr  99 sys    0 tot  99
count_avx ffi        time 725 rate 55128892 rate/core 55128892 ns/iter 18.13 rss 34284 usr 100 sys    0 tot 100
count_avx ffi        time 710 rate 56263982 rate/core 56832306 ns/iter 17.77 rss 34284 usr  99 sys    0 tot  99
$ node micro-napi.mjs 
count_avx            time 3587 rate 11149394 rate/core 11149394 ns/iter 89.69 rss 54656 usr 100 sys    0 tot 100
count_avx_min        time 3206 rate 12473639 rate/core 12473639 ns/iter 80.16 rss 54784 usr 100 sys    0 tot 100
count_avx            time 3602 rate 11104893 rate/core 11104893 ns/iter 90.05 rss 55032 usr 100 sys    0 tot 100
count_avx_min        time 3196 rate 12514673 rate/core 12641084 ns/iter 79.90 rss 55032 usr  99 sys    0 tot  99
count_avx            time 3573 rate 11194860 rate/core 11194860 ns/iter 89.32 rss 55032 usr 100 sys    0 tot 100
count_avx_min        time 3221 rate 12415358 rate/core 12540766 ns/iter 80.54 rss 55032 usr  99 sys    0 tot  99
count_avx            time 3537 rate 11307208 rate/core 11307208 ns/iter 88.43 rss 55032 usr 100 sys    0 tot 100
count_avx_min        time 3195 rate 12515811 rate/core 12642234 ns/iter 79.89 rss 55032 usr  99 sys    0 tot  99
count_avx            time 3534 rate 11316360 rate/core 11316360 ns/iter 88.36 rss 55032 usr 100 sys    0 tot 100
count_avx_min        time 3187 rate 12550572 rate/core 12550572 ns/iter 79.67 rss 55160 usr 100 sys    0 tot 100
$ bun micro-napi.mjs 
count_avx            time 2538 rate 15760399 rate/core 15604356 ns/iter 63.45 rss 53336 usr 101 sys    0 tot 101
count_avx_min        time 2178 rate 18362916 rate/core 18362916 ns/iter 54.45 rss 53708 usr 100 sys    0 tot 100
count_avx            time 2541 rate 15740181 rate/core 15740181 ns/iter 63.53 rss 53820 usr 100 sys    0 tot 100
count_avx_min        time 2184 rate 18311759 rate/core 18496727 ns/iter 54.60 rss 53948 usr  99 sys    0 tot  99
count_avx            time 2538 rate 15756562 rate/core 15756562 ns/iter 63.46 rss 52516 usr 100 sys    0 tot 100
count_avx_min        time 2179 rate 18353671 rate/core 18353671 ns/iter 54.48 rss 52516 usr 100 sys    0 tot 100
count_avx            time 2524 rate 15845148 rate/core 16005200 ns/iter 63.11 rss 51716 usr  99 sys    0 tot  99
count_avx_min        time 2179 rate 18351877 rate/core 18351877 ns/iter 54.49 rss 51844 usr 100 sys    0 tot 100
count_avx            time 2524 rate 15843935 rate/core 15843935 ns/iter 63.11 rss 51356 usr 100 sys    0 tot 100
count_avx_min        time 2178 rate 18365247 rate/core 18365247 ns/iter 54.45 rss 48608 usr 100 sys    0 tot 100
$ deno run -A micro-napi.mjs 
count_avx            time 5919 rate 6757302 rate/core 6757302 ns/iter 147.98 rss 52392 usr 100 sys    0 tot 100
count_avx_min        time 4938 rate 8099102 rate/core 8099102 ns/iter 123.47 rss 52520 usr 100 sys    0 tot 100
count_avx            time 5929 rate 6745650 rate/core 6745650 ns/iter 148.24 rss 52776 usr 100 sys    0 tot 100
count_avx_min        time 4909 rate 8147136 rate/core 8147136 ns/iter 122.74 rss 53032 usr 100 sys    0 tot 100
count_avx            time 5892 rate 6788305 rate/core 6856874 ns/iter 147.31 rss 53160 usr  99 sys    0 tot  99
count_avx_min        time 4874 rate 8206254 rate/core 8289146 ns/iter 121.85 rss 53160 usr  99 sys    0 tot  99
count_avx            time 5889 rate 6791596 rate/core 6791596 ns/iter 147.24 rss 53160 usr 100 sys    0 tot 100
count_avx_min        time 4876 rate 8203018 rate/core 8203018 ns/iter 121.90 rss 53160 usr 100 sys    0 tot 100
count_avx            time 5893 rate 6786645 rate/core 6855197 ns/iter 147.34 rss 53160 usr  99 sys    0 tot  99
count_avx_min        time 4868 rate 8215517 rate/core 8215517 ns/iter 121.72 rss 53160 usr 100 sys    0 tot 100
$ bun micro-bun-ffi.js 
memcount_avx2        time 2336 rate 17117883 rate/core 16459503 ns/iter 58.41 rss 91936 usr 102 sys    1 tot 104
memcount_avx2        time 2363 rate 16920776 rate/core 16588997 ns/iter 59.09 rss 92676 usr 101 sys    1 tot 102
memcount_avx2        time 2316 rate 17265835 rate/core 17094887 ns/iter 57.91 rss 92804 usr  98 sys    3 tot 101
memcount_avx2        time 2333 rate 17138516 rate/core 16968828 ns/iter 58.34 rss 92676 usr 101 sys    0 tot 101
memcount_avx2        time 2326 rate 17193010 rate/core 17022783 ns/iter 58.16 rss 92432 usr 101 sys    0 tot 101
memcount_avx2        time 2291 rate 17456674 rate/core 17114387 ns/iter 57.28 rss 88172 usr 101 sys    0 tot 102
memcount_avx2        time 2301 rate 17380729 rate/core 17039931 ns/iter 57.53 rss 88172 usr  99 sys    2 tot 102
memcount_avx2        time 2310 rate 17314893 rate/core 17143459 ns/iter 57.75 rss 88172 usr 100 sys    1 tot 101
memcount_avx2        time 2318 rate 17253097 rate/core 17082275 ns/iter 57.96 rss 88172 usr  98 sys    3 tot 101
memcount_avx2        time 2317 rate 17258090 rate/core 17087218 ns/iter 57.94 rss 88172 usr 100 sys    0 tot 101
$ deno run -A --unstable-ffi micro-deno-ffi.js 
memcount_avx2        time 857 rate 46621510 rate/core 45707363 ns/iter 21.44 rss 51756 usr 102 sys    0 tot 102
memcount_avx2        time 802 rate 49843196 rate/core 49843196 ns/iter 20.06 rss 51884 usr 100 sys    0 tot 100
memcount_avx2        time 811 rate 49267078 rate/core 49764726 ns/iter 20.29 rss 51884 usr  99 sys    0 tot  99
memcount_avx2        time 795 rate 50256402 rate/core 50256402 ns/iter 19.89 rss 52140 usr 100 sys    0 tot 100
memcount_avx2        time 801 rate 49922899 rate/core 50427171 ns/iter 20.03 rss 52268 usr  99 sys    0 tot  99
memcount_avx2        time 791 rate 50545241 rate/core 51055799 ns/iter 19.78 rss 52268 usr  99 sys    0 tot  99
memcount_avx2        time 800 rate 49953341 rate/core 50457921 ns/iter 20.01 rss 52268 usr  99 sys    0 tot  99
memcount_avx2        time 806 rate 49573229 rate/core 49573229 ns/iter 20.17 rss 52396 usr 100 sys    0 tot 100
memcount_avx2        time 812 rate 49232599 rate/core 49729898 ns/iter 20.31 rss 52396 usr  99 sys    0 tot  99
memcount_avx2        time 802 rate 49850494 rate/core 50354035 ns/iter 20.05 rss 52396 usr  99 sys    0 tot  99
```

## summary

```shell
size 128
lines 4

lo-binding 19.88
lo-ffi 17.48
node-napi 88.36
node-napi-min 79.67
bun-napi 63.11
bun-napi-min 54.49
deno-napi 147.24
deno-napi-min 121.72
bun-ffi 57.28
deno-ffi 19.78

```

## chart

```shell

```

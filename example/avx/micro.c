#include "x86intrin.h"
#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <fcntl.h>
#include <assert.h>
#include <sys/mman.h>
#include <unistd.h>
#include <time.h>
#include <errno.h>
#include <signal.h>
#include <string.h>

#define _AD "\e[0;0m"
#define _AR "\e[0;31m"
#define _AG "\e[0;32m"
#define _AY "\e[0;33m"
#define _AM "\e[0;35m"

char* buf = 0;

void process_memory_usage(unsigned long *rss, unsigned long *usr, unsigned long *sys) {
  char buf[1024];
  const char* s = NULL;
  ssize_t n = 0;
  int fd = 0;
  int i = 0;
  do {
    fd = open("/proc/thread-self/stat", O_RDONLY);
  } while (fd == -1 && errno == EINTR);
  if (fd == -1) return;
  do
    n = read(fd, buf, sizeof(buf) - 1);
  while (n == -1 && errno == EINTR);
  close(fd);
  if (n == -1)
    return;
  buf[n] = '\0';
  s = strchr(buf, ' ');
  if (s == NULL)
    goto err;
  s += 1;
  if (*s != '(')
    goto err;
  s = strchr(s, ')');
  if (s == NULL)
    goto err;
  for (i = 1; i <= 22; i++) {
    s = strchr(s + 1, ' ');
    if (s == NULL)
      goto err;
    if (i == 12) {
      *usr = (strtoul(s, NULL, 10));
    }
    if (i == 13) {
      *sys = (strtoul(s, NULL, 10));
    }
    if (i == 22) {
      *rss = (strtoul(s, NULL, 10) * (unsigned long)getpagesize()) / 1024;
    }
  }
err:
}

static inline uint64_t getns(void)
{
  struct timespec ts;
  int ret = clock_gettime(CLOCK_MONOTONIC, &ts);
  assert(ret == 0);
  return (((uint64_t)ts.tv_sec) * 1000000000ULL) + ts.tv_nsec;
}

// https://gist.github.com/powturbo/2b06a84b6008dfffef11e53edba297d3

size_t avxcountu3(const char *ss, size_t n)
{
  int c = 10;
  __m256i cv = _mm256_set1_epi8(c), zv = _mm256_setzero_si256(), sum = zv, acr0, acr1, acr2, acr3;
  const char *p, *pe;
  for (p = ss; p != ss + (n - (n % (252 * 32)));)
  {
    for (acr0 = acr1 = acr2 = acr3 = zv, pe = p + 252 * 32; p != pe; p += 128)
    {
      acr0 = _mm256_add_epi8(acr0, _mm256_cmpeq_epi8(cv, _mm256_lddqu_si256((const __m256i *)p)));
      acr1 = _mm256_add_epi8(acr1, _mm256_cmpeq_epi8(cv, _mm256_lddqu_si256((const __m256i *)(p + 32))));
      acr2 = _mm256_add_epi8(acr2, _mm256_cmpeq_epi8(cv, _mm256_lddqu_si256((const __m256i *)(p + 64))));
      acr3 = _mm256_add_epi8(acr3, _mm256_cmpeq_epi8(cv, _mm256_lddqu_si256((const __m256i *)(p + 96))));
      __builtin_prefetch(p + 1024);
    }
    sum = _mm256_add_epi64(sum, _mm256_sad_epu8(_mm256_sub_epi8(zv, acr0), zv));
    sum = _mm256_add_epi64(sum, _mm256_sad_epu8(_mm256_sub_epi8(zv, acr1), zv));
    sum = _mm256_add_epi64(sum, _mm256_sad_epu8(_mm256_sub_epi8(zv, acr2), zv));
    sum = _mm256_add_epi64(sum, _mm256_sad_epu8(_mm256_sub_epi8(zv, acr3), zv));
  }
  for (acr0 = zv; p + 32 < ss + n; p += 32)
    acr0 = _mm256_add_epi8(acr0, _mm256_cmpeq_epi8(cv, _mm256_lddqu_si256((const __m256i *)p)));
  sum = _mm256_add_epi64(sum, _mm256_sad_epu8(_mm256_sub_epi8(zv, acr0), zv));
  size_t count = _mm256_extract_epi64(sum, 0) + _mm256_extract_epi64(sum, 1) + _mm256_extract_epi64(sum, 2) + _mm256_extract_epi64(sum, 3);
  while (p != ss + n)
    count += *p++ == c;
  return count;
}

int read_file(const char *filename)
{
  int fd = open(filename, O_RDONLY);
  assert(fd > 2);
  size_t bytes = read(fd, buf, 2 * 1024 * 1024);
  close(fd);
  return bytes;
}

int main(int argc, char **argv)
{
  char *filename = "/dev/shm/test.log";
  char* AD = isatty(STDOUT_FILENO) ? _AD : "";
  char* AR = isatty(STDOUT_FILENO) ? _AR : "";
  char* AG = isatty(STDOUT_FILENO) ? _AG : "";
  char* AY = isatty(STDOUT_FILENO) ? _AY : "";
  char* AM = isatty(STDOUT_FILENO) ? _AM : "";
  int runs = 40000000;
  if (argc > 1) 
    runs = atoi(argv[1]);
  if (argc > 2)
    filename = argv[2];
  buf = (char *)mmap(0, 2 * 1024 * 1024, PROT_READ | PROT_WRITE, MAP_ANONYMOUS | MAP_PRIVATE, -1, 0);
  assert(madvise(buf, 2 * 1024 * 1024, MADV_HUGEPAGE) == 0);
  size_t bytes = read_file(filename);
  size_t expected = avxcountu3(buf, bytes);
  printf("bytes %lu\n", bytes);
  printf("lines %lu\n", expected);
  unsigned long rss = 0;
  unsigned long usr = 0;
  unsigned long sys = 0;
  unsigned long last_usr = 0;
  unsigned long last_sys = 0;
  for (int j = 0; j < 10; j++) {
    uint64_t start = getns();
    for (int i = 0; i < runs; i++) {
      assert(avxcountu3(buf, bytes) == expected);
    }
    uint64_t elapsed = getns() - start;
    float seconds = (float)elapsed / 1000000000;
    process_memory_usage(&rss, &usr, &sys);
    float usr_pc = (usr - last_usr) / seconds;
    float sys_pc = (sys - last_sys) / seconds;
    float tot_pc = usr_pc + sys_pc;
    last_usr = usr;
    last_sys = sys;
    float rate = (float)runs / seconds;
    float rate_pc = (float)rate / (tot_pc / 100.0);
    float ns_iter = (float)elapsed / runs;
    fprintf(stderr, "%s%-20s%s %stime%s %8lu %srate%s %10lu %srate/core%s %10lu %sns/iter%s %12.2f %srss%s % 8lu %susr%s %6.2f %ssys%s %6.2f %stot%s %6.2f\n", AM, "avxcountu3", AD, AY, AD, elapsed / 1000000, AY, AD, (unsigned long)rate, AM, AD, (unsigned long)rate_pc, AG, AD, ns_iter, AG, AD, rss, AG, AD, usr_pc, AR, AD, sys_pc, AY, AD, tot_pc);
  }
}

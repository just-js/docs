#include "x86intrin.h"
#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <fcntl.h>
#include <assert.h>
#include <sys/mman.h>
#include <unistd.h>
#include <time.h>

char* buf = 0;

static inline uint64_t getns(void)
{
  struct timespec ts;
  int ret = clock_gettime(CLOCK_MONOTONIC, &ts);
  assert(ret == 0);
  return (((uint64_t)ts.tv_sec) * 1000000000ULL) + ts.tv_nsec;
}

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

int count_lines(const char *filename)
{
  int fd = open(filename, O_RDWR);
  assert(fd > 2);
  size_t bytes = read(fd, buf, 2 * 1024 * 1024);
  int count = 0;
  while (bytes > 0)
  {
    count += avxcountu3(buf, bytes);
    bytes = read(fd, buf, 2 * 1024 * 1024);
  }
  return count;
}

int main(int argc, char **argv)
{
  char *filename = "/dev/shm/test.log";
  if (argc > 1)
    filename = argv[1];
  buf = (char *)mmap(0, 2 * 1024 * 1024, PROT_READ | PROT_WRITE, MAP_ANONYMOUS | MAP_PRIVATE, -1, 0);
  assert(madvise(buf, 2 * 1024 * 1024, MADV_HUGEPAGE) == 0);
  size_t expected = count_lines(filename);
  printf("%lu\n", expected);
  while (1)
  {
    uint64_t start = getns();
    assert(count_lines(filename) == expected);
    fprintf(stderr, "time %lu ns\n", getns() - start);
  }
}

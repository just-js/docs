#include "x86intrin.h"
#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <fcntl.h>
#include <assert.h>
#include <sys/mman.h>
#include <unistd.h>

// https://github.com/lemire/Code-used-on-Daniel-Lemire-s-blog/blob/master/2017/02/14/newlines.c

size_t avxcountu2(const char * buffer, size_t size) {
  size_t answer = 0;
  __m256i cnt = _mm256_setzero_si256();
  __m256i newline = _mm256_set1_epi8('\n');
  size_t i = 0;
  uint8_t tmpbuffer[sizeof(__m256i)];
  while( i + 32 <= size ) {
    size_t remaining = size - i;
    size_t howmanytimes =  remaining / 32;
    if(howmanytimes > 256) howmanytimes = 256;
    const __m256i * buf = (const __m256i *) (buffer + i);
    size_t j = 0;
    __m256i cnt1 = _mm256_setzero_si256();
    __m256i cnt2 = _mm256_setzero_si256();
    __m256i cnt3 = _mm256_setzero_si256();
    __m256i cnt4 = _mm256_setzero_si256();
    for (; j + 3 <  howmanytimes; j+= 4) {
      __m256i newdata1 = _mm256_lddqu_si256(buf + j);
      __m256i newdata2 = _mm256_lddqu_si256(buf + j + 1);
      __m256i newdata3 = _mm256_lddqu_si256(buf + j + 2);
      __m256i newdata4 = _mm256_lddqu_si256(buf + j + 3);
      __m256i cmp1 = _mm256_cmpeq_epi8(newline,newdata1);
      __m256i cmp2 = _mm256_cmpeq_epi8(newline,newdata2);
      __m256i cmp3 = _mm256_cmpeq_epi8(newline,newdata3);
      __m256i cmp4 = _mm256_cmpeq_epi8(newline,newdata4);
      cnt1 = _mm256_add_epi8(cmp1,cnt1);
      cnt2 = _mm256_add_epi8(cmp2,cnt2);
      cnt3 = _mm256_add_epi8(cmp3,cnt3);
      cnt4 = _mm256_add_epi8(cmp4,cnt4);
    }
    cnt1 = _mm256_add_epi8(cnt2,cnt1);
    cnt3 = _mm256_add_epi8(cnt4,cnt3);
    cnt = _mm256_add_epi8(cnt1,cnt3); 
    for (; j <  howmanytimes; j++) {
      __m256i newdata = _mm256_lddqu_si256(buf + j);
      __m256i cmp = _mm256_cmpeq_epi8(newline,newdata);
      cnt = _mm256_add_epi8(cnt,cmp);
    }
    i += howmanytimes * 32;
    cnt = _mm256_subs_epi8(_mm256_setzero_si256(),cnt);
    _mm256_storeu_si256((__m256i *) tmpbuffer,cnt);
    for(int k = 0; k < sizeof(__m256i); ++k) answer += tmpbuffer[k];
    cnt = _mm256_setzero_si256();
  }
  for(; i < size; i++)
    if(buffer[i] == '\n') answer ++;
  return answer;
}

size_t avxcountu3(const char * ss, size_t n) {
  int c = 10;
  __m256i cv = _mm256_set1_epi8(c), zv = _mm256_setzero_si256(), sum = zv, acr0,acr1,acr2,acr3;
  const char *p,*pe;
for(p = ss; p != ss+(n- (n % (252*32)));) { 
  for(acr0 = acr1 = acr2 = acr3 = zv,pe = p+252*32; p != pe; p += 128) { 
  acr0 = _mm256_add_epi8(acr0, _mm256_cmpeq_epi8(cv, _mm256_lddqu_si256((const __m256i *)p))); 
  acr1 = _mm256_add_epi8(acr1, _mm256_cmpeq_epi8(cv, _mm256_lddqu_si256((const __m256i *)(p+32)))); 
  acr2 = _mm256_add_epi8(acr2, _mm256_cmpeq_epi8(cv, _mm256_lddqu_si256((const __m256i *)(p+64)))); 
  acr3 = _mm256_add_epi8(acr3, _mm256_cmpeq_epi8(cv, _mm256_lddqu_si256((const __m256i *)(p+96)))); __builtin_prefetch(p+1024);
  }
    sum = _mm256_add_epi64(sum, _mm256_sad_epu8(_mm256_sub_epi8(zv, acr0), zv));
    sum = _mm256_add_epi64(sum, _mm256_sad_epu8(_mm256_sub_epi8(zv, acr1), zv));
    sum = _mm256_add_epi64(sum, _mm256_sad_epu8(_mm256_sub_epi8(zv, acr2), zv));
    sum = _mm256_add_epi64(sum, _mm256_sad_epu8(_mm256_sub_epi8(zv, acr3), zv));
  }	
  for(acr0=zv; p+32 < ss + n; p += 32)  
    acr0 = _mm256_add_epi8(acr0, _mm256_cmpeq_epi8(cv, _mm256_lddqu_si256((const __m256i *)p))); 
  sum = _mm256_add_epi64(sum, _mm256_sad_epu8(_mm256_sub_epi8(zv, acr0), zv));
  size_t count = _mm256_extract_epi64(sum, 0) + _mm256_extract_epi64(sum, 1) + _mm256_extract_epi64(sum, 2) + _mm256_extract_epi64(sum, 3);   
  while(p != ss + n) count += *p++ == c;
  return count;
}

int main (int argc, char** argv) {
  char* filename = "/dev/shm/test.log";
  if (argc > 1) {
    filename = argv[1];
  }
  int fd = open(filename, O_RDWR);
  assert(fd > 2);
  char* buf = (char*)mmap(0, 2 * 1024 * 1024, PROT_READ | PROT_WRITE ,MAP_ANONYMOUS | MAP_PRIVATE, -1, 0);
  assert(madvise(buf, 2 * 1024 * 1024, MADV_HUGEPAGE) == 0);
  size_t bytes = read(fd, buf, 2 * 1024 * 1024);
  int count = 0;
  while (bytes > 0) {
    count += avxcountu3(buf, bytes);
    bytes = read(fd, buf, 2 * 1024 * 1024);
  }
  fprintf(stderr, "%u\n", count);
}

const api = {
  count_avx: {
    parameters: ['pointer', 'i32', 'u32'],
    result: 'u32',
    name: 'memcount_avx2'
  },
  count_sse: {
    parameters: ['pointer', 'i32', 'u32'],
    result: 'u32',
    name: 'memcount_sse2'
  },
  test: {
    parameters: [],
    result: 'i32'
  }
}

const preamble = `
#include <immintrin.h>

// https://gist.github.com/powturbo/2b06a84b6008dfffef11e53edba297d3

size_t memcount_avx2(const void *s, int c, size_t n) {    
    __m256i cv = _mm256_set1_epi8(c), zv = _mm256_setzero_si256(), sum = zv, acr0,acr1,acr2,acr3;
    const char *p,*pe;
  const char* ss = (const char*)s;		    											   
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

size_t memcount_sse2(const void *s, int c, size_t n) {    
    __m128i cv = _mm_set1_epi8(c), sum = _mm_setzero_si128(), acr0,acr1,acr2,acr3;
    const char *p,*pe;						    											   
  const char* ss = (const char*)s;		    											   
	for(p = ss; p != ss+(n- (n % (252*16)));) { 
	  for(acr0 = acr1 = acr2 = acr3 = _mm_setzero_si128(),pe = p+252*16; p != pe; p += 64) { 
		acr0 = _mm_add_epi8(acr0, _mm_cmpeq_epi8(cv, _mm_loadu_si128((const __m128i *)p))); 
		acr1 = _mm_add_epi8(acr1, _mm_cmpeq_epi8(cv, _mm_loadu_si128((const __m128i *)(p+16)))); 
		acr2 = _mm_add_epi8(acr2, _mm_cmpeq_epi8(cv, _mm_loadu_si128((const __m128i *)(p+32)))); 
		acr3 = _mm_add_epi8(acr3, _mm_cmpeq_epi8(cv, _mm_loadu_si128((const __m128i *)(p+48)))); __builtin_prefetch(p+1024);
	  }
      sum = _mm_add_epi64(sum, _mm_sad_epu8(_mm_sub_epi8(_mm_setzero_si128(), acr0), _mm_setzero_si128()));
      sum = _mm_add_epi64(sum, _mm_sad_epu8(_mm_sub_epi8(_mm_setzero_si128(), acr1), _mm_setzero_si128()));
      sum = _mm_add_epi64(sum, _mm_sad_epu8(_mm_sub_epi8(_mm_setzero_si128(), acr2), _mm_setzero_si128()));
      sum = _mm_add_epi64(sum, _mm_sad_epu8(_mm_sub_epi8(_mm_setzero_si128(), acr3), _mm_setzero_si128()));
    }
    size_t count = _mm_extract_epi64(sum, 0) + _mm_extract_epi64(sum, 1);   
    while(p != ss + n) count += *p++ == c;
    return count;
}

int test () {
  return 1;
}
`

const name = 'memcount'

const constants = {}

export { name, api, constants, preamble }

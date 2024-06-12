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

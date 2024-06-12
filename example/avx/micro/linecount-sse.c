#include <smmintrin.h>

size_t memcount_avx2(const void *s, int c, size_t n) {    
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

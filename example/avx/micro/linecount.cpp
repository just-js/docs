#include <node_api.h>
#include <immintrin.h>
#include <stdio.h>

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

napi_value CountAvx(napi_env env, napi_callback_info args) {
    size_t argc = 3;
    napi_value argv[3];
    napi_get_cb_info(env, args, &argc, argv, nullptr, nullptr);
    if (argc < 3) {
      napi_throw_type_error(env, nullptr, "Expected three arguments");
      return nullptr;
    }

    napi_valuetype valuetype1, valuetype2;
    napi_typeof(env, argv[1], &valuetype1);
    napi_typeof(env, argv[2], &valuetype2);
    if (valuetype1 != napi_number || valuetype2 != napi_number) {
      napi_throw_type_error(env, nullptr, "Expected 2nd and 3rd arguments to be numbers");
      return nullptr;
    }

    size_t len = 0;
    void* data = nullptr;
    napi_typedarray_type tp;
    napi_status status;
    int c = 0;
    uint32_t n = 0;
    napi_value result;
    status = napi_get_typedarray_info(env, argv[0], &tp, &len, &data, 0, 0);
    if (status != napi_ok) {
      napi_throw_type_error(env, nullptr, "Expected 1st argument to be a TypedArray");
      return nullptr;
    }
    napi_get_value_int32(env, argv[1], &c);
    napi_get_value_uint32(env, argv[2], &n);
    size_t line_count = memcount_avx2(data, c, n);
    napi_create_uint32(env, line_count, &result);
    return result;
}

napi_value CountAvxMin(napi_env env, napi_callback_info args) {
    size_t argc = 3;
    napi_value argv[3];
    napi_get_cb_info(env, args, &argc, argv, nullptr, nullptr);
    if (argc < 3) {
      napi_throw_type_error(env, nullptr, "Expected three arguments");
      return nullptr;
    }
    size_t len = 0;
    void* data = nullptr;
    napi_typedarray_type tp;
    napi_status status;
    int c = 0;
    uint32_t n = 0;
    napi_value result;
    status = napi_get_typedarray_info(env, argv[0], &tp, &len, &data, 0, 0);
    if (status != napi_ok) {
      napi_throw_type_error(env, nullptr, "Expected 1st argument to be a TypedArray");
      return nullptr;
    }
    napi_get_value_int32(env, argv[1], &c);
    napi_get_value_uint32(env, argv[2], &n);
    size_t line_count = memcount_avx2(data, c, n);
    napi_create_uint32(env, line_count, &result);
    return result;
}

napi_value Test(napi_env env, napi_callback_info args) {
  napi_value result;
  napi_create_int32(env, 1, &result);
  return result;
}

napi_value Init(napi_env env, napi_value exports) {
    napi_status status;

    napi_value count_fn;
    status = napi_create_function(env, nullptr, 0, CountAvx, nullptr, &count_fn);
    if (status != napi_ok) return NULL;
    status = napi_set_named_property(env, exports, "count_avx", count_fn);
    if (status != napi_ok) return NULL;

    napi_value count_min_fn;
    status = napi_create_function(env, nullptr, 0, CountAvxMin, nullptr, &count_min_fn);
    if (status != napi_ok) return NULL;
    status = napi_set_named_property(env, exports, "count_avx_min", count_min_fn);
    if (status != napi_ok) return NULL;

    napi_value test_fn;
    status = napi_create_function(env, nullptr, 0, Test, nullptr, &test_fn);
    if (status != napi_ok) return NULL;
    status = napi_set_named_property(env, exports, "test", test_fn);
    if (status != napi_ok) return NULL;

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)

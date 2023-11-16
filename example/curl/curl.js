import { bind } from 'lib/ffi.js'

const { assert, wrap, args, core } = lo
const {
  dlopen, dlsym, open, dup2,
  O_WRONLY, O_CREAT, O_TRUNC,
  S_IRUSR, S_IWUSR, S_IRGRP, S_IROTH
} = core

const defaultWriteFlags = O_WRONLY | O_CREAT | O_TRUNC
const defaultWriteMode = S_IRUSR | S_IWUSR | S_IRGRP | S_IROTH
const CURL_GLOBAL_DEFAULT = 3
const CURLOPT_URL = 10002
const CURLOPT_BUFFERSIZE = 98
const CURLOPT_HTTP_VERSION = 84
const CURL_HTTP_VERSION_1_1 = 2
const CURLOPT_FOLLOWLOCATION = 52

const handle = assert(dlopen(`libcurl.${core.os === 'mac' ? 'dylib': 'so'}`, 1))

const curl_global_init = bind(assert(dlsym(handle, 'curl_global_init')), 
  'i32', ['u32'])
const curl_easy_init = wrap(new Uint32Array(2), bind(assert(dlsym(handle, 
  'curl_easy_init')), 'pointer', []), 0)
const curl_easy_setopt = bind(assert(dlsym(handle, 'curl_easy_setopt')), 'i32', 
  ['pointer', 'u32', 'string'])
const curl_easy_setopt2 = bind(assert(dlsym(handle, 'curl_easy_setopt')), 'i32', 
  ['pointer', 'u32', 'u32'])
const curl_easy_perform = bind(assert(dlsym(handle, 'curl_easy_perform')), 
  'i32', ['pointer'])
const curl_easy_cleanup = bind(assert(dlsym(handle, 'curl_easy_cleanup')), 
  'i32', ['pointer'])
const curl_global_cleanup = bind(assert(dlsym(handle, 'curl_global_cleanup')), 
  'i32', [])

const [ 
  url = 'https://codeload.github.com/just-js/lo/tar.gz/refs/tags/0.0.3-pre', 
  file_name = '--' 
] = args.slice(2)

if (file_name !== '--') {
  const fd = open(file_name, defaultWriteFlags, defaultWriteMode)
  assert(fd > 2)
  dup2(fd, 1)
}

assert(curl_global_init(CURL_GLOBAL_DEFAULT) === 0)
const curl = assert(curl_easy_init())
assert(curl_easy_setopt2(curl, CURLOPT_BUFFERSIZE, 65536) === 0)
assert(curl_easy_setopt2(curl, CURLOPT_FOLLOWLOCATION, 1) === 0)
assert(curl_easy_setopt2(curl, CURLOPT_HTTP_VERSION, 
  CURL_HTTP_VERSION_1_1) === 0)
assert(curl_easy_setopt(curl, CURLOPT_URL, url) === 0)
assert(curl_easy_perform(curl) === 0)
curl_easy_cleanup(curl)
curl_global_cleanup()

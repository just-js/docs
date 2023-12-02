# docker image for running lo with all bindings compiled

This is a Dockerfile which we will use to 
- download latest lo release or download the lo source
- build lo locally
- build all the current bindings embedded in lo runtime
- install any dependencies required by bindings

To build the docker image:

```
docker build -t lo -f Dockerfile.debian-build .
```

To run the image with current directory mounted to /app

```
docker run -it --rm -v $(pwd):/app lo
```

Then, inside the container, we can run the dump.js script to check all the
bindings are loadable

```
lo dump.js
```

we should see something like this

```bash
core (internal)
  F_OK: Number = 0
  NAME_MAX: Number = 255
  O_CLOEXEC: Number = 524288
  O_CREAT: Number = 64
  O_RDONLY: Number = 0
  O_RDWR: Number = 2
  O_TRUNC: Number = 512
  O_WRONLY: Number = 1
  RUSAGE_SELF: Number = 0
  SEEK_CUR: Number = 1
  SEEK_END: Number = 2
  SEEK_SET: Number = 0
  STDERR: Number = 2
  STDIN: Number = 0
  STDOUT: Number = 1
  S_IFBLK: Number = 24576
  S_IFCHR: Number = 8192
  S_IFDIR: Number = 16384
  S_IFIFO: Number = 4096
  S_IFMT: Number = 61440
  S_IFREG: Number = 32768
  S_IRGRP: Number = 32
  S_IROTH: Number = 4
  S_IRUSR: Number = 256
  S_IRWXG: Number = 56
  S_IRWXO: Number = 7
  S_IRWXU: Number = 448
  S_IWGRP: Number = 16
  S_IWOTH: Number = 2
  S_IWUSR: Number = 128
  S_IXOTH: Number = 1
  access: Function (string, i32) -> i32
  bind_fastcall: Function () -> undefined
  bind_slowcall: Function () -> undefined
  calloc: Function (u32, u32) -> pointer
  chdir: Function (string) -> i32
  close: Function (i32) -> i32
  closedir: Function (pointer) -> i32
  dlclose: Function (pointer) -> i32
  dlopen: Function (string, i32) -> pointer
  dlsym: Function (pointer, string) -> pointer
  dup: Function (i32) -> i32
  dup2: Function (i32, i32) -> i32
  execve: Function (string, buffer, buffer) -> i32
  execvp: Function (string, buffer) -> i32
  fastcall: Function (pointer) -> void
  fchdir: Function (i32) -> i32
  fcntl: Function (i32, i32, i32) -> i32
  fork: Function () -> i32
  free: Function (pointer) -> void
  fstat: Function (i32, buffer) -> i32
  getcwd: Function (pointer, i32) -> pointer
  getenv: Function (string) -> pointer
  getpid: Function () -> i32
  getrusage: Function (i32, buffer) -> i32
  isolate_context_create: Function (i32, pointer, string, u32, string, u32, pointer, i32, i32, u64, string, string, i32, i32, pointer, buffer) -> void
  isolate_context_destroy: Function (buffer) -> void
  isolate_context_size: Function () -> i32
  isolate_create: Function (i32, u32array, string, u32, string, u32, buffer, i32, i32, u64, string, string, i32, i32, pointer) -> i32
  isolate_start: Function (buffer) -> void
  kill: Function (i32, i32) -> i32
  lseek: Function (i32, u32, i32) -> u32
  lstat: Function (string, buffer) -> i32
  memcpy: Function (pointer, pointer, u32) -> pointer
  memmove: Function (pointer, pointer, u32) -> pointer
  mkdir: Function (string, u32) -> i32
  mmap: Function (pointer, u32, i32, i32, i32, u32) -> pointer
  mprotect: Function (pointer, u32, i32) -> i32
  open: Function (string, i32, i32) -> i32
  opendir: Function (string) -> pointer
  pread: Function (i32, buffer, i32, u32) -> i32
  read: Function (i32, buffer, i32) -> i32
  readdir: Function (pointer) -> pointer
  readlink: Function (string, buffer, u32) -> u32
  rename: Function (string, string) -> i32
  rmdir: Function (string) -> i32
  setenv: Function (string, string, i32) -> i32
  sleep: Function (i32) -> void
  stat: Function (string, buffer) -> i32
  strnlen: Function (pointer, u32) -> u32
  times: Function (buffer) -> i32
  unlink: Function (string) -> i32
  unsetenv: Function (string) -> i32
  usleep: Function (u32) -> i32
  waitpid: Function (i32, buffer, i32) -> i32
  write: Function (i32, buffer, i32) -> i32
  write_string: Function (i32, string, i32) -> i32
curl (internal)
  CURLINFO_OFF_T: Number = 6291456
  CURLINFO_RESPONSE_CODE: Number = 2097154
  CURLINFO_SIZE_DOWNLOAD_T: Number = 6291464
  CURLOPT_BUFFERSIZE: Number = 98
  CURLOPT_FAILONERROR: Number = 45
  CURLOPT_FOLLOWLOCATION: Number = 52
  CURLOPT_HTTP_VERSION: Number = 84
  CURLOPT_URL: Number = 10002
  CURLOPT_WRITEDATA: Number = 10001
  CURLOPT_WRITEFUNCTION: Number = 20011
  CURL_GLOBAL_DEFAULT: Number = 3
  CURL_HTTP_VERSION_1_1: Number = 2
  easy_cleanup: Function (pointer) -> void
  easy_getinfo: Function (pointer, u32, u32array) -> i32
  easy_init: Function () -> pointer
  easy_perform: Function (pointer) -> i32
  easy_setopt: Function (pointer, u32, string) -> i32
  easy_setopt_2: Function (pointer, u32, u32) -> i32
  easy_setopt_3: Function (pointer, u32, u64) -> i32
  fclose: Function (pointer) -> i32
  fopen: Function (string, string) -> pointer
  global_cleanup: Function () -> void
  global_init: Function (u32) -> i32
encode (external)
  base64_decode: Function (buffer, u32, buffer, u32) -> u32
  base64_encode: Function (buffer, u32, buffer, u32) -> u32
  hex_decode: Function (buffer, u32, buffer, u32) -> u32
  hex_encode: Function (buffer, u32, buffer, u32) -> u32
epoll (external)
  close: Function (i32) -> i32
  create: Function (i32) -> i32
  modify: Function (i32, i32, i32, buffer) -> i32
  wait: Function (i32, buffer, i32, i32) -> i32
inflate (internal)
  inflate: Function (buffer, u32, buffer, u32) -> i32
libffi (external)
  bindFastApi: Function () -> undefined
  bindSlowApi: Function () -> undefined
  ffi_call: Function (buffer, pointer, u32array, buffer) -> void
  ffi_prep_cif: Function (buffer, u32, u32, buffer, buffer) -> i32
libssl (external)
  BIO_ctrl: Function (pointer, i32, u64, pointer) -> i32
  BIO_new: Function (pointer) -> pointer
  BIO_new_mem_buf: Function (pointer, i32) -> pointer
  BIO_read: Function (pointer, pointer, i32) -> i32
  BIO_s_mem: Function () -> pointer
  EVP_Digest: Function (buffer, u32, buffer, buffer, pointer, pointer) -> i32
  EVP_DigestFinal: Function (pointer, buffer, u32array) -> i32
  EVP_DigestInit_ex: Function (pointer, pointer, pointer) -> i32
  EVP_DigestSignFinal: Function (pointer, pointer, pointer) -> i32
  EVP_DigestSignInit: Function (pointer, pointer, pointer, pointer, pointer) -> i32
  EVP_DigestUpdate: Function (pointer, pointer, u32) -> i32
  EVP_DigestUpdateBuffer: Function (pointer, buffer, u32) -> i32
  EVP_DigestUpdateString: Function (pointer, string, u32) -> i32
  EVP_DigestVerifyFinal: Function (pointer, pointer, u32) -> i32
  EVP_DigestVerifyInit: Function (pointer, pointer, pointer, pointer, pointer) -> i32
  EVP_MD_CTX_free: Function (pointer) -> void
  EVP_MD_CTX_new: Function () -> pointer
  EVP_MD_CTX_reset: Function (pointer) -> i32
  EVP_PKEY_CTX_free: Function (pointer) -> void
  EVP_PKEY_CTX_new_id: Function (i32, pointer) -> pointer
  EVP_PKEY_free: Function (pointer) -> void
  EVP_PKEY_id: Function (pointer) -> i32
  EVP_PKEY_keygen: Function (pointer, pointer) -> i32
  EVP_PKEY_keygen_init: Function (pointer) -> i32
  EVP_PKEY_new: Function () -> pointer
  EVP_PKEY_type: Function (i32) -> i32
  EVP_get_digestbyname: Function (string) -> pointer
  EVP_get_digestbynid: Function (i32) -> pointer
  EVP_sha1: Function () -> pointer
  EVP_sha224: Function () -> pointer
  EVP_sha256: Function () -> pointer
  EVP_sha384: Function () -> pointer
  EVP_sha512: Function () -> pointer
  EVP_sha512_224: Function () -> pointer
  EVP_sha512_256: Function () -> pointer
  OBJ_txt2nid: Function (pointer) -> i32
  OPENSSL_init_ssl: Function (u64, pointer) -> i32
  OpenSSL_version: Function (i32) -> pointer
  PEM_read_bio_X509: Function (pointer, pointer, pointer, pointer) -> pointer
  PEM_write_bio_PUBKEY: Function (pointer, pointer) -> i32
  PEM_write_bio_PrivateKey: Function (pointer, pointer, pointer, pointer, i32, pointer, pointer) -> i32
  PEM_write_bio_X509_REQ: Function (pointer, pointer) -> i32
  RSA_pkey_ctx_ctrl: Function (pointer, i32, i32, i32, pointer) -> i32
  SSL_CIPHER_get_name: Function (pointer) -> pointer
  SSL_CTX_free: Function (pointer) -> void
  SSL_CTX_new: Function (pointer) -> pointer
  SSL_CTX_set_cipher_list: Function (pointer, string) -> i32
  SSL_CTX_set_ciphersuites: Function (pointer, string) -> i32
  SSL_CTX_set_options: Function (pointer, u64) -> u64
  SSL_CTX_use_PrivateKey_file: Function (pointer, pointer, i32) -> i32
  SSL_CTX_use_certificate_chain_file: Function (pointer, pointer) -> i32
  SSL_CTX_use_certificate_file: Function (pointer, pointer, i32) -> i32
  SSL_OP_ALL: BigInt = 2147485776
  SSL_OP_NO_COMPRESSION: BigInt = 131072
  SSL_OP_NO_DTLSv1: BigInt = 67108864
  SSL_OP_NO_DTLSv1_2: BigInt = 134217728
  SSL_OP_NO_RENEGOTIATION: BigInt = 1073741824
  SSL_OP_NO_SSLv2: BigInt = 0
  SSL_OP_NO_SSLv3: BigInt = 33554432
  SSL_OP_NO_TLSv1: BigInt = 67108864
  SSL_OP_NO_TLSv1_1: BigInt = 268435456
  SSL_OP_NO_TLSv1_2: BigInt = 134217728
  SSL_accept: Function (pointer) -> i32
  SSL_connect: Function (pointer) -> i32
  SSL_ctrl: Function (pointer, i32, u64, pointer) -> u64
  SSL_do_handshake: Function (pointer) -> i32
  SSL_free: Function (pointer) -> void
  SSL_get_current_cipher: Function (pointer) -> pointer
  SSL_get_error: Function (pointer, i32) -> i32
  SSL_get_peer_certificate: Function (pointer) -> pointer
  SSL_get_servername: Function (pointer, i32) -> pointer
  SSL_get_servername_type: Function (pointer) -> i32
  SSL_get_version: Function (pointer) -> pointer
  SSL_is_init_finished: Function (pointer) -> i32
  SSL_new: Function (pointer) -> pointer
  SSL_read: Function (pointer, pointer, i32) -> i32
  SSL_set_SSL_CTX: Function (pointer, pointer) -> pointer
  SSL_set_accept_state: Function (pointer) -> void
  SSL_set_bio: Function (pointer, pointer, pointer) -> void
  SSL_set_cipher_list: Function (pointer, string) -> i32
  SSL_set_connect_state: Function (pointer) -> void
  SSL_set_fd: Function (pointer, i32) -> i32
  SSL_shutdown: Function (pointer) -> i32
  SSL_write: Function (pointer, pointer, i32) -> i32
  TLS_client_method: Function () -> pointer
  TLS_server_method: Function () -> pointer
  X509_NAME_add_entry_by_txt: Function (pointer, pointer, i32, pointer, i32, i32, i32) -> i32
  X509_NAME_oneline: Function (pointer, pointer, i32) -> pointer
  X509_REQ_get_subject_name: Function (pointer) -> pointer
  X509_REQ_new: Function () -> pointer
  X509_REQ_set_pubkey: Function (pointer, pointer) -> i32
  X509_REQ_set_version: Function (pointer, u32) -> i32
  X509_REQ_sign: Function (pointer, pointer, pointer) -> i32
  X509_free: Function (pointer) -> void
  X509_get_issuer_name: Function (pointer) -> pointer
  X509_get_pubkey: Function (pointer) -> pointer
  X509_get_subject_name: Function (pointer) -> pointer
lz4 (external)
  compress_default: Function (pointer, pointer, i32, i32) -> i32
  compress_hc: Function (pointer, pointer, i32, i32, i32) -> i32
  decompress_safe: Function (pointer, pointer, i32, i32) -> i32
mbedtls (external)
  mbedtls_entropy_init: Function (pointer) -> void
  mbedtls_net_init: Function (pointer) -> void
  mbedtls_ssl_config_init: Function (pointer) -> void
  mbedtls_ssl_init: Function (pointer) -> void
  mbedtls_x509_crt_init: Function (pointer) -> void
  mbedtls_x509_crt_parse_der: Function (pointer, pointer, u32) -> i32
  struct_mbedtls_entropy_context_size: Number = 832
  struct_mbedtls_net_context_size: Number = 4
  struct_mbedtls_ssl_config_size: Number = 384
  struct_mbedtls_ssl_context_size: Number = 560
  struct_mbedtls_x509_crt_size: Number = 752
net (external)
  accept4: Function (i32, pointer, pointer, i32) -> i32
  bind: Function (i32, buffer, i32) -> i32
  close: Function (i32) -> i32
  connect: Function (i32, buffer, i32) -> i32
  dup2: Function (i32, i32) -> i32
  ioctl: Function (i32, i32, buffer) -> i32
  ioctl2: Function (i32, i32, i32) -> i32
  listen: Function (i32, i32) -> i32
  pipe2: Function (u32array, i32) -> i32
  read: Function (i32, buffer, i32) -> i32
  recv: Function (i32, buffer, u32, i32) -> i32
  recv2: Function (i32, pointer, u32, i32) -> i32
  recvfrom: Function (i32, buffer, u32, i32, buffer, buffer) -> i32
  recvmmsg: Function (i32, buffer, i32, i32, buffer) -> i32
  recvmsg: Function (i32, buffer, u32) -> i32
  send: Function (i32, buffer, u32, i32) -> i32
  send2: Function (i32, pointer, i32, u32) -> i32
  sendmmsg: Function (i32, buffer, i32, i32) -> i32
  sendmsg: Function (i32, buffer, i32) -> i32
  sendto: Function (i32, buffer, u32, i32, buffer, u32) -> i32
  setsockopt: Function (i32, i32, i32, buffer, i32) -> i32
  socket: Function (i32, i32, i32) -> i32
  write: Function (i32, buffer, i32) -> i32
  write_string: Function (i32, string, i32) -> i32
pico (external)
  parseRequest: Function (buffer, u32, buffer) -> i32
  parseRequest2: Function (pointer, u32, pointer) -> i32
  parseResponse: Function (buffer, u32, buffer) -> i32
  parseResponse2: Function (pointer, u32, pointer) -> i32
pthread (external)
  cancel: Function (u64) -> i32
  create: Function (u32array, pointer, pointer, buffer) -> i32
  detach: Function (u64) -> i32
  exit: Function (u32array) -> void
  getAffinity: Function (u64, u32, buffer) -> i32
  getcpuclockid: Function (u64, u32array) -> i32
  join: Function (u64, u32array) -> i32
  self: Function () -> u64
  setAffinity: Function (u64, u32, buffer) -> i32
  setName: Function (u64, string) -> i32
  tryJoin: Function (u64, u32array) -> i32
seccomp (external)
  seccomp_init: Function (u32) -> pointer
  seccomp_load: Function (pointer) -> i32
  seccomp_release: Function (pointer) -> void
  seccomp_rule_add_exact: Function (pointer, u32, i32, u32) -> i32
  seccomp_syscall_resolve_name: Function (string) -> i32
  seccomp_syscall_resolve_num_arch: Function (i32, i32) -> pointer
sqlite (external)
  SQLITE_OK: Number = 0
  SQLITE_OPEN_CREATE: Number = 4
  SQLITE_OPEN_NOMUTEX: Number = 32768
  SQLITE_OPEN_PRIVATECACHE: Number = 262144
  SQLITE_OPEN_READONLY: Number = 1
  SQLITE_OPEN_READWRITE: Number = 2
  SQLITE_ROW: Number = 100
  bind_blob: Function (pointer, i32, buffer, i32, u64) -> i32
  bind_double: Function (pointer, i32, f64) -> i32
  bind_int: Function (pointer, i32, i32) -> i32
  bind_int64: Function (pointer, i32, u64) -> i32
  bind_text: Function (pointer, i32, string, i32, u64) -> i32
  blob_bytes: Function (pointer) -> i32
  blob_close: Function (pointer) -> i32
  blob_open: Function (pointer, string, string, string, i64, i32, u32array) -> i32
  blob_read: Function (pointer, buffer, i32, i32) -> i32
  blob_write: Function (pointer, buffer, i32, i32) -> i32
  close2: Function (pointer) -> i32
  column_blob: Function (pointer, i32) -> pointer
  column_bytes: Function (pointer, i32) -> i32
  column_count: Function (pointer) -> i32
  column_double: Function (pointer, i32) -> f32
  column_int: Function (pointer, i32) -> i32
  column_name: Function (pointer, i32) -> pointer
  column_text: Function (pointer, i32) -> pointer
  column_type: Function (pointer, i32) -> i32
  deserialize: Function (pointer, string, buffer, u32, u32, u32) -> i32
  errmsg: Function (pointer) -> pointer
  exec: Function (pointer, string, pointer, pointer, u32array) -> i32
  exec2: Function (pointer, string, pointer, pointer, u32array) -> i32
  exec3: Function (pointer, pointer, pointer, pointer, pointer) -> i32
  exec4: Function (pointer, pointer, pointer, pointer, pointer) -> i32
  finalize: Function (pointer) -> i32
  open: Function (pointer, u32array) -> i32
  open2: Function (string, u32array, i32, pointer) -> i32
  prepare2: Function (pointer, string, i32, u32array, pointer) -> i32
  reset: Function (pointer) -> i32
  serialize: Function (pointer, string, u32array, u32) -> pointer
  step: Function (pointer) -> i32
  version: Function () -> pointer
system (external)
  UFFD_API: BigInt = 170
  _SC_CLK_TCK: Number = 2
  _UFFDIO_API: Number = 63
  calloc: Function (u32, u32) -> pointer
  clock_gettime: Function (i32, pointer) -> i32
  eventfd: Function (u32, i32) -> i32
  execvp: Function (string, buffer) -> i32
  exit: Function (i32) -> void
  fork: Function () -> i32
  free: Function (pointer) -> void
  get_avphys_pages: Function () -> u32
  getcwd: Function (buffer, i32) -> pointer
  getenv: Function (string) -> pointer
  getpid: Function () -> i32
  getrlimit: Function (i32, u32array) -> i32
  getrusage: Function (i32, buffer) -> i32
  gettid: Function (i32) -> i32
  kill: Function (i32, i32) -> i32
  memcpy: Function (pointer, pointer, u32) -> pointer
  memfd_create: Function (string, u32) -> i32
  memmove: Function (pointer, pointer, u32) -> pointer
  mmap: Function (pointer, u32, i32, i32, i32, u32) -> pointer
  mprotect: Function (pointer, u32, i32) -> i32
  munmap: Function (pointer, u32) -> i32
  pidfd_open: Function (i32, i32, u32) -> i32
  readlink: Function (string, buffer, u32) -> u32
  setrlimit: Function (i32, u32array) -> i32
  signal: Function (i32, pointer) -> pointer
  sleep: Function (u32) -> u32
  strerror_r: Function (i32, buffer, u32) -> i32
  sysconf: Function (i32) -> u32
  sysinfo: Function (buffer) -> u32
  timerfd_create: Function (i32, i32) -> i32
  timerfd_settime: Function (i32, i32, buffer, pointer) -> i32
  times: Function (buffer) -> i32
  usleep: Function (u32) -> i32
  waitpid: Function (i32, buffer, i32) -> i32
tcc (external)
  tcc_add_file: Function (pointer, string) -> i32
  tcc_add_include_path: Function (pointer, string) -> i32
  tcc_add_library: Function (pointer, string) -> i32
  tcc_add_library_path: Function (pointer, string) -> i32
  tcc_add_symbol: Function (pointer, string, pointer) -> i32
  tcc_compile_string: Function (pointer, string) -> i32
  tcc_delete: Function (pointer) -> void
  tcc_get_symbol: Function (pointer, string) -> pointer
  tcc_new: Function () -> pointer
  tcc_output_file: Function (pointer, string) -> i32
  tcc_relocate: Function (pointer, pointer) -> i32
  tcc_set_options: Function (pointer, string) -> void
  tcc_set_output_type: Function (pointer, i32) -> i32
wireguard (external)
  add: Function (string) -> i32
  delete: Function (string) -> i32
  free: Function (pointer) -> void
  genpresharedKey: Function (buffer) -> void
  genprivKey: Function (buffer) -> void
  genpubKey: Function (buffer, buffer) -> void
  get: Function (u32array, string) -> i32
  keyfrombase64: Function (buffer, buffer) -> i32
  keytobase64: Function (buffer, buffer) -> void
  list: Function () -> pointer
  set: Function (pointer) -> i32
zlib (external)
  deflate: Function (buffer, u32, buffer, u32) -> u32
  inflate: Function (buffer, u32, buffer, u32) -> u32
duckdb (external)
  DuckDBError: Number = 1
  DuckDBSuccess: Number = 0
  close: Function (pointer) -> void
  column_count: Function (pointer) -> i32
  connect: Function (pointer, u32array) -> i32
  create_config: Function (pointer) -> i32
  destroy_prepare: Function (pointer) -> void
  destroy_result: Function (pointer) -> void
  disconnect: Function (pointer) -> void
  duckdb_column_name: Function (pointer, u32) -> pointer
  execute_prepared: Function (pointer, pointer) -> i32
  library_version: Function () -> pointer
  open_ext: Function (string, u32array, pointer, pointer) -> i32
  prepare: Function (pointer, string, u32array) -> i32
  query: Function (pointer, string, pointer) -> i32
  result_error: Function (pointer) -> pointer
  row_count: Function (pointer) -> i32
  set_config: Function (pointer, string, string) -> i32
  struct_duckdb_config_size: Number = 8
  struct_duckdb_connection_size: Number = 8
  struct_duckdb_database_size: Number = 8
  struct_duckdb_prepared_statement_size: Number = 8
  struct_duckdb_result_size: Number = 48
  value_is_null: Function (pointer, u32, u32) -> u32
  value_uint32: Function (pointer, u32, u32) -> u32
  value_varchar: Function (pointer, u32, u32) -> pointer
```

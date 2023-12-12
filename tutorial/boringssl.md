# building the boringssl binding for lo

in this tutorial, we will 

- download lo source and build it from scratch
- create a new binding for boringssl, build it and test it

## build lo from scratch on Linux

on debian/linux, do the following

### install build dependencies if not already installed

```shell
apt install -y curl g++ make libcurl4-openssl-dev
```

### download lo source and build lo runtime

```shell
curl -L -o 0.0.13-pre.tar.gz https://github.com/just-js/lo/archive/refs/tags/0.0.13-pre.tar.gz
tar -xf 0.0.13-pre.tar.gz
cd lo-0.0.13-pre
make C=gcc CC=g++ cleanall lo
```

### create boring ssl binding

#### generate a skeleton binding

```shell
./lo build binding boringssl
```

#### download and build boringssl libraries

we will replace this with a ```lib/boringssl/build.js``` script later on


```shell
mkdir lib/boringssl/deps
cd lib/boringssl/deps
curl -L -o boringssl.tar.gz https://codeload.github.com/google/boringssl/tar.gz/master
tar -xf boringssl.tar.gz
mv boringssl-master boringssl
cd boringssl
cmake -B build
make -C build -j 4
cd ../../../
```

#### copy and modify openssl bindings definitions for boringssl

```shell
cp lib/libssl/api.js lib/boringssl/api.js
vi lib/boringssl/api.js
```

- change name to 'boringssl'
- change include_paths to ```['./deps/boringssl/include']```
- in the linux section at the end add these lines so the boringssl libraries 
  are linked and remove the "libs" entries

```JavaScript
  } else if (lo.core.os === 'linux') {
//    libs.push('ssl')
//    libs.push('crypto')
    obj.push(`deps/boringssl/build/ssl/libssl.a`)
    obj.push(`deps/boringssl/build/crypto/libcrypto.a`)
  }
```

so the section of the file after "name" looks like this now

```JavaScript
const name = 'boringssl'

const includes = [
  'openssl/opensslv.h',
  'openssl/err.h',
  'openssl/dh.h',
  'openssl/ssl.h',
  'openssl/conf.h',
  'openssl/engine.h',
  'openssl/hmac.h',
  'openssl/evp.h',
  'openssl/rsa.h',
  'openssl/pem.h',
  'atomic'
]

const libs = []
const obj = []
const include_paths = ['./deps/boringssl/include']
const lib_paths = []

if (globalThis.lo) {
  const PREFIX = lo.getenv('LO_PREFIX') || '/opt/homebrew/opt'
  if (lo.core.os === 'mac') {
// todo
  } else if (lo.core.os === 'linux') {
    obj.push(`deps/boringssl/build/ssl/libssl.a`)
    obj.push(`deps/boringssl/build/crypto/libcrypto.a`)
  }
}
```

### build the boringssl bindings

ensure you are in the lo directory where you downloaded and installed lo

```shell
./lo build binding boringssl
ls -lah lib/boringssl/*.so
```

you should now see the shared library in ```lib/boringssl/boringssl.so```

### test the bindings

this script will just load the bindings and dump the api definitions onto the console

```
./lo test/dump-binding.js boringssl
```

and you should see something like this

```shell
    ASN1_INTEGER_set: Function (0)
    BIO_CTRL_PENDING: Number = 10
    BIO_ctrl: Function (0)
    BIO_new: Function (0)
    BIO_new_mem_buf: Function (0)
    BIO_read: Function (0)
    BIO_s_mem: Function (0)
    EVP_Digest: Function (0)
    EVP_DigestFinal: Function (0)
    EVP_DigestInit_ex: Function (0)
    EVP_DigestSignFinal: Function (0)
    EVP_DigestSignInit: Function (0)
    EVP_DigestUpdate: Function (0)
    EVP_DigestUpdateBuffer: Function (0)
    EVP_DigestUpdateString: Function (0)
    EVP_DigestVerifyFinal: Function (0)
    EVP_DigestVerifyInit: Function (0)
    EVP_MD_CTX_free: Function (0)
    EVP_MD_CTX_new: Function (0)
    EVP_MD_CTX_reset: Function (0)
    EVP_PKEY_CTRL_RSA_KEYGEN_BITS: Number = 4099
    EVP_PKEY_CTX_free: Function (0)
    EVP_PKEY_CTX_new_id: Function (0)
    EVP_PKEY_OP_KEYGEN: Number = 4
    EVP_PKEY_RSA: Number = 6
    EVP_PKEY_free: Function (0)
    EVP_PKEY_id: Function (0)
    EVP_PKEY_keygen: Function (0)
    EVP_PKEY_keygen_init: Function (0)
    EVP_PKEY_new: Function (0)
    EVP_PKEY_type: Function (0)
    EVP_get_digestbyname: Function (0)
    EVP_get_digestbynid: Function (0)
    EVP_sha1: Function (0)
    EVP_sha224: Function (0)
    EVP_sha256: Function (0)
    EVP_sha384: Function (0)
    EVP_sha512: Function (0)
    EVP_sha512_224: Function (0)
    EVP_sha512_256: Function (0)
    OBJ_txt2nid: Function (0)
    OPENSSL_VERSION_MAJOR: Number = 3
    OPENSSL_init_ssl: Function (0)
    OpenSSL_version: Function (0)
    PEM_read_bio_X509: Function (0)
    PEM_write_bio_PUBKEY: Function (0)
    PEM_write_bio_PrivateKey: Function (0)
    PEM_write_bio_X509: Function (0)
    PEM_write_bio_X509_REQ: Function (0)
    RSA_pkey_ctx_ctrl: Function (0)
    SSL_CIPHER_get_name: Function (0)
    SSL_CTX_free: Function (0)
    SSL_CTX_new: Function (0)
    SSL_CTX_set_cipher_list: Function (0)
    SSL_CTX_set_ciphersuites: Function (0)
    SSL_CTX_set_options: Function (0)
    SSL_CTX_use_PrivateKey_file: Function (0)
    SSL_CTX_use_certificate_chain_file: Function (0)
    SSL_CTX_use_certificate_file: Function (0)
    SSL_ERROR_SSL: Number = 1
    SSL_ERROR_WANT_ACCEPT: Number = 8
    SSL_ERROR_WANT_CONNECT: Number = 7
    SSL_ERROR_WANT_READ: Number = 2
    SSL_ERROR_WANT_WRITE: Number = 3
    SSL_ERROR_WANT_X509_LOOKUP: Number = 4
    SSL_FILETYPE_PEM: Number = 1
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
    SSL_accept: Function (0)
    SSL_connect: Function (0)
    SSL_ctrl: Function (0)
    SSL_do_handshake: Function (0)
    SSL_free: Function (0)
    SSL_get_current_cipher: Function (0)
    SSL_get_error: Function (0)
    SSL_get_peer_certificate: Function (0)
    SSL_get_servername: Function (0)
    SSL_get_servername_type: Function (0)
    SSL_get_version: Function (0)
    SSL_is_init_finished: Function (0)
    SSL_new: Function (0)
    SSL_read: Function (0)
    SSL_set_SSL_CTX: Function (0)
    SSL_set_accept_state: Function (0)
    SSL_set_bio: Function (0)
    SSL_set_cipher_list: Function (0)
    SSL_set_connect_state: Function (0)
    SSL_set_fd: Function (0)
    SSL_shutdown: Function (0)
    SSL_write: Function (0)
    SSL_write_string: Function (0)
    TLS_client_method: Function (0)
    TLS_server_method: Function (0)
    X509_NAME_add_entry_by_txt: Function (0)
    X509_NAME_oneline: Function (0)
    X509_REQ_get_subject_name: Function (0)
    X509_REQ_new: Function (0)
    X509_REQ_set_pubkey: Function (0)
    X509_REQ_set_version: Function (0)
    X509_REQ_sign: Function (0)
    X509_free: Function (0)
    X509_get_issuer_name: Function (0)
    X509_get_pubkey: Function (0)
    X509_get_serialNumber: Function (0)
    X509_get_subject_name: Function (0)
    X509_getm_notAfter: Function (0)
    X509_getm_notBefore: Function (0)
    X509_gmtime_adj: Function (0)
    X509_new: Function (0)
    X509_set_issuer_name: Function (0)
    X509_set_pubkey: Function (0)
    X509_sign: Function (0)
    X509_time_adj_ex: Function (0)
```

with these bindings you can just take the example [here](https://github.com/just-js/lo-bench/blob/main/http/https-lo.js), and replace

```JavaScript
const { libssl } = lo.load('libssl')
```

with

```JavaScript
const libssl = lo.load('boringssl').boringssl
```

and everything *should* just work! =)

## build lo from scratch on mac

coming soon...

const api = {
  count_avx: {
    parameters: ['pointer', 'i32', 'u32'],
    result: 'u32',
    name: 'memcount_avx2'
  },
}

const decoder = new TextDecoder()
const preamble = decoder.decode(lo.core.read_file('linecount-avx.c'))
const name = 'memcount'

export { name, api, preamble }

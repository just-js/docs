const api = {
  noop_fast: {
    parameters: [],
    result: 'void',
    name: 'noop'
  },
  noop_slow: {
    parameters: [],
    result: 'void',
    name: 'noop',
    nofast: true
  }
}

const preamble = [
  'void noop () {',
  '}'
].join('\n')

const name = 'noop'

const constants = {}

// put comments in here

export { name, api, constants, preamble }

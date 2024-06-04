import { bind } from 'lib/ffi.js'

const { assert, core, addr, ptr, utf8_decode, colors } = lo
const { dlopen, dlsym, strnlen } = core

const { AM, AY, AD, AG } = colors

const u32 = new Uint32Array(2)
const handle = assert(dlopen('./libwgpu_native.so', 1))
const wgpuGetVersion = bind(assert(dlsym(handle, 'wgpuGetVersion')), 'i32', [])
const wgpuCreateInstance = bind(assert(dlsym(handle, 'wgpuCreateInstance')), 'pointer', ['pointer'])
const wgpuInstanceRelease = bind(assert(dlsym(handle, 'wgpuInstanceRelease')), 'void', ['pointer'])
const wgpuInstanceEnumerateAdapters = bind(assert(dlsym(handle, 'wgpuInstanceEnumerateAdapters')), 'u32', ['pointer', 'pointer', 'pointer'])
const wgpuAdapterGetProperties = bind(assert(dlsym(handle, 'wgpuAdapterGetProperties')), 'void', ['pointer', 'pointer'])
const wgpuAdapterRelease = bind(assert(dlsym(handle, 'wgpuAdapterRelease')), 'void', ['pointer'])
const adapter_size = 8
const adapter_properties_size = 64

const AdapterTypes = {
  [0]: 'DiscreteGPU',
  [1]: 'IntegratedGPU',
  [2]: 'CPU',
  [3]: 'Unknown',
  [0x7fffffff]: 'Force32',
}

const BackendTypes = {
  [0]: 'Undefined',
  [1]: 'Null',
  [2]: 'WebGPU',
  [3]: 'D3D11',
  [4]: 'D3D12',
  [5]: 'Metal',
  [6]: 'Vulkan',
  [7]: 'OpenGL',
  [8]: 'OpenGLES',
  [0x7fffffff]: 'Force32',
}

function read_string (big_ptr) {
  const ptr = Number(big_ptr)
  const len = strnlen(ptr, 65536)
  return utf8_decode(ptr, len)
}

console.log(`${AG}wgpu version${AD}       ${wgpuGetVersion()}`)
wgpuCreateInstance(0, u32)
const inst = addr(u32)
const count = wgpuInstanceEnumerateAdapters(inst, 0, 0)
console.log(`${AG}adapters${AD}           ${count}`)
const adaptors = ptr(new Uint8Array(adapter_size * count))
const adaptors_ptr = new BigUint64Array(adaptors.buffer)
wgpuInstanceEnumerateAdapters(inst, 0, adaptors.ptr)

console.log('')
for (let i = 0; i < count; i++) {
  const prop = ptr(new Uint8Array(adapter_properties_size))
  wgpuAdapterGetProperties(Number(adaptors_ptr[i]), prop.ptr)
  const dv = new DataView(prop.buffer)
  console.log(`${AM}name${AD}               ${read_string(dv.getBigUint64(40, true))}`)
//  console.log(`${AY}nextInChain${AD}        ${dv.getBigUint64(0, true)}`)
  console.log(`${AY}vendorID${AD}           ${dv.getUint32(8, true)}`)
  console.log(`${AY}vendorName${AD}         ${read_string(dv.getBigUint64(16, true))}`)
  console.log(`${AY}architecture${AD}       ${read_string(dv.getBigUint64(24, true))}`)
  console.log(`${AY}deviceID${AD}           ${dv.getUint32(32, true)}`)
  console.log(`${AY}driver_description${AD} ${read_string(dv.getBigUint64(48, true))}`)
  console.log(`${AY}adapterType${AD}        ${AdapterTypes[dv.getUint32(56, true)]}`)
  console.log(`${AY}backendType${AD}        ${BackendTypes[dv.getUint32(60, true)]}`)
  wgpuAdapterRelease(Number(adaptors_ptr[i]))
  console.log('')
}

wgpuInstanceRelease(inst)


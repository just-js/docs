const { mach } = lo.load('mach')

const { ptr, assert, core, latin1Decode } = lo

const {
  struct_task_basic_info_size, struct_mach_msg_type_number_t_size,
  TASK_BASIC_INFO_COUNT, TASK_BASIC_INFO, KERN_SUCCESS,
  task_self, task_info, get_executable_path
} = mach

const info = ptr(new Uint32Array(struct_task_basic_info_size / 4))
const msg_type = ptr(new Uint32Array(struct_mach_msg_type_number_t_size / 4))
msg_type[0] = TASK_BASIC_INFO_COUNT
assert(task_info(task_self(), TASK_BASIC_INFO, info.ptr, msg_type.ptr) === KERN_SUCCESS)
const rss = info[3]
console.log(rss)

const max_path = new Uint32Array([1024])
const path_name = ptr(new Uint8Array(1024))
assert(get_executable_path(path_name.ptr, max_path) === 0)
console.log(latin1Decode(path_name.ptr, max_path[0]))

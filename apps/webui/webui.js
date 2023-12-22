import { Timer } from 'lib/timer.js'
import { Loop } from 'lib/loop.js'
import { mem } from 'lib/proc.js'
import { Assembler, address_as_bytes } from 'lib/asm.js'

const { webui } = lo.load('webui')
const { assert, ptr, core, registerCallback } = lo
const { dlsym, callback, free } = core

const h_wnd = webui.webui_new_window()
assert(h_wnd)

const encoder = new TextEncoder()

const body = encoder.encode(`<!DOCTYPE html>
<html>
	<head>
    <script src="webui.js"></script>
		<title>WebUI 2 - Lo.js Hello World Example</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        color: white;
        background: linear-gradient(to right, #507d91, #1c596f, #022737);
        text-align: center;
        font-size: 18px;
      }
      button, input {
        padding: 10px;
        margin: 10px;
        border-radius: 3px;
        border: 1px solid #ccc;
        box-shadow: 0 3px 5px rgba(0,0,0,0.1);
        transition: 0.2s;
      }
      button {
        background: #3498db;
        color: #fff; 
        cursor: pointer;
        font-size: 16px;
      }
      h1 { text-shadow: -7px 10px 7px rgb(67 57 57 / 76%); }
      button:hover { background: #c9913d; }
      input:focus { outline: none; border-color: #3498db; }
    </style>
    </head>
    <body>
        <h1>WebUI 2 - Lo.js Hello World</h1><br>
        A: <input id="MyInputA" value="4"><br><br>
        B: <input id="MyInputB" value="6"><br><br>
        <div id="Result" style="color: #dbdd52">Result: ?</div><br><br>
	    <button id="calculate">Calculate</button> - <button OnClick="startCheck()">Check Result</button> - <button id="exit">Exit</button>
        <script>
            let Res = 0;

            function get_A() {
              return parseInt(document.getElementById('MyInputA').value);
            }

            function get_B() {
              return parseInt(document.getElementById('MyInputB').value);
            }

            function set_result(res) {
              Res = res;
              document.getElementById("Result").innerHTML = 'Result: ' + Res;
            }

            function startCheck() {
              checkResult(get_A(), get_B(), Res).then((response) => {
                alert(response);
              });
            }
        </script>
    </body>    
</html>
\0`)


const asm = new Assembler()
const max_cb_depth = 65536
const cb_u32 = ptr(new Uint32Array(new SharedArrayBuffer(24)))
const cb_u64 = new BigUint64Array(cb_u32.buffer)
cb_u32[1] = max_cb_depth
const contexts = ptr(new Uint8Array(8 * max_cb_depth))
const ctx_u64 = new BigUint64Array(contexts.buffer)
cb_u64[1] = BigInt(contexts.ptr)
const nArgs = 5
const ctx = ptr(new Uint8Array(((nArgs + 4) * 8)))
const u32 = new Uint32Array(ctx.buffer)
const callback_address = assert(dlsym(0, 'lo_async_callback'))
function exit_callback () {
  console.log(u32)
  webui.webui_exit()
  timer.close()
}
registerCallback(ctx.ptr, exit_callback, nArgs)
const code_buf = ptr(new Uint8Array([
  // save r15 as we will be changing it
  // push r15
  0x41, 0x57,
  // load the context into rax
  // movabs (address of context), %r15
  0x49, 0xbf, ...address_as_bytes(ctx.ptr),
  // populate function args from context in rax
  // mov %rdi, 32(%r15)
  0x49, 0x89, 0x7f, 0x20,
  // mov %rsi, 40(%r15)
  0x49, 0x89, 0x77, 0x28,
  // mov %rdx, 48(%r15)
  0x49, 0x89, 0x57, 0x30,
  // mov %rcx, 56(%r15)
  0x49, 0x89, 0x4f, 0x38,
  // mov %r8, 64(%r15)
  0x4d, 0x89, 0x47, 0x40,
  // mov %r9, 72(%r15)
  0x4d, 0x89, 0x4f, 0x48,
  // pass struct as first arg to trampoline function
  // mov %r15, %rdi
  0x4c, 0x89, 0xff,
  // movabs (address of cb_context), %rsi
  0x48, 0xbe, ...address_as_bytes(cb_u32.ptr),
  // call {callback_address}
  ...asm.reset().call(callback_address).bytes(),
  // pull the result out of the struct and put it in rax
  // mov 16(%r15), %rax
  0x49, 0x8b, 0x47, 0x10,
  // restore r15 for caller
  // pop r15
  0x41, 0x5f,
  // ret
  0xc3
]))

// 15 ns for this
let last = Atomics.load(cb_u32, 0)

webui.webui_interface_bind(h_wnd, 'exit', asm.compile(code_buf))
assert(webui.webui_show(h_wnd, body) === 1)
const loop = new Loop()
const timer = new Timer(loop, 1000, () => {
  console.log(mem())
})

while (1) {
  if (loop.size === 0) break
  loop.poll(1)
  let todo = Atomics.load(cb_u32, 0) - last
  if (todo > 0) {
    console.log(`${todo} events`)
    for (let i = 0; i < todo; i++) {
      callback(Number(ctx_u64[i + last]))
      free(Number(ctx_u64[i + last]))
    }
    last += todo
  }
}


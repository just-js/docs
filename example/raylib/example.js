import { bindall } from 'lib/ffi.js'

const { assert, core } = lo
const { dlopen } = core

const bindings = {
  raylib: {
    api: {
      InitWindow: { parameters: ['i32', 'i32', 'string'], result: 'void' },
      SetTargetFPS: { parameters: ['i32'], result: 'void' },
      WindowShouldClose: { parameters: [], result: 'u8' },
      IsKeyPressed: { parameters: ['i32'], result: 'u8' },
      IsGestureDetected: { parameters: ['u32'], result: 'u8' },
      BeginDrawing: { parameters: [], result: 'void' },
      ClearBackground: {
        parameters: ['buffer'],
        //parameters: [{ 'struct': ['u8', 'u8', 'u8', 'u8'] }],
        result: 'void',
      },
      DrawText: {
        parameters: ['buffer', 'i32', 'i32', 'i32', 'buffer', 
    //    {
    //      'struct': ['u8', 'u8', 'u8', 'u8'],
    //    }
        ],
        result: 'void',
      },
      DrawRectangle: {
        parameters: ['i32', 'i32', 'i32', 'i32', 'buffer', 
    //    {
    //      'struct': ['u8', 'u8', 'u8', 'u8'],
    //    }
        ],
        result: 'void',
      },
      EndDrawing: { parameters: [], result: 'void' },
      CloseWindow: { parameters: [], result: 'void' },
    }
  }
}

const { raylib } = bindall(bindings, assert(dlopen('./libraylib.so', 1)))

raylib.InitWindow(800, 450, 'foobar')
raylib.SetTargetFPS(60)

const RAYWHITE = new Uint8Array([245, 245, 245, 255])

while (!raylib.WindowShouldClose()) {
  raylib.BeginDrawing()
  raylib.ClearBackground(RAYWHITE)
//  raylib.EndDrawing()
}

raylib.CloseWindow()

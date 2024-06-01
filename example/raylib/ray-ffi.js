import { bindall } from 'lib/ffi.js'

const { assert, core } = lo
const { dlopen } = core

const bindings = {
  raylib: {
    api: {
      InitWindow: { parameters: ['i32', 'i32', 'string'], result: 'void' },
      SetTargetFPS: { parameters: ['i32'], result: 'void' },
      WindowShouldClose: { parameters: [], result: 'bool' },
      IsKeyPressed: { parameters: ['i32'], result: 'bool' },
      IsGestureDetected: { parameters: ['u32'], result: 'bool' },
      BeginDrawing: { parameters: [], result: 'void' },
      ClearBackground: {
        parameters: ['u32'],
        result: 'void',
      },
      DrawText: {
        parameters: ['string', 'i32', 'i32', 'i32', 'u32'],
        result: 'void',
      },
      DrawRectangle: {
        parameters: ['i32', 'i32', 'i32', 'i32', 'u32'],
        result: 'void',
      },
      EndDrawing: { parameters: [], result: 'void' },
      CloseWindow: { parameters: [], result: 'void' },
    }
  }
}

const LOGO = 0
const TITLE = 1
const GAMEPLAY = 2
const ENDING = 3

const RAYWHITE = 0xfff5f5f5
const LIGHTGRAY = 0xffc8c8c8
const GRAY = 0xff828282

const GREEN = 0xff30e400
const DARKGREEN = 0xff2c7500
const PURPLE = 0xffff7ac8
const MAROON = 0xff3721be
const BLUE = 0xfff17900
const DARKBLUE = 0xffac5200
const KEY_ENTER = 257

const handle = dlopen('./libraylib.so', 1)
const { raylib } = bindall(bindings, assert(handle))

const screenWidth = 800
const screenHeight = 450

raylib.InitWindow(screenWidth, screenHeight, 'foobar')
raylib.SetTargetFPS(60)

let framesCounter = 0
let currentScreen = LOGO

while (!raylib.WindowShouldClose()) {
  switch (currentScreen) {
    case LOGO:
      if (++framesCounter > 120) {
        currentScreen = TITLE
      }
      break
    case TITLE:
      if (raylib.IsKeyPressed(KEY_ENTER)) {
        currentScreen = GAMEPLAY
      }
      break
    case GAMEPLAY:
      if (raylib.IsKeyPressed(KEY_ENTER)) {
        currentScreen = ENDING
      }
      break
    case ENDING:
      if (raylib.IsKeyPressed(KEY_ENTER)) {
        currentScreen = TITLE
      }
      break
  }
  raylib.BeginDrawing()
  raylib.ClearBackground(RAYWHITE)
  switch (currentScreen) {
    case LOGO:
      raylib.DrawText('LOGO SCREEN', 20, 20, 40, LIGHTGRAY)
      raylib.DrawText('WAIT for 2 SECONDS...', 290, 220, 20, GRAY)
      break
    case TITLE:
      raylib.DrawRectangle(0, 0, screenWidth, screenHeight, GREEN);
      raylib.DrawText('TITLE SCREEN', 20, 20, 40, DARKGREEN)
      raylib.DrawText('PRESS ENTER or TAP to JUMP to GAMEPLAY SCREEN', 120, 220, 20, DARKGREEN)
      break
    case GAMEPLAY:
      raylib.DrawRectangle(0, 0, screenWidth, screenHeight, PURPLE);
      raylib.DrawText('GAMEPLAY SCREEN', 20, 20, 40, MAROON)
      raylib.DrawText('PRESS ENTER or TAP to JUMP to ENDING SCREEN', 130, 220, 20, MAROON)
      break
    case ENDING:
      raylib.DrawRectangle(0, 0, screenWidth, screenHeight, BLUE);
      raylib.DrawText('ENDING SCREEN', 20, 20, 40, DARKBLUE)
      raylib.DrawText('PRESS ENTER or TAP to RETURN to TITLE SCREEN', 120, 220, 20, DARKBLUE)
      break
  }
  raylib.EndDrawing()
}

raylib.CloseWindow()

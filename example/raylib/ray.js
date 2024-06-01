const { raylib } = lo.load('raylib')
const { assert, core } = lo
const { dlopen } = core
const { 
  InitWindow, SetTargetFPS, IsKeyPressed, WindowShouldClose, BeginDrawing, 
  ClearBackground, DrawRectangle, DrawText, EndDrawing, CloseWindow 
} = raylib
const LOGO = 0
const TITLE = 1
const GAMEPLAY = 2
const ENDING = 3
const RAYWHITE = new Uint8Array([245, 245, 245, 255])
const LIGHTGRAY = new Uint8Array([200, 200, 200, 255])
const GRAY = new Uint8Array([130, 130, 130, 255])
const GREEN = new Uint8Array([0, 228, 48, 255])
const DARKGREEN = new Uint8Array([0, 117, 44, 255])
const PURPLE = new Uint8Array([200, 122, 255, 255])
const MAROON = new Uint8Array([190, 33, 55, 255])
const BLUE = new Uint8Array([0, 121, 241, 255])
const DARKBLUE = new Uint8Array([0, 82, 172, 255])
const KEY_ENTER = 257
const screenWidth = 800
const screenHeight = 450
InitWindow(screenWidth, screenHeight, 'foobar')
SetTargetFPS(60)
let framesCounter = 0
let currentScreen = LOGO
while (!WindowShouldClose()) {
  BeginDrawing()
//  ClearBackground(RAYWHITE)
  switch (currentScreen) {
    case LOGO:
      if (++framesCounter > 120) {
        currentScreen = TITLE
      } else {
        DrawText('LOGO SCREEN', 20, 20, 40, LIGHTGRAY)
        DrawText('WAIT for 2 SECONDS...', 290, 220, 20, GRAY)
      }
      break
    case TITLE:
      if (IsKeyPressed(KEY_ENTER)) {
        currentScreen = GAMEPLAY
      } else {
        DrawRectangle(0, 0, screenWidth, screenHeight, GREEN);
        DrawText('TITLE SCREEN', 20, 20, 40, DARKGREEN)
        DrawText('PRESS ENTER or TAP to JUMP to GAMEPLAY SCREEN', 120, 220, 20, 
          DARKGREEN)
      }
      break
    case GAMEPLAY:
      if (IsKeyPressed(KEY_ENTER)) {
        currentScreen = ENDING
      } else {
        DrawRectangle(0, 0, screenWidth, screenHeight, PURPLE);
        DrawText('GAMEPLAY SCREEN', 20, 20, 40, MAROON)
        DrawText('PRESS ENTER or TAP to JUMP to ENDING SCREEN', 130, 220, 20, 
          MAROON)
      }
      break
    case ENDING:
      if (IsKeyPressed(KEY_ENTER)) {
        currentScreen = TITLE
      } else {
        DrawRectangle(0, 0, screenWidth, screenHeight, BLUE);
        DrawText('ENDING SCREEN', 20, 20, 40, DARKBLUE)
        DrawText('PRESS ENTER or TAP to RETURN to TITLE SCREEN', 120, 220, 20, 
          DARKBLUE)
      }
      break
  }
  EndDrawing()
}
CloseWindow()

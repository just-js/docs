#include <unistd.h>
#include <stdint.h>

void thread_func (void* context) {
  uint8_t* bytes = (uint8_t*)context;
  bytes[0] = 255;
  bytes[63] = 1;
  sleep(3);
}

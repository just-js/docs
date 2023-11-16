typedef int (*callback)(int i);

callback cb;
int stopped = 1;
int counter = 0;

void register_callback (callback cba) {
  cb = cba;
}

void start_callbacks () {
  stopped = 0;
  counter = 0;
  while (stopped == 0) counter = cb(counter);
}

void stop_callbacks () {
  stopped = 1;
}

#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <stdint.h>

int read_file (const char* pathname, struct stat* st, char** ptr) {
  int fd = open(pathname, O_RDONLY);
  if (fd == -1) return -1;
  if(fstat(fd, st) != 0) return -1;
  char* buf = (char*)malloc(st->st_size);
  int bytes = read(fd, buf, st->st_size);
  close(fd);
  ptr[0] = buf;
  return bytes;
}

int main () {
  struct stat st;
  char* ptr[0];
  int size = read_file("/dev/shm/bzImage", &st, ptr);
  fprintf(stderr, "size %i @ %lu\n", size, (uint64_t)ptr[0]);
}

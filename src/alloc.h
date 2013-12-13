#ifndef GOSH_ALLOC
#define GOSH_ALLOC

#include <stdlib.h> // size_t

#define gosh_alloc(type) gosh_alloc_size(sizeof(type))
#define gosh_allocn(type, n) gosh_alloc_size(n * sizeof(type))

void* gosh_alloc_size(size_t size);
void gosh_free(void* ptr);


#endif


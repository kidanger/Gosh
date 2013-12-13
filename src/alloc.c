#include <stdlib.h>

#include "alloc.h"

// TODO: check malloc return
// TODO: implement memory leak report

void* gosh_alloc_size(size_t size) {
	return malloc(size);
}

void gosh_free(void* ptr) {
	free(ptr);
}


/* Copyright © 2013 Jérémy Anger, Denis Migdal
   This file is part of Gosh.

   Gosh is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   Gosh is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with Gosh.  If not, see <http://www.gnu.org/licenses/>. */
#ifndef GOSH_ALLOC
#define GOSH_ALLOC

#include <stdlib.h> // size_t

#define gosh_alloc(type) gosh_alloc_size(sizeof(type))
#define gosh_allocn(type, n) gosh_alloc_size(n * sizeof(type))

void* gosh_alloc_size(size_t size);
void gosh_free(void* ptr);


#endif


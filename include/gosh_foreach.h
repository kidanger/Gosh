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
#ifndef GOSH_FOREACH_H
#define GOSH_FOREACH_H

#include <stddef.h>
#include <stdbool.h>

#include "concat.h"

struct iterateur {
};

#define TYPE_ITERATEUR_OF(TYPE, ITERABLE) (((struct C2(iterable_, TYPE)*) (ITERABLE))->funcs)

#define gosh_foreach(TYPE, ELEMENT, CONTAINER) \
	for (struct iterateur* it = TYPE_ITERATEUR_OF(TYPE, CONTAINER)->begin(CONTAINER); \
	        TYPE_ITERATEUR_OF(TYPE, CONTAINER)->next(it, &(ELEMENT)); \
	    )

#define gosh_foreach_old(TYPE, ELEMENT_NAME, CONTAINER) \
	for (Gosh_Iterator it = (CONTAINER).begin( &(CONTAINER) ); \
	        ((ELEMENT_NAME) = it.next( &it )) ; \
	    )

#endif // GOSH_FOREACH_H

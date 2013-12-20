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

typedef struct {
	void * m_pos;
} GoshIterateur;

#define CREATE_ITERATOR(CONTAINER) (CONTAINER)->create_iterator()

#define gosh_foreach(ELEMENT, CONTAINER) \
	for ( GoshIterateur it = (CONTAINER)->createIterateur(); \
	        (CONTAINER)->next(&it, (CONTAINER), &(ELEMENT) ) ; \
	    )

#define gosh_foreach_ptr(ELEMENT, CONTAINER) \
	for ( GoshIterateur it = (CONTAINER)->createIterateur(); \
	        (ELEMENT) = (CONTAINER)->next(&it, (CONTAINER), NULL ) ; \
	    )

#define gosh_appartient(CONTAINER, ELEMENT) \
	(CONTAINER)->appartient( (CONTAINER), (ELEMENT) )

#define gosh_vide(CONTAINER) \
	(CONTAINER)->vide( (CONTAINER) )

#define gosh_ajouter(CONTAINER, ELEMENT) \
	(CONTAINER)->ajouter( (CONTAINER), (ELEMENT) )

#define gosh_supprimer_tete(CONTAINER) \
	(CONTAINER)->supprimer_tete( (CONTAINER) )

#define gosh_reserve(CONTAINER, SIZE) \
	(CONTAINER)->reserve( (SIZE) )

#define gosh_nombre_elements(CONTAINER) \
	(CONTAINER)->nombre_elements( (CONTAINER) )

#endif // GOSH_FOREACH_H

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
#ifndef TYPE
#error "TYPE non défini"
#endif
#ifndef TYPE_LOWER
#error "TYPE_LOWER non défini"
#endif

#include <stdbool.h>
#include "concat.h"
#include "gosh_foreach.h"

#define CONTAINER_NAME CONCAT_2(Ensemble, TYPE)

#define NODE_NAME CONCAT_2 (Noeud, TYPE)

#define FUNC_NAME(name) CONCAT_3(ensemble_, TYPE_LOWER, _##name)

#define IPLM_CONTAINER_NAME CONCAT_2(Impl, CONTAINER_NAME)

struct NODE_NAME {
	TYPE element;
	struct NODE_NAME * suivant;
};

typedef struct IMPL_CONTAINER_NAME {

	struct NODE_NAME * tete;


	TYPE * (* next)(GoshIterateur *, struct IMPL_CONTAINER_NAME *, TYPE *);
	GoshIterateur(*createIterateur)(void);
	bool (*vide)(struct IMPL_CONTAINER_NAME *);
	void (*ajouter)(struct IMPL_CONTAINER_NAME *, TYPE);
	bool (*appartient)(struct IMPL_CONTAINER_NAME *, TYPE);
	TYPE(*supprimer_tete)(struct IMPL_CONTAINER_NAME *);



} * CONTAINER_NAME;

// déclaration des fonctions
CONTAINER_NAME CONCAT_2(creer_ensemble_, TYPE_LOWER)(void);
void CONCAT_2(detruire_ensemble_, TYPE_LOWER)(CONTAINER_NAME ensemble);

TYPE * FUNC_NAME(next)(GoshIterateur *, CONTAINER_NAME, TYPE *);
GoshIterateur FUNC_NAME(createIterateur)(void);

bool FUNC_NAME(vide)(CONTAINER_NAME ensemble);
void FUNC_NAME(ajouter)(CONTAINER_NAME ensemble, TYPE element);
TYPE FUNC_NAME(supprimer_tete)(CONTAINER_NAME ensemble);
bool FUNC_NAME(appartient)(CONTAINER_NAME ensemble, TYPE element);

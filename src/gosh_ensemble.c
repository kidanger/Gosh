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
#ifdef TYPE

#include <stdlib.h>
#include <stdbool.h>
#include <assert.h>

#include "alloc.h"
#include "gosh_foreach.h"
#include "gosh_ensemble.h"
#include "concat.h"

struct NODE_NAME {
    TYPE element;
    struct NODE_NAME * suivant;
};

struct IMPL_CONTAINER_NAME {
    struct NODE_NAME * tete;
};

GoshIterateur FUNC_NAME(createIterateur)(void) {
	GoshIterateur it = {NULL};
	return it;
}

TYPE * FUNC_NAME(next)(GoshIterateur * it, CONTAINER_NAME ptrContainer, TYPE* element) {
    struct NODE_NAME * ptrNode;

	if (! it->m_pos)
        ptrNode = ptrContainer->data->tete;
	else
		ptrNode = ((struct NODE_NAME *)it->m_pos)->suivant;

	TYPE * ptrElement = NULL;

	it->m_pos = ptrNode;
	if (ptrNode)
		ptrElement = & ptrNode->element;

	if (element && ptrElement)
		*element = * (TYPE *) ptrElement;
	return ptrElement;
}

CONTAINER_NAME CONCAT_2(creer_ensemble_, TYPE_LOWER)(void) {
    CONTAINER_NAME ptrContainer = gosh_alloc(*ptrContainer);
    ptrContainer->data = gosh_alloc(*ptrContainer->data);
    ptrContainer->data->tete = NULL;

    ptrContainer->next = FUNC_NAME(next);
    ptrContainer->createIterateur = FUNC_NAME(createIterateur);
    ptrContainer->vide = FUNC_NAME(vide);
    ptrContainer->ajouter = FUNC_NAME(ajouter);
    ptrContainer->appartient = FUNC_NAME(appartient);
    ptrContainer->supprimer_tete = FUNC_NAME(supprimer_tete);

    return ptrContainer;
}

void CONCAT_2(detruire_ensemble_, TYPE_LOWER)(CONTAINER_NAME ptrContainer) {
    struct IMPL_CONTAINER_NAME * ensemble = ptrContainer->data;
	struct NODE_NAME * noeud = ensemble->tete;
	while (noeud) {
		struct NODE_NAME * suivant = noeud->suivant;
		gosh_free(noeud);
		noeud = suivant;
	}
	gosh_free(ensemble);
    gosh_free(ptrContainer);
}

bool FUNC_NAME(vide)(CONTAINER_NAME ptrContainer) {
    return ptrContainer->data->tete == NULL;
}

void FUNC_NAME(ajouter)(CONTAINER_NAME ptrContainer, TYPE element) {
    struct IMPL_CONTAINER_NAME * ensemble = ptrContainer->data;
	struct NODE_NAME * nouveau = gosh_alloc(*nouveau);
	nouveau->element = element;
    nouveau->suivant = ensemble->tete;
	ensemble->tete = nouveau;
}

TYPE FUNC_NAME(supprimer_tete)(CONTAINER_NAME ptrContainer) {
    struct IMPL_CONTAINER_NAME * ensemble = ptrContainer->data;
	TYPE pos = ensemble->tete->element;
	struct NODE_NAME * vieux = ensemble->tete;
	ensemble->tete = ensemble->tete->suivant;
	gosh_free(vieux);
	return pos;
}

bool FUNC_NAME(appartient)(CONTAINER_NAME ptrContainer, TYPE element) {
    struct NODE_NAME * noeud = ptrContainer->data->tete;
	while (noeud) {
		if (noeud->element == element) {
			return true;
		}
		noeud = noeud->suivant;
	}
	return false;
}

#endif

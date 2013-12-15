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
#ifndef TYPE // on utilise des int par défaut, juste pour que le fichier compile
#define TYPE int
#define TYPE_LOWER ints
#endif

#include <stdlib.h>
#include <stdbool.h>
#include <assert.h>

#include "alloc.h"
#include "gosh_foreach.h"
#include "gosh_ensemble.h"
#include "concat.h"

struct noeud {
	TYPE element;
	struct noeud* suivant;
};
struct gosh_ensemble {
	// extends struct iterable:
	struct C2(type_iterateur_, TYPE)* info_iterable;

	struct noeud* tete;
};

#define FUNC_NAME(name) C3(ensemble_, TYPE_LOWER, _##name)
#define ENSTYPE C2(Ensemble, TYPE)

struct iterateur* FUNC_NAME(begin)(void*);
bool FUNC_NAME(next)(struct iterateur*, TYPE* element);

struct C2(type_iterateur_, TYPE) ensemble_info_iterable = {
	.begin = FUNC_NAME(begin),
	.next = FUNC_NAME(next)
};

ENSTYPE C2(creer_ensemble_, TYPE_LOWER)() {
	ENSTYPE ensemble = gosh_alloc(*ensemble);
	ensemble->tete = NULL;
	ensemble->info_iterable = &ensemble_info_iterable;
	return ensemble;
}

void C2(detruire_ensemble_, TYPE_LOWER)(ENSTYPE ensemble) {
	struct noeud* noeud = ensemble->tete;
	while (noeud != NULL) {
		struct noeud* suivant = noeud->suivant;
		gosh_free(noeud);
		noeud = suivant;
	}

	gosh_free(ensemble);
}

bool FUNC_NAME(vide)(ENSTYPE ensemble) {
	return ensemble->tete == NULL;
}

void FUNC_NAME(ajouter)(ENSTYPE ensemble, TYPE element) {
	struct noeud* nouveau = gosh_alloc(*nouveau);
	nouveau->element = element;
	nouveau->suivant = ensemble->tete;
	ensemble->tete = nouveau;
}

TYPE FUNC_NAME(supprimer_tete)(ENSTYPE ensemble) {
	TYPE pos = ensemble->tete->element;
	struct noeud* vieux = ensemble->tete;
	ensemble->tete = ensemble->tete->suivant;
	gosh_free(vieux);
	return pos;
}

bool FUNC_NAME(appartient)(ENSTYPE ensemble, TYPE element) {
	struct noeud* noeud = ensemble->tete;
	while (noeud != NULL) {
		if (noeud->element == element) {
			return true;
		}
		noeud = noeud->suivant;
	}
	return false;
}


struct iterateur_ensemble {
	struct noeud* courant;
	bool termine;
};

struct iterateur* FUNC_NAME(begin)(void* ens) {
	ENSTYPE ensemble = ens;
	struct iterateur_ensemble* iterateur = gosh_alloc(*iterateur);
	iterateur->courant = ensemble->tete;
	iterateur->termine = false;
	return (struct iterateur*) iterateur;
}
bool FUNC_NAME(next)(struct iterateur* it, TYPE* element) {
	struct iterateur_ensemble* iterateur = (struct iterateur_ensemble*) it;
	if (iterateur->termine) {
		gosh_free(iterateur);
		return false;
	}
	*element = iterateur->courant->element;
	iterateur->courant = iterateur->courant->suivant;
	if (iterateur->courant == NULL) {
		iterateur->termine = true;
	}
	return true;
}

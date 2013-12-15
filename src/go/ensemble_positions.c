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
#include <stdlib.h>
#include <stdbool.h>
#include <assert.h>

#include "alloc.h"
#include "gosh_foreach.h"
#include "go/ensemble_positions.h"

struct noeud_position {
	Position position;
	struct noeud_position* suivant;
};
struct ensemble_positions {
	// extends struct iterable:
	struct type_iterateur* info_iterable;

	struct noeud_position* tete;
	const char* type;
};

struct iterateur* ensemble_positions_tete(const char* type, struct iterable*);
bool ensemble_positions_suivant(struct iterateur*);
void* ensemble_positions_courant(struct iterateur*);

struct type_iterateur ensemble_positions_info_iterable = {
	.tete = ensemble_positions_tete,
	.courant = ensemble_positions_courant,
	.suivant = ensemble_positions_suivant,
};

EnsemblePositions creer_ensemble_positions() {
	EnsemblePositions ensemble = gosh_alloc(*ensemble);
	ensemble->tete = NULL;
	ensemble->info_iterable = &ensemble_positions_info_iterable;
	ensemble->type = "Position";
	return ensemble;
}

void detruire_ensemble_positions(EnsemblePositions ensemble) {
	struct noeud_position* noeud = ensemble->tete;
	while (noeud != NULL) {
		struct noeud_position* suivant = noeud->suivant;
		gosh_free(noeud);
		noeud = suivant;
	}

	gosh_free(ensemble);
}

bool ensemble_positions_vide(EnsemblePositions ensemble) {
	return ensemble->tete == NULL;
}

void ensemble_positions_ajouter(EnsemblePositions ensemble, Position position) {
	struct noeud_position* nouveau = gosh_alloc(*nouveau);
	nouveau->position = position;
	nouveau->suivant = ensemble->tete;
	ensemble->tete = nouveau;
}

Position ensemble_positions_supprimer_tete(EnsemblePositions ensemble) {
	Position pos = ensemble->tete->position;
	ensemble->tete = ensemble->tete->suivant;
	return pos;
}

bool ensemble_positions_appartient(EnsemblePositions ensemble, Position position) {
	struct noeud_position* noeud = ensemble->tete;
	while (noeud != NULL) {
		if (POSITION_EQ(noeud->position, position)) {
			return true;
		}
		noeud = noeud->suivant;
	}
	return false;
}


struct iterateur_ensemble_positions {
	struct noeud_position* courant;
	bool termine;
};

struct iterateur* ensemble_positions_tete(const char* type, struct iterable* ens) {
	EnsemblePositions ensemble = (EnsemblePositions) ens;
	gosh_check_types(ensemble->type, type);

	struct iterateur_ensemble_positions* iterateur = gosh_alloc(*iterateur);
	iterateur->courant = ensemble->tete;
	iterateur->termine = false;
	return (struct iterateur*) iterateur;
}
bool ensemble_positions_suivant(struct iterateur* it) {
	struct iterateur_ensemble_positions* iterateur = (struct iterateur_ensemble_positions*) it;
	if (iterateur->termine) {
		gosh_free(iterateur);
		return false;
	}
	iterateur->courant = iterateur->courant->suivant;
	if (iterateur->courant == NULL) {
		iterateur->termine = true;
	}
	return true;
}
void* ensemble_positions_courant(struct iterateur* it) {
	struct iterateur_ensemble_positions* iterateur = (struct iterateur_ensemble_positions*) it;
	if (iterateur->termine) {
		return (void*) (ptrdiff_t) POSITION_INVALIDE; // ne doit pas être utilisé
	}
	return (void*) (ptrdiff_t) iterateur->courant->position;
}


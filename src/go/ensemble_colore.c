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

#include "gosh_alloc.h"
#include "go/ensemble_colore.h"

struct ImplEnsembleColore {
	EnsemblePosition positions;
	Couleur couleur;
};


EnsembleColore creer_ensemble_colore(Couleur couleur) {
	EnsembleColore ptrEnsemble = gosh_alloc(*ptrEnsemble);
	ptrEnsemble->data = gosh_alloc(*ptrEnsemble->data);
	struct ImplEnsembleColore * ensemble = ptrEnsemble->data;

	ensemble->couleur = couleur;
	ensemble->positions = creer_ensemble_position();

	ptrEnsemble->next = ensemble_colore_next;
	ptrEnsemble->createIterateur = ensemble_colore_createIterateur;
	ptrEnsemble->vide = ensemble_colore_vide;
	ptrEnsemble->ajouter = ensemble_colore_ajouter;
	ptrEnsemble->appartient = ensemble_colore_appartient;
	ptrEnsemble->nombre_elements = ensemble_colore_nombre_elements;

	return ptrEnsemble;
}

void detruire_ensemble_colore(EnsembleColore ptrEnsemble) {
	detruire_ensemble_position(ptrEnsemble->data->positions);
	gosh_free(ptrEnsemble->data);
	gosh_free(ptrEnsemble);
}

Couleur ensemble_colore_couleur(EnsembleColore ptrEnsemble) {
	return ptrEnsemble->data->couleur;
}
EnsemblePosition ensemble_colore_positions(EnsembleColore ptrEnsemble) {
	return ptrEnsemble->data->positions;
}

void ensemble_colore_set_couleur(EnsembleColore ptrEnsemble, Couleur couleur) {
	ptrEnsemble->data->couleur = couleur;
}

GoshIterateur ensemble_colore_createIterateur(void) {
	return ensemble_position_createIterateur();
}

Position * ensemble_colore_next(GoshIterateur * it, EnsembleColore ptrEnsemble, Position* position) {
	return ptrEnsemble->data->positions->next(it, ptrEnsemble->data->positions, position);
}

bool ensemble_colore_vide(EnsembleColore ptrEnsemble) {
	return gosh_vide(ptrEnsemble->data->positions);
}

void ensemble_colore_ajouter(EnsembleColore ptrEnsemble, Position position) {
	gosh_ajouter(ptrEnsemble->data->positions, position);
}

bool ensemble_colore_appartient(EnsembleColore ptrEnsemble, Position position) {
	return gosh_appartient(ptrEnsemble->data->positions, position);
}

int ensemble_colore_nombre_elements(EnsembleColore ptrEnsemble) {
	return gosh_nombre_elements(ptrEnsemble->data->positions);
}

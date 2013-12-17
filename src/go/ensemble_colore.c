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

#include "alloc.h"

#define SHOW_IMPLEMENTATION_ENSEMBLE_COLORE
#include "go/ensemble_colore.h"


EnsembleColore creer_ensemble_colore(Couleur couleur) {
	EnsembleColore ensemble = gosh_alloc(*ensemble);
	ensemble->couleur = couleur;
	ensemble->positions = creer_ensemble_position();

	ensemble->next = ensemble_colore_next;
	ensemble->createIterateur = ensemble_colore_createIterateur;
	ensemble->vide = ensemble_colore_vide;
	ensemble->ajouter = ensemble_colore_ajouter;
	ensemble->appartient = ensemble_colore_appartient;

	return ensemble;
}

void detruire_ensemble_colore(EnsembleColore ensemble) {
    detruire_ensemble_position( ensemble->positions);
	gosh_free(ensemble);
}

Couleur ensemble_colore_couleur(EnsembleColore ensemble) {
	return ensemble->couleur;
}
EnsemblePosition ensemble_colore_positions(EnsembleColore ensemble) {
	return ensemble->positions;
}

void ensemble_colore_set_couleur(EnsembleColore ensemble, Couleur couleur) {
	ensemble->couleur = couleur;
}

GoshIterateur ensemble_colore_createIterateur(void) {
	return ensemble_position_createIterateur();
}

Position * ensemble_colore_next(GoshIterateur * it, EnsembleColore ensemble, Position* position) {
    return ensemble->positions->next(it, ensemble->positions, position);
}

bool ensemble_colore_vide(EnsembleColore ensemble) {
	return gosh_vide(ensemble->positions);
}

void ensemble_colore_ajouter(EnsembleColore ensemble, Position position) {
	gosh_ajouter(ensemble->positions, position);
}

bool ensemble_colore_appartient(EnsembleColore ensemble, Position position) {
	return gosh_appartient(ensemble->positions, position);
}

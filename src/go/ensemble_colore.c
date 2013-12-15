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
#include "go/ensemble_colore.h"

struct ensemble_colore {
	EnsemblePosition positions;
	Couleur couleur;
};

EnsembleColore creer_ensemble_colore(Couleur couleur) {
	EnsembleColore ensemble = gosh_alloc(*ensemble);
	ensemble->couleur = couleur;
	ensemble->positions = creer_ensemble_position();
	return ensemble;
}

void detruire_ensemble_colore(EnsembleColore ensemble) {
	detruire_ensemble_position(ensemble->positions);
	gosh_free(ensemble);
}

Couleur ensemble_colore_couleur(EnsembleColore ensemble) {
	return ensemble->couleur;
}
EnsemblePosition ensemble_colore_positions(EnsembleColore ensemble) {
	return ensemble->positions;
}

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
#ifndef GOSH_GO_ENSEMBLE_COLORE
#define GOSH_GO_ENSEMBLE_COLORE

#include "ensemble_positions.h"
#include "couleur.h"

struct ImplEnsembleColore;

typedef struct s_EnsembleColore {
	TYPE * (* next)(GoshIterateur *, struct s_EnsembleColore *, TYPE *);
	GoshIterateur(*createIterateur)(void);
	bool (*vide)(struct s_EnsembleColore *);
	void (*ajouter)(struct s_EnsembleColore *, TYPE);
	bool (*appartient)(struct s_EnsembleColore *, TYPE);
	int (*nombre_elements)(struct s_EnsembleColore *);

	struct ImplEnsembleColore * data;

} * EnsembleColore;

EnsembleColore creer_ensemble_colore();
void detruire_ensemble_colore(EnsembleColore ensemble);

Couleur ensemble_colore_couleur(EnsembleColore ensemble);
EnsemblePosition ensemble_colore_positions(EnsembleColore ensemble);

void ensemble_colore_set_couleur(EnsembleColore ensemble, Couleur couleur);

GoshIterateur ensemble_colore_createIterateur(void);
Position * ensemble_colore_next(GoshIterateur * it, EnsembleColore ensemble, Position* position);
bool ensemble_colore_vide(EnsembleColore ensemble);
void ensemble_colore_ajouter(EnsembleColore ensemble, Position position);
bool ensemble_colore_appartient(EnsembleColore ensemble, Position position);
int ensemble_colore_nombre_elements(EnsembleColore ensemble);

#endif

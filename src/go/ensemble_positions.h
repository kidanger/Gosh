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
#ifndef GOSH_GO_ENSEMBLE_POSITIONS
#define GOSH_GO_ENSEMBLE_POSITIONS

#include <stdbool.h>

#include "position.h"
#include "gosh_foreach.h"

typedef struct ensemble_positions* EnsemblePositions;

EnsemblePositions creer_ensemble_positions();
void detruire_ensemble_positions(EnsemblePositions ensemble);

bool ensemble_positions_vide(EnsemblePositions ensemble);
void ensemble_positions_ajouter(EnsemblePositions ensemble, Position position);
Position ensemble_positions_supprimer_tete(EnsemblePositions ensemble);
bool ensemble_positions_appartient(EnsemblePositions ensemble, Position position);

typedef struct iterateur_ensemble_positions* IterateurEnsemblePositions;

IterateurEnsemblePositions ensemble_positions_tete(EnsemblePositions);
bool ensemble_positions_suivant(IterateurEnsemblePositions);
Position ensemble_positions_courant(IterateurEnsemblePositions);
void ensemble_positions_detruire_iterateur(IterateurEnsemblePositions);

#endif


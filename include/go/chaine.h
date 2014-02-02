/* Copyright © 2013-2014 Jérémy Anger, Denis Migdal
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
#ifndef GOSH_GO_CHAINE
#define GOSH_GO_CHAINE

#include "go/ensemble_colore.h"
#include "go/ensemble_positions.h"
#include "go/plateau_type.h"

typedef EnsembleColore Chaine;

/** @brief Détermine la position des yeux relatifs à une chaine.
 * Si la chaine n’a aucun oeil alors la valeur retournée est NULL. */
EnsemblePosition lesYeuxDeLaChaine(Chaine chaine, Plateau plateau);

// pour moins de verbosité dans le code
bool chaine_appartient(Chaine chaine, Position position);

#define creer_chaine creer_ensemble_colore
#define detruire_chaine detruire_ensemble_colore

#endif

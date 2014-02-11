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

/** @file libertés.c
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 *  @brief Implémente les fonctions relatives aux libertés ainsi que les ensembles de libertés.
 */

#include "gosh_macros.h"
#include "go/libertes.h"
#include "go/libertes.h"

Libertes determiner_libertes(Plateau plateau, Chaine chaine)
{
	if (! chaine)
		return NULL;

	Libertes libertes = creer_ensemble_position();

	Position pos;
	gosh_foreach(pos, ensemble_colore_positions(chaine)) {
		const Position a_tester[] = POSITION_VOISINS(pos);
		for (int i = 0; i < 4; i++) {
			Position p = a_tester[i];
			if (position_est_valide(p) && plateau_get_at(plateau, p) == VIDE) {
				if (!ensemble_position_appartient(libertes, p)) {
					ensemble_position_ajouter(libertes, p);
				}
			}
		}
	}
	return libertes;
}

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

/** @file chaine.c
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 *  @brief Implémente les fonctionnalités relative aux chaines
 */

#include <stdlib.h>

#include "go/territoire.h"
#include "go/chaine.h"

EnsemblePosition lesYeuxDeLaChaine(Chaine chaine, Plateau plateau)
{
	EnsemblePosition yeux = creer_ensemble_position();
	Couleur couleur_chaine = ensemble_colore_couleur(chaine);
	Position position_chaine;

	// pour chacune des positions adjacentes à la chaine
	gosh_foreach(position_chaine, chaine) {
		Position voisins[] = POSITION_VOISINS(position_chaine);
		for (int i = 0; i < 4; i++) {
			Position position = voisins[i];

			if (position_est_valide(position)) {
				// on regarde si le territoire ne comporte qu'une case
				// et qu'il est de la même couleur que la chaine
				Territoire territoire = determiner_territoire(plateau, position);
				if (gosh_nombre_elements(territoire) == 1) {
					Couleur couleur = ensemble_colore_couleur(territoire);
					if (couleur == couleur_chaine) {
						gosh_ajouter(yeux, position);
					}
				}

				detruire_territoire(territoire);
			}
		}
	}

	if (gosh_vide(yeux)) {
		detruire_ensemble_position(yeux);
		yeux = NULL;
	}
	return yeux;
}

bool chaine_appartient(Chaine chaine, Position position)
{
	return ensemble_position_appartient(ensemble_colore_positions(chaine), position);
}

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
#include "go/territoire.h"
#include "go/plateau.h"
#include "go/libertes.h"

/** @file territoire.c
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 */

Territoire determiner_territoire(Plateau plateau, Position position)
{
	Territoire territoire = creer_ensemble_colore(VIDE);
	EnsemblePosition territoire_positions = ensemble_colore_positions(territoire);

	EnsemblePosition possibles = creer_ensemble_position();
	Couleur couleur = VIDE;
	bool couleur_connue = false;

	ensemble_position_ajouter(possibles, position);

	/// @todo remplacer par une pile.
	while (!ensemble_position_vide(possibles)) {
		Position courante = ensemble_position_supprimer_tete(possibles);

		Couleur c = plateau_get_at(plateau, courante);
		if (c == VIDE) {
			if (!territoire_appartient(territoire, courante)) {
				ensemble_position_ajouter(territoire_positions, courante);

				const Position a_tester[] = {
					position_gauche(courante),
					position_droite(courante),
					position_haut(courante),
					position_bas(courante),
				};
				for (int p = 0; p < 4; p++) {
					if (position_est_valide(a_tester[p]))
						ensemble_position_ajouter(possibles, a_tester[p]);
				}
			}
		} else {
			// si la case n'est pas vide, elle est à coté du territoire
			// on regarde sa couleur
			if (!couleur_connue) { // le territoire n'a pas encore de couleur défini
				couleur = c;
				couleur_connue = true;
			} else if (couleur != c) // le territoire est entouré par deux couleurs différentes
				couleur = VIDE;
		}
	}

	ensemble_colore_set_couleur(territoire, couleur);
	detruire_ensemble_position(possibles);
	return territoire;
}

bool estUnSeki(Territoire territoire, Chaines chaines, Plateau plateau)
{
	// le territoire ne doit avoir que deux cases, entouré de chaines de couleurs différentes
	if (gosh_nombre_elements(territoire) == 2 && ensemble_colore_couleur(territoire) == VIDE) {
		// les chaines doivent avoir seulement ces deux libertés
		Chaine chaine;
		gosh_foreach(chaine, chaines) {
			Libertes libertes = determiner_libertes(plateau, chaine);
			Position position;
			if (gosh_nombre_elements(libertes) != 2) {
				detruire_libertes(libertes);
				return false;
			}
			gosh_foreach(position, libertes) {
				if (!gosh_appartient(territoire, position)) {
					detruire_libertes(libertes);
					return false;
				}
			}
			detruire_libertes(libertes);
		}
		return true;
	}
	return false;
}

bool territoire_appartient(Territoire territoire, Position position)
{
	return gosh_appartient(ensemble_colore_positions(territoire),
	                       position);
}


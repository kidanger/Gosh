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
#include <string.h> // memset

#include "alloc.h"
#include "go/territoire.h"
#include "go/plateau.h"
#include "go/ensemble_positions.h"

struct plateau {
	Couleur* cases;
	size_t taille;
};

#define CASE_AT(p, i, j) ((p)->cases[(j) * (p)->taille + (i)])
#define CASE_AT_P(p, pos) CASE_AT((p), POSITION_X((pos)), POSITION_Y((pos)))

Plateau creer_plateau(size_t taille) {
	Plateau plateau = gosh_alloc(*plateau);
	plateau->taille = taille;
	plateau->cases = gosh_allocn(Couleur, taille * taille);
	memset(plateau->cases, 0, taille * taille);
	return plateau;
}

void detruire_plateau(Plateau plateau) {
	gosh_free(plateau->cases);
	gosh_free(plateau);
}

Couleur plateau_get(Plateau plateau, int i, int j) {
	return CASE_AT(plateau, i, j);
}

Couleur plateau_get_at(Plateau plateau, Position pos) {
	return CASE_AT_P(plateau, pos);
}

void plateau_set(Plateau plateau, int i, int j, Couleur couleur) {
	CASE_AT(plateau, i, j) = couleur;
}

size_t plateau_get_taille(Plateau plateau) {
	return plateau->taille;
}

Chaine plateau_determiner_chaine(Plateau plateau, Position pos) {
	Couleur couleur = CASE_AT_P(plateau, pos);

	if (couleur == VIDE)
		return NULL;

	Chaine chaine = creer_ensemble_colore(couleur);
	EnsemblePosition positions_chaine = ensemble_colore_positions(chaine);

	// utilisation de EnsemblePositions comme d'une pile
	EnsemblePosition possibles = creer_ensemble_position();
	gosh_ajouter(possibles, pos);
	while (!gosh_vide(possibles)) {
		Position courante = ensemble_position_supprimer_tete(possibles);
		if (CASE_AT_P(plateau, courante) == couleur) {
			if (!gosh_appartient(positions_chaine, courante)) {
				gosh_ajouter(positions_chaine, courante);

				const Position a_tester[] = {
					POSITION_GAUCHE(courante, plateau->taille),
					POSITION_DROITE(courante, plateau->taille),
					POSITION_HAUT(courante, plateau->taille),
					POSITION_BAS(courante, plateau->taille),
				};
				for (int p = 0; p < 4; p++) {
					if (POSITION_EST_VALIDE(a_tester[p]))
						gosh_ajouter(possibles, a_tester[p]);
				}
			}
		}
	}
	detruire_ensemble_position(possibles);

	return chaine;
}

void plateau_realiser_capture(Plateau plateau, Chaine chaine) {
    Position position;
    gosh_foreach(position, chaine) {
        CASE_AT_P(plateau, position) = VIDE;
    }
}

bool plateau_est_identique(Plateau plateau, Plateau ancienPlateau) {
    if (plateau->taille != ancienPlateau->taille) {
        return false;
    }
    size_t taille = plateau->taille;
    for (int x = 0; x < taille; x++) {
        for (int y = 0; y < taille; y++) {
            if (CASE_AT(plateau, x, y) != CASE_AT(ancienPlateau, x, y)) {
                return false;
            }
        }
    }
    return true;
}

void plateau_copie(Plateau from, Plateau to) {
    size_t taille = from->taille;
    for (int x = 0; x < taille; x++) {
        for (int y = 0; y < taille; y++) {
            CASE_AT(to, x, y) = CASE_AT(from, x, y);
        }
    }
}

Chaines plateau_entoure_un_territoire(Plateau plateau, Territoire territoire) {
    Chaines chaines = creer_ensemble_chaine();
    Position position;
    gosh_foreach (position, territoire) {
        Chaine chaine = plateau_determiner_chaine(plateau, position);
        if (chaine) {
            if (gosh_appartient(chaines, chaine)) {
                detruire_ensemble_chaine(chaines);
            } else {
                gosh_ajouter(chaines, chaine);
            }
        }
    }
    return chaines;
}

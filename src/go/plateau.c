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
#include <stdint.h>
#include <string.h> // memset

#include "gosh_alloc.h"
#include "go/territoire.h"
#include "go/plateau.h"
#include "go/libertes.h"

struct s_Plateau {
    uint32_t * cases;
	size_t taille;
};

Position POSITION(Plateau p, size_t x, size_t y)
{
    if( x >= p->taille || y >= p->taille)
        return POSITION_INVALIDE;
    return x * p->taille + y;
}

bool POSITION_EST_VALIDE(Plateau p, Position pos)
{
    return ! pos >= p->taille * p->taille;
}

size_t POSITION_X(Plateau p, Position pos)
{
    if( ! POSITION_EST_VALIDE(p, pos) )
        return -1;
    return pos/p->taille;
}

size_t POSITION_Y(Plateau p, Position pos)
{
    if( ! POSITION_EST_VALIDE(p, pos) )
        return -1;
    return pos % p->taille;
}

Position POSITION_GAUCHE(Plateau p, Position pos)
{
    size_t x = POSITION_X(p, pos);
    if( x == -1)
        return POSITION_INVALIDE;
    if( ! x)
        return POSITION_INVALIDE;

    return pos - p->taille;
}

Position POSITION_DROITE(Plateau p, Position pos)
{
    size_t x = POSITION_X(p, pos);
    if( x == -1)
        return POSITION_INVALIDE;
    if( x == p->taille - 1)
        return POSITION_INVALIDE;

    return pos + p->taille;
}

Position POSITION_HAUT(Plateau p, Position pos)
{
    size_t y = POSITION_X(p, pos);
    if( y == -1)
        return POSITION_INVALIDE;
    if( ! y)
        return POSITION_INVALIDE;

    return pos - 1;
}

Position POSITION_BAS(Plateau p, Position pos)
{
    size_t y = POSITION_Y(p, pos);
    if( y == -1)
        return POSITION_INVALIDE;
    if( y == p->taille - 1)
        return POSITION_INVALIDE;
    return pos + 1;
}

Plateau creer_plateau(size_t taille) {
	Plateau plateau = gosh_alloc(*plateau);
	plateau->taille = taille;
    size_t nbOctets = (taille * taille * 2 + 7) / 8; //arrondit à l'entier supérieur.
    plateau->cases = gosh_alloc_size(nbOctets);
    memset(plateau->cases, 0, nbOctets);
	return plateau;
}

void detruire_plateau(Plateau plateau) {
	gosh_free(plateau->cases);
	gosh_free(plateau);
}



Couleur plateau_get(Plateau plateau, int i, int j) {
    return plateau_get_at(plateau, POSITION(plateau, i, j));
}

Couleur plateau_get_at(Plateau plateau, Position pos) {
    size_t offset = pos/(sizeof(uint32_t)/2);
    uint32_t partie = plateau->cases[offset];
    pos -= offset*sizeof(uint32_t)/2;
    return (partie & (0x11 << pos*2) >> pos);
}

void plateau_set(Plateau plateau, int i, int j, Couleur couleur) {
    plateau_set_at(plateau, POSITION(plateau, i, j), couleur);
}

void plateau_set_at(Plateau plateau, Position pos, Couleur couleur)
{
    size_t offset = pos/(sizeof(uint32_t)/2);
    uint32_t * partie = plateau->cases + offset;
    pos -= offset*sizeof(uint32_t)/2;
    *partie = (*partie | (0x11 << pos*2)  ) & ( (uint32_t)-1 & couleur << pos*2 );
}

size_t plateau_get_taille(Plateau plateau) {
	return plateau->taille;
}

Chaine plateau_determiner_chaine(Plateau plateau, Position pos) {
    Couleur couleur = plateau_get_at(plateau, pos);

	if (couleur == VIDE)
		return NULL;

	Chaine chaine = creer_ensemble_colore(couleur);
	EnsemblePosition positions_chaine = ensemble_colore_positions(chaine);

	// utilisation de EnsemblePositions comme d'une pile
	EnsemblePosition possibles = creer_ensemble_position();
	gosh_ajouter(possibles, pos);
	while (!gosh_vide(possibles)) {
		Position courante = ensemble_position_supprimer_tete(possibles);
        if ( plateau_get_at(plateau, courante) == couleur) {
			if (!gosh_appartient(positions_chaine, courante)) {
				gosh_ajouter(positions_chaine, courante);

				const Position a_tester[] = {
                    POSITION_GAUCHE(plateau, courante),
                    POSITION_DROITE(plateau, courante),
                    POSITION_HAUT(plateau, courante),
                    POSITION_BAS(plateau, courante),
				};
				for (int p = 0; p < 4; p++) {
                    if (POSITION_EST_VALIDE(plateau, a_tester[p]))
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
        plateau_set_at(plateau, position, VIDE);
	}
}

bool plateau_est_identique(Plateau plateau, Plateau ancienPlateau) {
	if (plateau->taille != ancienPlateau->taille) {
		return false;
	}
    return ! memcmp(plateau->cases,
                    ancienPlateau->cases,
                    (plateau->taille * plateau->taille * 2 + 7) / 8);
}

void plateau_copie(Plateau from, Plateau to) {
    to->taille = from->taille;
    size_t taille = (from->taille * from->taille * 2 + 7) / 8;
    gosh_realloc_size(to->cases, taille);
    memcpy(to->cases, from->cases, taille);
}

Chaines plateau_entoure_un_territoire(Plateau plateau, Territoire territoire) {
	Chaines chaines = creer_ensemble_chaine();
	Position position;
	gosh_foreach(position, territoire) {
		const Position a_tester[] = {
            POSITION_GAUCHE(plateau, position),
            POSITION_DROITE(plateau, position),
            POSITION_HAUT(plateau, position),
            POSITION_BAS(plateau, position),
		};
		for (int i = 0; i < 4; i++) {
			Position p = a_tester[i];
            if (POSITION_EST_VALIDE(plateau, p)) {
				Chaine chaine = plateau_determiner_chaine(plateau, p);
				if (chaine) {
					if (gosh_appartient(chaines, chaine)) {
						detruire_ensemble_colore(chaine);
					} else {
						gosh_ajouter(chaines, chaine);
					}
				}
			}
		}
	}
	return chaines;
}


Chaines plateau_capture_chaines(Plateau plateau, s_Pion pion, bool* valide) {
	size_t taille = plateau->taille;
	// TODO: free
	*valide = false;

	// il y a déjà une case
    if ( plateau_get_at(plateau, pion.position) != VIDE) {
		gosh_debug("déjà une case");
		return NULL;
	}

	Territoire milieu = determiner_territoire(plateau, pion.position);

	// on collecte les chaines menacées et les chaines amies
	Chaines chaines_menacees = creer_ensemble_chaine();
	Chaines chaines_amies = creer_ensemble_chaine();
	Chaines autour = plateau_entoure_un_territoire(plateau, milieu);
	Couleur autre_couleur = pion.couleur == BLANC ? NOIR : BLANC;
	Chaine chaine_tmp;
	gosh_foreach(chaine_tmp, autour) {
		if (ensemble_colore_couleur(chaine_tmp) == autre_couleur) {
			gosh_ajouter(chaines_menacees, chaine_tmp);
		} else if (ensemble_colore_couleur(chaine_tmp) == pion.couleur) {
			gosh_ajouter(chaines_amies, chaine_tmp);
		}
	}

	Chaines chaines_capturees = creer_ensemble_chaine();
	Chaine chaine_menacee;

	// on vérifie lesquelles sont capturables
	gosh_foreach(chaine_menacee, chaines_menacees) {
		Libertes lib = determiner_libertes(plateau, chaine_menacee);
		if (gosh_nombre_elements(lib) == 1) {
			plateau_realiser_capture(plateau, chaine_menacee);
			gosh_ajouter(chaines_capturees, chaine_menacee);
			gosh_debug("ajout d'une chaine capturée");
		}
		detruire_ensemble_position(lib);
	}
	detruire_ensemble_chaine(chaines_menacees);

	// on recalcule le territoire, puisqu'on a capturé des chaines
	Territoire territoire = determiner_territoire(plateau, pion.position);
	// si on a plus d'une case libre autour (donc territoire >= 2), on peut jouer
	// sinon, on vérifie les chaines amies
	if (gosh_nombre_elements(territoire) == 1) {
		// on a pas d'amies à côté, on ne peut pas jouer ici
		if (gosh_vide(chaines_amies)) {
			goto annuler_captures;
		} else {
			// on vérifie qu'on pouvait bien faire ce mouvement : on ne doit pas bloquer de libertés
			bool bloquant = true;
			gosh_foreach(chaine_menacee, chaines_amies) {
				Libertes lib = determiner_libertes(plateau, chaine_menacee);
				if (gosh_nombre_elements(lib) != 1) {
					bloquant = false;
				}
				detruire_ensemble_position(lib);
			}

			// on annule les captures si le coup bloque d'autres chaines
			if (bloquant) {
				goto annuler_captures;
			}
			if (false) {
				Chaine chaine;
annuler_captures:
				gosh_foreach(chaine, chaines_capturees) {
					Position pos;
					gosh_foreach(pos, chaine) {
                        plateau_set_at(plateau, pos, autre_couleur);
					}
				}
				detruire_ensemble_chaine(chaines_capturees);
				return NULL;
			}
		}
	}
	detruire_ensemble_colore(territoire);

	*valide = true;
    plateau_set_at(plateau, pion.position, pion.couleur);
	if (gosh_vide(chaines_capturees))
		return NULL;
	return chaines_capturees;
}


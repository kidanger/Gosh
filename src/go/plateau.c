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

/** @file plateau.c
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 *  @brief Implémente tous les fonctions liées au plateau
 */

#include <stdlib.h>
#include <string.h> // memset
#include <assert.h>

#include "gosh_alloc.h"
#include "go/territoire.h"
#include "go/plateau.h"
#include "go/libertes.h"

/** @ingroup go
 *  @brief Représente un plateau
 */
struct s_Plateau {
    /** @brief Données du tableau */
	uint32_t * cases;
    /** @brief Taille du plateau */
	int taille;
};

/** @ingroup go
 *  @brief Donne la taille en "cases" des données du tableau
 *  @param taille du tableau
 *  @return taille en "cases" des données du tableau
 */
size_t impl_get_nbCases(size_t taille)
{
	size_t tailleCasesEnBits = (taille * taille * 2);
	size_t tailleUneCaseEnBits = (sizeof(uint32_t) * 8);
	size_t nbCases = (tailleCasesEnBits + tailleUneCaseEnBits - 1) / tailleUneCaseEnBits; //arrondit à l'entier supérieur.
	return nbCases;
}

size_t plateau_data_size(size_t taille)
{
	return impl_get_nbCases(taille) * sizeof(uint32_t);
}

Plateau creer_plateau(int taille)
{
	Plateau plateau = gosh_alloc(*plateau);
	plateau->taille = taille;
	int nbCases = impl_get_nbCases(taille);
	plateau->cases = gosh_allocn(uint32_t, nbCases);
	memset(plateau->cases, VIDE, sizeof(uint32_t) * nbCases);
	return plateau;
}

void detruire_plateau(Plateau plateau)
{
	gosh_free(plateau->cases);
	gosh_free(plateau);
}


Couleur plateau_get(Plateau plateau, int i, int j)
{
	static size_t nbPosParCase = sizeof(uint32_t) * 8 / 2;
	assert(i >= 0);
	assert(j >= 0);
	assert(i < plateau->taille);
	assert(j < plateau->taille);
	unsigned short pos = i * plateau->taille + j;
	size_t offset = pos / nbPosParCase;
	uint32_t partie = plateau->cases[offset];
	pos -= offset * nbPosParCase;
	return ((partie & (0x3 << pos * 2)) >> pos * 2);
}

Couleur plateau_get_at(Plateau plateau, Position pos)
{
	return plateau_get(plateau, pos.x, pos.y);
}

void plateau_set(Plateau plateau, int i, int j, Couleur couleur)
{
	static size_t nbPosParCase = sizeof(uint32_t) * 8 / 2;
	assert(i >= 0);
	assert(j >= 0);
	assert(i < plateau->taille);
	assert(j < plateau->taille);
	unsigned short pos = i * plateau->taille + j;
	size_t offset = pos / nbPosParCase;
	uint32_t * partie = plateau->cases + offset;
	pos -= offset * nbPosParCase;

	*partie = ~(~*partie | (0x3 << pos * 2));
	*partie ^= (uint32_t)(couleur << pos * 2);
}

void plateau_set_at(Plateau plateau, Position pos, Couleur couleur)
{
	plateau_set(plateau, pos.x, pos.y, couleur);
}

int plateau_get_taille(Plateau plateau)
{
	return plateau->taille;
}

Chaine plateau_determiner_chaine(Plateau plateau, Position pos)
{
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
		if (plateau_get_at(plateau, courante) == couleur) {
			if (!gosh_appartient(positions_chaine, courante)) {
				gosh_ajouter(positions_chaine, courante);

				const Position a_tester[] = POSITION_VOISINS(courante);
				for (int p = 0; p < 4; p++) {
					if (position_est_valide(a_tester[p]))
						gosh_ajouter(possibles, a_tester[p]);
				}
			}
		}
	}
	detruire_ensemble_position(possibles);

	return chaine;
}

void plateau_realiser_capture(Plateau plateau, Chaine chaine)
{
	Position position;
	gosh_foreach(position, chaine) {
		plateau_set_at(plateau, position, VIDE);
	}
}

bool plateau_est_identique(Plateau plateau, Plateau ancienPlateau)
{
	if (plateau->taille != ancienPlateau->taille) {
		return false;
	}
	return ! memcmp(plateau->cases,
	                ancienPlateau->cases,
	                plateau_data_size(plateau->taille));
}

void plateau_copie(Plateau from, Plateau to)
{
	if (to->taille != from->taille) {
		size_t nbCases = impl_get_nbCases(from->taille);
		to->taille = from->taille;
		gosh_reallocn(to->cases, uint32_t, nbCases);
	}
	memcpy(to->cases, from->cases, plateau_data_size(from->taille));
}
Plateau plateau_clone(Plateau from)
{
	Plateau clone = creer_plateau(from->taille);
	plateau_copie(from, clone);
	return clone;
}

Chaines plateau_entoure_un_territoire(Plateau plateau, Territoire territoire)
{
	Chaines chaines = creer_chaines();
	Position position;
	gosh_foreach(position, territoire) {
		const Position a_tester[] = POSITION_VOISINS(position);
		for (int i = 0; i < 4; i++) {
			Position p = a_tester[i];
			if (position_est_valide(p)) {
				Chaine chaine = plateau_determiner_chaine(plateau, p);
				if (chaine) {
					Chaine chaine_tmp;
					// on recherche une chaine qui contient une même position
					// si c'est le cas, alors on n'ajoute pas la nouvelle chaine
					// à la liste
					bool appartient = false;
					gosh_foreach(chaine_tmp, chaines) {
						Position pos;
						gosh_foreach(chaine_tmp, chaines) {
							if (gosh_appartient(chaine_tmp, pos)) {
								appartient = true;
								break;
							}
						}
						if (appartient)
							break;
					}
					if (appartient) {
						detruire_chaine(chaine);
					} else {
						gosh_ajouter(chaines, chaine);
					}
				}
			}
		}
	}
	return chaines;
}


Chaines plateau_capture_chaines(Plateau plateau, s_Pion pion, bool* valide)
{
	*valide = false;

	// il y a déjà une case
	if (plateau_get_at(plateau, pion.position) != VIDE) {
		return NULL;
	}

	// on collecte les chaines menacées et les chaines amies
	Chaines chaines_menacees = creer_chaines();
	Chaines chaines_amies = creer_chaines();

	Chaines autour = creer_chaines();
	const Position a_tester[] = POSITION_VOISINS(pion.position);
	for (int i = 0; i < 4; i++) {
		Position p = a_tester[i];
		if (position_est_valide(p)) {
			Chaine c = plateau_determiner_chaine(plateau, p);
			if (c)
				gosh_ajouter(autour, c);
		}
	}

	Couleur autre_couleur = pion.couleur == BLANC ? NOIR : BLANC;
	while (!gosh_vide(autour)) {
		// pas de gosh_foreach car on fait passer les chaines d'une instance à l'autre
		// donc il ne faut pas les garder dans 'autour' sinon elles vont être freed
		Chaine chaine_tmp = gosh_supprimer_tete(autour);
		if (ensemble_colore_couleur(chaine_tmp) == autre_couleur) {
			gosh_ajouter(chaines_menacees, chaine_tmp);
		} else if (ensemble_colore_couleur(chaine_tmp) == pion.couleur) {
			gosh_ajouter(chaines_amies, chaine_tmp);
		}
	}
	detruire_chaines(autour);

	Chaines chaines_capturees = creer_chaines();

	// on vérifie lesquelles sont capturables
	while (!gosh_vide(chaines_menacees)) {
		Chaine chaine_menacee = gosh_supprimer_tete(chaines_menacees);
		Libertes lib = determiner_libertes(plateau, chaine_menacee);
		if (gosh_nombre_elements(lib) == 1) {
			plateau_realiser_capture(plateau, chaine_menacee);
			gosh_ajouter(chaines_capturees, chaine_menacee);
		} else {
			detruire_chaine(chaine_menacee);
		}
		detruire_ensemble_position(lib);
	}
	detruire_chaines(chaines_menacees);

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
			while (!gosh_vide(chaines_amies)) {
				Chaine amie = gosh_supprimer_tete(chaines_amies);
				Libertes lib = determiner_libertes(plateau, amie);
				if (gosh_nombre_elements(lib) != 1) {
					bloquant = false;
				}
				detruire_libertes(lib);
				detruire_chaine(amie);
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
				detruire_chaines(chaines_amies);
				detruire_chaines(chaines_capturees);
				detruire_territoire(territoire);
				return NULL;
			}
		}
	}
	detruire_territoire(territoire);
	detruire_chaines(chaines_amies);

	*valide = true;
	plateau_set_at(plateau, pion.position, pion.couleur);
	if (gosh_vide(chaines_capturees)) {
		detruire_chaines(chaines_capturees);
		return NULL;
	}
	return chaines_capturees;
}

const uint32_t * plateau_data(Plateau p)
{
	return p->cases;
}


void plateau_load_data(Plateau plateau, const uint32_t * data)
{
	memcpy(plateau->cases, data, sizeof(uint32_t) * impl_get_nbCases(plateau->taille));

}

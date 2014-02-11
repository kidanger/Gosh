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

/** @defgroup random
 *  @brief Ensemble des fonctions et des fichiers relatifs à l'IA aléaoire.
 */

/** @file random/main.c
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup random
 *  @brief Bibliothèque de l'IA aléatoire
 */


#include <stdlib.h>
#include <stdio.h>
#include <time.h>

#include "go/ordinateur.h"
#include "go/plateau.h"
#include "gosh_macros.h"
#include "gosh_alloc.h"

/** @ingroup random
 *  @brief Demande à l'IA aléatoire de jouer un coup
 *  @param vide
 *  @param Partie en cours
 *  @param Joueur joué par l'IA aléatoire
 */
void JOUER_COUP(void* data, Partie partie, enum CouleurJoueur couleur)
{
	(void) data;
	(void) couleur;

	size_t taille = plateau_get_taille(partie->plateau);
	s_Coup coup;
	int essais_restants = 1000;
	do {
		int x = rand() % taille;
		int y = rand() % taille;
		coup.position = position(x, y, taille);
		essais_restants--;
	} while ((plateau_get_at(partie->plateau, coup.position) != VIDE
	          || !partie_jouer_coup(partie, coup)) && essais_restants > 0);
	if (essais_restants == 0) {
		coup.position = POSITION_INVALIDE;
		partie_jouer_coup(partie, coup);
	}
}

/** @ingroup random
 *  @brief Initialise l'IA aléatoire
 *  @return E/S (vide)
 */
void* INITIALISER()
{
    srand(time(NULL));
	gosh_debug("Initialisation du botrandom");
    return (void*) 0x1;
}


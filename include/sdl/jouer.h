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
#ifndef GOSH_SDL_JOUER
#define GOSH_SDL_JOUER

/** @file jouer.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup sdl
 *  @brief Gère l'état qui correspond à l'écran de jeu
 */

#include "go/partie.h"

/** @ingroup sdl
 *  @brief Créer l'écran de jeu
 *  @param État parent (menu principal)
 *  @param Partie en cours
 */
struct state* creer_jouer(struct state* parent, Partie partie);

/** @ingroup sdl
 *  @brief Détruit l'écran de jeu
 *  @param État correspondant à l'écran de jeu
 */
void detruire_jouer(struct state*);

/** @ingroup sdl
 *  @brief Calcul la position d'une case à l'écran
 *  @param Taille du plateau
 *  @param Coordonnée x de la case
 *  @param Coordonnée y de la case
 *  @param Coordonnée x à l'écran
 *  @param Coordonnée y à l'écran
 *  @param Début du plateau en X en pixel
 *  @param Début du plateau en Y en pixel
 *  @param Taille du plateau en pixel
 */
void get_position_vers_ecran(int taille, int x, int y, int* sx, int* sy, int x1, int y1, int w);


int get_marge(int i, int taille);

#endif


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
#ifndef GOSH_GO_POSITION
#define GOSH_GO_POSITION

/** @file position.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 *  @brief Déclare toutes les structures relatives aux positions
 */

#include <stdint.h>
#include <stdbool.h>
#include <stdio.h> //size_t

/** @ingroup go
 *  @brief Représente une position
 */
typedef struct {
    /** @brief Abscisse de la position */
	int8_t x;
    /** @brief Ordonnée de la position */
	int8_t y;
    /** @brief Taille du plateau */
	int8_t taille;
    /** @brief Indique si la position est valide */
	bool valide;
} Position;

/** @ingroup go
 *  @brief Défini une position invalide */
extern Position POSITION_INVALIDE;

/** @def POSITION_VOISINS(position)
 *  @ingroup go
 *  @brief Donne la liste des positions voisine d'une position
 */
#define POSITION_VOISINS(position) { \
		position_gauche(position), \
		position_droite(position), \
		position_haut(position), \
		position_bas(position), \
	}

/** @ingroup go
 *  @brief Crée une position
 *  @param abscisse de la position
 *  @param ordonné de la position
 *  @param taille du plateau
 *  @return Position ainsi crée
 */
Position position(int x, int y, int taille);

/** @ingroup go
 *  @brief Indique si la position est valide
 *  @param Position à tester
 *  @return Vrai si la position est valide
 */
bool position_est_valide(Position);

/** @ingroup go
 *  @brief Donne la position à gauche de la position P
 *  @param position P
 *  @return Position à gauche de la position P.
 */
Position position_gauche(Position);
/** @ingroup go
 *  @brief Donne la position à droite de la position P
 *  @param position P
 *  @return Position à droite de la position P.
 */
Position position_droite(Position);
/** @ingroup go
 *  @brief Donne la position en haut de la position P
 *  @param position P
 *  @return Position en haut de la position P.
 */
Position position_haut(Position);
/** @ingroup go
 *  @brief Donne la position en bas de la position P
 *  @param position P
 *  @return Position en bas de la position P.
 */
Position position_bas(Position);

/** @def POSITION_EQ(p1, p2)
 *  @ingroup go
 *  @brief Teste l'égalité entre deux positions
 */
#define POSITION_EQ(p1, p2) ((p1).x == (p2).x && (p1).y == (p2).y)

#endif


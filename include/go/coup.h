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
#ifndef GOSH_GO_COUP
#define GOSH_GO_COUP

/** @file coup.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 */

#include <stdbool.h>
#include "go/position.h"


/** @ingroup go
 *  @brief Coup joué par un joueur
 */
typedef struct {
    /** @brief Position du coup joué par le joueur.
     *
     *  @note si la position est invalide, on considère que le joueur passe son tour.
     */
    Position position;
} s_Coup;

/** @ingroup go
 *  @brief Convertit une chaîne de caractères en un coup
 *
 *  @param chaine de caractère à convertir
 *  @param taille de la chaine de caractère
 *  @param est mis à faux si la chaine de caractères représente un coup invalide
 *  @return Coup représenté par la chaîne de caractères.
 */
s_Coup str2coup(const char* str, int taille, bool* valide);

#endif

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
#ifndef GOSH_GO_COULEUR
#define GOSH_GO_COULEUR

/** @file couleur.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 *  @brief Déclare le type couleur
 */

/** @ingroup go
 *  @brief Type couleur
 *
 *  A chaque joueur correspond une couleur différente. Le joueur peut donc être désigné par sa couleur
 */
typedef enum {
    /** @brief Pas de couleur
     *
     *  Indique une case sans pion.
     */
	VIDE,
	BLANC,
	NOIR
} Couleur;

#endif


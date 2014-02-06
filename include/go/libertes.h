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
#ifndef GOSH_GO_LIBERTES
#define GOSH_GO_LIBERTES

/** @file libertes.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 *  @brief Déclare les fonctions relatives aux libertés
 */

#include "go/plateau.h"
#include "go/chaine.h"
#include "go/ensemble_positions.h"

/** @brief Défini un ensemble de libertés */
typedef EnsemblePosition Libertes;

/** @ingroup go
 *  @brief Détermine l’ensemble des libertés d’une chaine donnée en fonction
 *  de la position des pions sur le plateau.
 *  @param Plateau où se trouve la chaine
 *  @param Chaine à tester
 *  @return Libertés de la chaine
 */
Libertes determiner_libertes(Plateau plateau, Chaine chaine);

/** @def creer_libertes
 *  @ingroup go
 *  @brief Crée un ensemble de libertés
 */
#define creer_libertes creer_ensemble_position

/** @def detruire_libertes
 *  @ingroup go
 *  @brief Détruit un ensemble de libertés
 */
#define detruire_libertes detruire_ensemble_position

#endif

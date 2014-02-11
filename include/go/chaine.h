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
#ifndef GOSH_GO_CHAINE
#define GOSH_GO_CHAINE

/** @file chaine.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 *  @brief Permet d'utiliser les chaines
 */

#include "go/ensemble_colore.h"
#include "go/ensemble_positions.h"
#include "go/plateau_type.h"


/** @ingroup go
 *  @brief Défini le type chaine
 */
typedef EnsembleColore Chaine;

/** @ingroup go
 *  @brief Détermine la position des yeux appartenant à une chaine.
 *
 *  Si la chaine n’a aucun oeil alors la valeur retournée est NULL.
 *  @param Chaine à tester
 *  @param Plateau où se trouve la chaine
 *  @return Ensemble des yeux de la chaine
 */
EnsemblePosition lesYeuxDeLaChaine(Chaine chaine, Plateau plateau);

/** @ingroup go
 *  @brief Indique si une position appartient à la chaine
 *  @param Chaine à tester
 *  @param position à tester
 *  @return Retourne vrai si la position appartient à la chaine.
 */
bool chaine_appartient(Chaine chaine, Position position);

/** @def creer_chaine
 *  @ingroup go
 *  @brief Permet de créer une chaine
 */
#define creer_chaine creer_ensemble_colore

/** @def detruire_chaine
 *  @ingroup go
 *  @brief Permet de détruire une chaine
 */
#define detruire_chaine detruire_ensemble_colore

#endif

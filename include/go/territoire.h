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
#ifndef GOSH_GO_TERRITOIRE
#define GOSH_GO_TERRITOIRE

/** @file territoire.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 */

#include "go/plateau_type.h"
#include "go/ensemble_colore.h"
#include "go/chaines.h"

/** @ingroup go
 *  @brief Défini le type Territoire
 */
typedef EnsembleColore Territoire;

/** @ingroup go
 *  @brief retourne un ensemble d’intersections inoccupées voisines de proche
 * en proche délimitees par des pierres de même couleur en commencant par l’intersection
 * vide à la position pos.
 *
 * @warning Si la case ne fait pas partie d’un territoire de même couleur,
 * retourne quand même l’ensemble des intersections voisines mais en specifiant que
 * ce ”Territoire” n’a aucune couleur. Ce cas est exploité par la fonction estUnSeki
 * @param Plateau courant
 * @param position pos
 * @return Territoire contenant la position pos
 */
Territoire determiner_territoire(Plateau plateau, Position pos);

/** @ingroup go
 *  @brief détermine si un territoire forme un seki pour les chaines de
 *  différentes couleurs concernées.
 *  @param territoire étudié
 *  @param Chaînes entourrant le territoire
 *  @param Plateau courrant
 *  @return Vrai si le territoire est un seki
 */
bool estUnSeki(Territoire leTerritoire, Chaines lesChaines, Plateau plateau);


/** @ingroup go
 *  @brief Indique si une position appartient à un territoire
 *  @param Territoire à tester
 *  @param position à tester
 *  @return vrai si la position appartient au territoire
 */
bool territoire_appartient(Territoire territoire, Position position);

/** @def creer_territoire
 *  @brief Crée un territoire
 */
#define creer_territoire creer_ensemble_colore

/** @ef detruire_territoire
 *  @brief Détruit un territoire
 */
#define detruire_territoire detruire_ensemble_colore

#endif

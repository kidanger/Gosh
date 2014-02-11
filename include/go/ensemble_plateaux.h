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
#ifndef GOSH_GO_ENSEMBLE_PLATEAUX
#define GOSH_GO_ENSEMBLE_PLATEAUX

/** @file ensemble_plateaux.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 *  @brief Défini les ensembles de plateaux.
 */

#include "go/plateau_type.h"

#undef TYPE
#undef TYPE_LOWER
#define TYPE Plateau
#define TYPE_LOWER plateau
#include "gosh_ensemble.h"

/** @def creer_plateaux
 *  @ingroup go
 *  @brief Crée un ensemble de plateau
 */
#define creer_plateaux creer_ensemble_plateau

/** @def detruire_plateaux
 *  @ingroup go
 *  @brief Detruit un ensemble de plateau
 */
#define detruire_plateaux detruire_ensemble_plateau

#endif


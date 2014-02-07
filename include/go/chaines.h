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

/** @file chaines.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 *  @brief Défini un ensemble de chaines
 */

#ifndef GOSH_GO_CHAINES
#define GOSH_GO_CHAINES

#include "go/chaine.h"

#undef TYPE
#undef TYPE_LOWER
#define TYPE Chaine
#define TYPE_LOWER chaine
#include "gosh_ensemble.h"

/** @ingroup go
 *  @brief Défini un ensemble de chaine.
 */
typedef EnsembleChaine Chaines;

/** @def creer_chaines
 *  @ingroup go
 *  @brief Crée un ensemble de chaines
 */
#define creer_chaines creer_ensemble_chaine

/** @def detruire_chaines
 *  @ingroup go
 *  @brief Détruit un ensemble de chaines
 */
#define detruire_chaines detruire_ensemble_chaine

#endif

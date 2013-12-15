/* Copyright © 2013 Jérémy Anger, Denis Migdal
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
#ifndef TYPE
#error "TYPE non défini"
#endif
#ifndef TYPE_LOWER
#error "TYPE_LOWER non défini"
#endif

#include <stdbool.h>
#include "concat.h"

#define ENSTYPE C2(Ensemble, TYPE)
typedef struct gosh_ensemble* ENSTYPE;

ENSTYPE C2(creer_ensemble_, TYPE_LOWER)();
void C2(detruire_ensemble_, TYPE_LOWER)(ENSTYPE ensemble);

#define FUNC_NAME(name) C3(ensemble_, TYPE_LOWER, _##name)

bool FUNC_NAME(vide)(ENSTYPE ensemble);
void FUNC_NAME(ajouter)(ENSTYPE ensemble, TYPE element);
TYPE FUNC_NAME(supprimer_tete)(ENSTYPE ensemble);
bool FUNC_NAME(appartient)(ENSTYPE ensemble, TYPE element);

#include "gosh_iterateur.h"
DEFINE_ITERATEUR(TYPE);

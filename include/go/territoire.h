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
#ifndef GOSH_GO_TERRITOIRE
#define GOSH_GO_TERRITOIRE

#include "go/plateau_type.h"
#include "go/ensemble_colore.h"

typedef EnsembleColore Territoire;

/** @brief retourne un ensemble d’intersections inoccupées voisines de proche
en proche délimitees par des pierres de même couleur en commencant par l’intersection
vide à la position pos. Important : Si la case ne fait pas partie d’un
territoire de même couleur, retourne quand même l’ensemble des intersections
voisines mais en specifiant que ce ”Territoire” n’a aucune couleur. Ce cas est
exploit e par la fonction estUnSeki */
Territoire determiner_territoire(Plateau plateau, Position pos);

bool territoire_appartient(Territoire territoire, Position position);

#endif

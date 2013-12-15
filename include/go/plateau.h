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
#ifndef GOSH_GO_PLATEAU
#define GOSH_GO_PLATEAU

#include <stdlib.h> // size_t

#include "couleur.h"
#include "position.h"
#include "chaine.h"

typedef struct plateau* Plateau;

Plateau creer_plateau(size_t taille);
void detruire_plateau(Plateau plateau);

Couleur plateau_get(Plateau plateau, int i, int j);
Couleur plateau_get_at(Plateau plateau, Position pos);
void plateau_set(Plateau plateau, int i, int j, Couleur couleur);

size_t plateau_get_taille(Plateau plateau);

/** * @brief Produit la chaîne à laquelle appartient le pion à la position pos sur le plateau. S’il n’y a pas de pion sur cette case, alors le résultat retourné est NULL */
Chaine plateau_determiner_chaine(Plateau plateau, Position pos);

#endif


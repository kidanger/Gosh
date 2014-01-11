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
#ifndef GOSH_GO_POSITION
#define GOSH_GO_POSITION

#include <stdint.h>
#include <stdbool.h>
#include <stdio.h> //size_t

typedef struct {
	int8_t x;
	int8_t y;
	int8_t taille;
	char valide;
} Position;

extern Position POSITION_INVALIDE;

#define POSITION_VOISINS(position) { \
		position_gauche(position), \
		position_droite(position), \
		position_haut(position), \
		position_bas(position), \
	}

Position position(int x, int y, int taille);

bool position_est_valide(Position);

Position position_gauche(Position);
Position position_droite(Position);
Position position_haut(Position);
Position position_bas(Position);

#define POSITION_EQ(p1, p2) ((p1).x == (p2).x && (p1).y == (p2).y)

#endif


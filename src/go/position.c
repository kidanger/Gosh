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
#include "go/position.h"

Position POSITION_INVALIDE = { .x = -1, .y = -1, .taille = 0, .valide = 0 };

Position position(int x, int y, int taille)
{
	if (x < 0 || y < 0 || x >= taille || y >= taille)
		return POSITION_INVALIDE;
	Position p = {.x = x, .y = y, .taille = taille, .valide = 1};
	return p;
}

bool position_est_valide(Position pos)
{
	return pos.valide;
}

Position position_gauche(Position pos)
{
	if (!position_est_valide(pos))
		return POSITION_INVALIDE;
	if (pos.x == 0)
		return POSITION_INVALIDE;
	pos.x -= 1;
	return pos;
}

Position position_droite(Position pos)
{
	if (!position_est_valide(pos))
		return POSITION_INVALIDE;
	if (pos.x == pos.taille - 1)
		return POSITION_INVALIDE;
	pos.x += 1;
	return pos;
}

Position position_haut(Position pos)
{
	if (!position_est_valide(pos))
		return POSITION_INVALIDE;
	if (pos.y == 0)
		return POSITION_INVALIDE;
	pos.y -= 1;
	return pos;
}

Position position_bas(Position pos)
{
	if (!position_est_valide(pos))
		return POSITION_INVALIDE;
	if (pos.y == pos.taille - 1)
		return POSITION_INVALIDE;
	pos.y += 1;
	return pos;
}

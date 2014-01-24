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
#include <stdlib.h>
#include <stdio.h>
#include <time.h>

#include "go/ordinateur.h"
#include "go/plateau.h"
#include "gosh_macros.h"
#include "gosh_alloc.h"

typedef struct {
} *Data;

void JOUER_COUP(Data data, Partie partie, enum CouleurJoueur couleur)
{
	(void) data;
	(void) couleur;

	size_t taille = plateau_get_taille(partie->plateau);
	s_Coup coup;
	int essais_restants = 1000;
	do {
		int x = rand() % taille;
		int y = rand() % taille;
		coup.position = position(x, y, taille);
		essais_restants--;
	} while ((plateau_get_at(partie->plateau, coup.position) != VIDE
	          || !partie_jouer_coup(partie, coup)) && essais_restants > 0);
	if (essais_restants == 0) {
		coup.position = POSITION_INVALIDE;
		partie_jouer_coup(partie, coup);
	}
}

void* INITIALISER()
{
	srand(time(NULL));
	Data data = gosh_alloc(*data);
	gosh_debug("Initialisation du botrandom");
	return data;
}


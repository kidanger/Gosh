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
#ifndef GOSH_GO_JOUEUR
#define GOSH_GO_JOUEUR

#include "go/plateau_type.h"

#define TAILLE_NOM_JOUEUR 12

enum CouleurJoueur {
	JOUEUR_BLANC,
	JOUEUR_NOIR
};

enum TypeJoueur {
	HUMAIN,
	ORDINATEUR
};

struct s_Joueur {
	enum TypeJoueur type;
	char nom[TAILLE_NOM_JOUEUR];
	struct s_Ordinateur* ordinateur; // uniquement si type = ORDINATEUR
};

typedef struct s_Joueur* Joueur;

#endif

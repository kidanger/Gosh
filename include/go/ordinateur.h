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
#ifndef GOSH_GO_ORDINATEUR
#define GOSH_GO_ORDINATEUR

#include "go/partie.h"

#define JOUER_COUP_STR "jouer_coup_ordi"
#define JOUER_COUP jouer_coup_ordi
#define INITIALISER_STR "initialiser_ordi"
#define INITIALISER initialiser_ordi

typedef void(*JouerFunc)(void*, Partie, enum CouleurJoueur);

struct s_Ordinateur {
	void* dlptr;
	JouerFunc jouer;
	void* ordidata;
};

typedef struct s_Ordinateur* Ordinateur;

Ordinateur charger_ordinateur(const char* filename);
void decharger_ordinateur(Ordinateur ordi);

void ordinateur_jouer_coup(Ordinateur ordi, Partie partie, enum CouleurJoueur couleur);

#endif


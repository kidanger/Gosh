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
#ifndef GOSH_GO_ORDINATEUR
#define GOSH_GO_ORDINATEUR

#include "go/partie.h"

#define JOUER_COUP_STR "jouer_coup_ordi"
#define JOUER_COUP __attribute__((used)) jouer_coup_ordi
#define INITIALISER_STR "initialiser_ordi"
#define INITIALISER __attribute__((used)) initialiser_ordi
#define DEBUT_PARTIE_STR "debut_partie_ordi"
#define DEBUT_PARTIE __attribute__((used)) debut_partie_ordi
#define NOTIFICATION_COUP_STR "notification_coup_ordi"
#define NOTIFICATION_COUP __attribute__((used)) notification_coup_ordi

typedef void(*JouerFunc)(void*, Partie, enum CouleurJoueur);
typedef void(*DebutPartieFunc)(void*, Partie);
typedef void(*NotificationCoupFunc)(void*, Partie, enum CouleurJoueur, s_Coup);

struct s_Ordinateur {
	char * file;
	void* dlptr;
	JouerFunc jouer;
	DebutPartieFunc debut_partie;
	NotificationCoupFunc notification_coup;
	void* ordidata;
};

typedef struct s_Ordinateur* Ordinateur;

Ordinateur charger_ordinateur(const char* filename);
void decharger_ordinateur(Ordinateur ordi);

void ordinateur_jouer_coup(Ordinateur ordi, Partie partie, enum CouleurJoueur couleur);
void ordinateur_debut_partie(Ordinateur ordi, Partie partie);
void ordinateur_notifier_coup(Ordinateur ordi, Partie partie, enum CouleurJoueur, s_Coup coup);

#endif


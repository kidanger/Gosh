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
#include <stdio.h>
#include <dlfcn.h>

#include "go/ordinateur.h"
#include "gosh_alloc.h"

// TODO: handle Windows API

static void* recuperer_fonction(void* dlptr, const char* nom, bool importante)
{
	void* func = dlsym(dlptr, nom);
	if (func == NULL && importante) {
		printf("La récupération de la fonction %s a échouée.\n", nom);
		dlclose(dlptr);
	}
	return func;
}

Ordinateur charger_ordinateur(const char* filename)
{
#ifdef EMSCRIPTEN
	filename = NULL;
#endif
	void* dlptr = dlopen(filename, RTLD_LAZY);
	if (dlptr == NULL) {
		printf("Impossible de charger le fichier %s.\n", filename);
		return NULL;
	}

	void*(*initialiser)() = recuperer_fonction(dlptr, INITIALISER_STR, true);
	if (initialiser == NULL) {
		return NULL;
	}
	void* ordidata = initialiser();
	if (ordidata == NULL) {
		return NULL;
	}

	JouerFunc jouer = recuperer_fonction(dlptr, JOUER_COUP_STR, true);
	if (jouer == NULL) {
		return NULL;
	}

	DebutPartieFunc debut_partie = recuperer_fonction(dlptr, DEBUT_PARTIE_STR, false);
	NotificationCoupFunc notification_coup = recuperer_fonction(dlptr, NOTIFICATION_COUP_STR, false);

	Ordinateur ordi = gosh_alloc(*ordi);
	ordi->dlptr = dlptr;
	ordi->jouer = jouer;
	ordi->ordidata = ordidata;
	ordi->debut_partie = debut_partie;
	ordi->notification_coup = notification_coup;
	return ordi;
}

void ordinateur_debut_partie(Ordinateur ordi, Partie partie)
{
	if (ordi->debut_partie) {
		ordi->debut_partie(ordi->ordidata, partie);
	}
}

void ordinateur_notifier_coup(Ordinateur ordi, Partie partie, enum CouleurJoueur couleur, s_Coup coup)
{
	if (ordi->notification_coup) {
		ordi->notification_coup(ordi->ordidata, partie, couleur, coup);
	}
}

void ordinateur_jouer_coup(Ordinateur ordi, Partie partie, enum CouleurJoueur couleur)
{
	ordi->jouer(ordi->ordidata, partie, couleur);
}

void decharger_ordinateur(Ordinateur ordi)
{
	dlclose(ordi->dlptr);
	gosh_free(ordi);
}


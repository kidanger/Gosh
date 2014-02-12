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

/** @file ordinateur.c
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 *  @brief Défini les fonctionnalités de chargement d'IA
 */


#include <stdio.h>
#include <string.h>
#ifndef _WIN32
#include <dlfcn.h>
/** @def DLOPEN(path)
 *  @ingroup go
 *  @brief Ouvre une bibliothèque dynamique et retourne un "handle" sur cette dernière
 */
#define DLOPEN(path) dlopen(path, RTLD_LAZY)
/** @def DLSYM
 *  @ingroup go
 *  @brief Recherche un symbole dans une bibliothèque dynamique et retourne un pointeur sur celui-ci.
 */
#define DLSYM dlsym
/** @def DLCLOSE
 *  @ingroup go
 *  @brief Ferme une biblithèque dynamique et libère les ressources associées.
 */
#define DLCLOSE dlclose
#else
#include <windows.h>
#define DLOPEN LoadLibrary
#define DLSYM GetProcAddress
#define DLCLOSE(lib) GetModuleHandleEx(0,0,&(lib));
#endif

#include "go/ordinateur.h"
#include "gosh_alloc.h"

static void* recuperer_fonction(void* dlptr, const char* nom, bool importante)
{
	void* func = DLSYM(dlptr, nom);
	if (func == NULL && importante) {
		printf("La récupération de la fonction %s a échouée.\n", nom);
		DLCLOSE(dlptr);
	}
	return func;
}

Ordinateur charger_ordinateur(const char* name)
{
	void* dlptr = NULL;

#ifdef EMSCRIPTEN
	dlptr = DLOPEN(NULL);
#else
#ifndef _WIN32
	const char* extension = ".so";
#else
	const char* extension = ".dll";
#define BUILD_PATH ""
#define INSTALL_PATH ""
#endif
	const char* paths[] = {
		BUILD_PATH"/src/ordinateurs/",
		INSTALL_PATH"/share/gosh/"
	};
	char filename[256];

	unsigned p = 0;;
	while (dlptr == NULL && p < sizeof(paths) / sizeof(paths[0])) {
		snprintf(filename, sizeof(filename), "%slib%s%s", paths[p], name, extension);
		dlptr = DLOPEN(filename);
		if (dlptr == NULL) {
			gosh_debug("Impossible de charger le fichier %s.", filename);
		}
		p++;
	}
	if (dlptr == NULL) {
		fprintf(stderr, "Impossible de charger l'ordinateur %s.\n", name);
		return NULL;
	}
	gosh_debug("%s chargé", filename);
#endif

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

	RemplacerPlateauFunc remplacer_plateau = recuperer_fonction(dlptr, REMPLACER_PLATEAU_STR, false);
	NotificationCoupFunc notification_coup = recuperer_fonction(dlptr, NOTIFICATION_COUP_STR, false);

	Ordinateur ordi = gosh_alloc(*ordi);
	ordi->dlptr = dlptr;
	ordi->jouer = jouer;
	ordi->ordidata = ordidata;
	ordi->remplacer_plateau = remplacer_plateau;
	ordi->notification_coup = notification_coup;
	ordi->name = malloc(strlen(name) + 1);
	strcpy(ordi->name, name);
	return ordi;
}

void ordinateur_remplacer_plateau(Ordinateur ordi, Plateau plateau)
{
	if (ordi->remplacer_plateau) {
		ordi->remplacer_plateau(ordi->ordidata, plateau);
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
	if (ordi->ordidata) {
		void(*liberer)(void*) = recuperer_fonction(ordi->dlptr, LIBERER_STR, false);
		if (liberer) {
			liberer(ordi->ordidata);
		}
	}

	DLCLOSE(ordi->dlptr);
	free(ordi->name);
	gosh_free(ordi);
}


#include <stdio.h>
#include <dlfcn.h>

#include "go/ordinateur.h"
#include "gosh_alloc.h"

// TODO: handle Windows API

Ordinateur charger_ordinateur(const char* filename) {
	void* dlptr = dlopen(filename, RTLD_LAZY);
	if (dlptr == NULL) {
		printf("Impossible de charger le fichier %s.\n", filename);
		return NULL;
	}

	void*(*initialiser)() = dlsym(dlptr, INITIALISER_STR);
	void* ordidata = initialiser();
	if (ordidata == NULL) {
		printf("L'initialisation de l'ordinateur %s a échouée.\n", filename);
		dlclose(dlptr);
		return NULL;
	}

	JouerFunc jouer = dlsym(dlptr, JOUER_COUP_STR);
	if (jouer == NULL) {
		printf("Impossible d'obtenir la fonction %s de %s.\n", JOUER_COUP_STR, filename);
		dlclose(dlptr);
		return NULL;
	}

	Ordinateur ordi = gosh_alloc(*ordi);
	ordi->dlptr = dlptr;
	ordi->jouer = jouer;
	return ordi;
}

void ordinateur_jouer_coup(Ordinateur ordi, Partie partie, enum CouleurJoueur couleur) {
	ordi->jouer(ordi->ordidata, partie, couleur);
}

void decharger_ordinateur(Ordinateur ordi) {
	dlclose(ordi->dlptr);
	gosh_free(ordi);
}


#include <stdlib.h>
#include <stdio.h>

#include "go/ordinateur.h"
#include "go/plateau.h"
#include "gosh_macros.h"
#include "gosh_alloc.h"

typedef struct {
} *Data;

int JOUER_COUP(Data data, Partie partie, enum CouleurJoueur couleur) {
	size_t taille = plateau_get_taille(partie->plateau);
	s_Coup coup;
	do {
		int x = rand() % taille;
		int y = rand() % taille;
		coup.position = POSITION(x, y);
	} while (plateau_get_at(partie->plateau, coup.position) != VIDE || !partie_jouer_coup(partie, coup));
}

void* INITIALISER() {
	Data data = gosh_alloc(*data);
	gosh_debug("Initialisation du botrandom");
	return data;
}


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
#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include <time.h>

#include "gosh_foreach.h"
#include "go/plateau.h"
#include "go/ensemble_positions.h"
#include "go/libertes.h"
#include "go/territoire.h"

#define C_NORMAL "\033[m"
#define C_WHITE "\033[37m"
#define C_BLACK "\033[30m"
#define C_GREEN "\033[32m"
#define C_RED "\033[31m"
#define C_YELLOW "\033[33m"
#define C_GREY "\033[37m"
#define C_BLUE "\033[34m"
#define C_BOLD "\033[1m"
#define C_NOBOLD "\033[22m"

#define C_YELLOW_BG "\033[43m"


void afficher_plateau_fancy(Plateau plateau) {
	size_t taille = plateau_get_taille(plateau);

#define SHOW_LETTERS() do { \
		printf("   "); \
		for (int x = 0; x < taille; x++) { \
			printf(C_GREEN "%s%c ", (x % 2 ? C_NOBOLD : C_BOLD), ('A' + x)); \
		} \
		printf("\n"); \
	} while (0)

#define SHOW_NUMBER(y) do { \
		printf(C_BLUE "%s%2d ", (y % 2 ? C_NOBOLD : C_BOLD), y + 1); \
	} while (0)

	SHOW_LETTERS();

	for (int y = 0; y < taille; y++) {
		SHOW_NUMBER(y);

		printf(C_BOLD);
		for (int x = 0; x < taille; x++) {
			const char* car = ".";

			Couleur couleur = plateau_get(plateau, x, y);
			if (couleur == BLANC) {
				printf(C_WHITE);
				car = "●";
			} else if (couleur == NOIR) {
				printf(C_BLACK);
				car = "●";
			} else {
				printf(C_YELLOW);
			}

			printf("%s ", car);
		}

		SHOW_NUMBER(y);
		printf("\n");
	}

	SHOW_LETTERS();
#undef SHOW_LETTERS
#undef SHOW_NUMBER
	printf(C_NORMAL);
}

void afficher_plateau(Plateau plateau) {
	size_t taille = plateau_get_taille(plateau);
	// pour tester les chaines
	Position position_chaine = POSITION(taille / 2, taille / 2);
	Chaine chaine = plateau_determiner_chaine(plateau, position_chaine);
	Libertes libertes = determiner_libertes(plateau, chaine);
	Territoire territoire = determiner_territoire(plateau, POSITION(taille - 1, taille - 1));

	const char* couleur_territoire;
	switch (ensemble_colore_couleur(territoire)) {
		case BLANC:
			couleur_territoire = C_YELLOW;
			break;
		case NOIR:
			couleur_territoire = C_BLUE;
			break;
		case VIDE:
			couleur_territoire = C_GREY;
			break;
	}

	for (int y = 0; y < taille; y++) {
		for (int x = 0; x < taille; x++) {
			Couleur couleur = plateau_get(plateau, x, y);

			// highlight de la chaine
			const char* ansi = C_NORMAL;
			if (chaine != NULL && gosh_appartient(chaine, POSITION(x, y)))
				ansi = C_RED;
			else if (libertes != NULL && gosh_appartient(libertes, POSITION(x, y)))
				ansi = C_GREEN;
			else if (territoire != NULL && gosh_appartient(territoire, POSITION(x, y)))
				ansi = couleur_territoire;

			printf("%s%d "C_NORMAL, ansi, couleur);
		}
		printf("\n");
	}
}

int main(int argc, const char *argv[]) {
	long long seed = time(NULL);
	printf("(seed=%llu)\n", seed);
	srand(seed);
	{
		assert(POSITION_EST_VALIDE(POSITION(0, 0)));
		assert(!POSITION_EST_VALIDE(POSITION_INVALIDE));

		size_t taille = 19;
		size_t max = taille - 1;
#define TEST(dir, x, y) POSITION_EST_VALIDE(POSITION_##dir(POSITION(x, y), taille))
		assert(!TEST(GAUCHE, 0, 0));
		assert(TEST(DROITE, 0, 0));
		assert(!TEST(HAUT, 0, 0));
		assert(TEST(BAS, 0, 0));

		assert(TEST(GAUCHE, max, 0));
		assert(!TEST(DROITE, max, 0));
		assert(!TEST(HAUT, max, 0));
		assert(TEST(BAS, max, 0));

		assert(TEST(GAUCHE, max, max));
		assert(!TEST(DROITE, max, max));
		assert(TEST(HAUT, max, max));
		assert(!TEST(BAS, max, max));

		assert(!TEST(GAUCHE, 0, max));
		assert(TEST(DROITE, 0, max));
		assert(TEST(HAUT, 0, max));
		assert(!TEST(BAS, 0, max));
#undef TEST
	}
	{
		printf("test de l'ensemble des positions:\n");
		EnsemblePosition ensPos = creer_ensemble_position();
		ensemble_position_ajouter(ensPos, POSITION(0, 1));
		ensemble_position_ajouter(ensPos, POSITION(1, 1));
		ensemble_position_ajouter(ensPos, POSITION(1, 2));
		ensemble_position_ajouter(ensPos, POSITION(4, 2));

		Position pos;
		gosh_foreach(pos, ensPos) {
			printf("%d %d\n", POSITION_X(pos), POSITION_Y(pos));
		}

		detruire_ensemble_position(ensPos);
	}
	{
		printf("test du plateau:\n");
		size_t taille = 19;
		Plateau plateau = creer_plateau(taille);
		for (int y = 0; y < taille; y++) {
			for (int x = 0; x < taille; x++) {
				plateau_set(plateau, x, y, rand() % 3);
			}
		}
		printf("taille: %zd\n", plateau_get_taille(plateau));

		plateau_set(plateau, 0, 0, BLANC);
		plateau_set(plateau, 1, 0, BLANC);
		plateau_set(plateau, 1, 1, BLANC);
		plateau_set(plateau, 2, 0, BLANC);
		plateau_set(plateau, 0, 1, NOIR);
		plateau_set(plateau, 0, 2, NOIR);

		plateau_set(plateau, taille - 1, taille - 1, VIDE); // pour le territoire

		afficher_plateau(plateau);
		afficher_plateau_fancy(plateau);

		Chaine chaine = plateau_determiner_chaine(plateau, POSITION(0, 0));
		if (chaine) {
			printf("chaine:\n");
			Position pos;
			gosh_foreach(pos, ensemble_colore_positions(chaine)) {
				printf("%d %d, ", POSITION_X(pos), POSITION_Y(pos));
			}
			printf("\n");
			detruire_ensemble_colore(chaine);
		} else {
			printf("pas de chaine\n");
		}

		detruire_plateau(plateau);
	}

	return EXIT_SUCCESS;
}


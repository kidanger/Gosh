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
#include "go/genericTab.h"

#define COLORS // TODO: move to cmake files

#ifdef COLORS
#define C_WHITE "\033[00m"
#define C_GREEN "\033[32m"
#define C_RED "\033[31m"
#else
#define C_WHITE ""
#define C_GREEN ""
#define C_RED ""
#endif

void afficher_plateau(Plateau plateau) {
	size_t taille = plateau_get_taille(plateau);
	// pour tester les chaines
	Position position_chaine = POSITION(taille / 2, taille / 2);
	Chaine chaine = plateau_determiner_chaine(plateau, position_chaine);

	for (int y = 0; y < taille; y++) {
		for (int x = 0; x < taille; x++) {
			Couleur couleur = plateau_get(plateau, x, y);

			// highlight de la chaine
			const char* ansi = C_WHITE;
			if (chaine != NULL && chaine_appartient(chaine, POSITION(x, y)))
				ansi = C_RED;

			printf(C_RED "%s%d "C_WHITE, ansi, couleur);
		}
		printf("\n");
	}
}

DEF_DYNAMIC_TAB(int)

void test_gosh_foreach(void) {
	DynamicTab_int container = gosh_create_dynamicTab_int();
	int * elem = NULL;
	gosh_foreach_old(int, elem, container) {
		printf("%d\n", *elem);
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
		EnsemblePositions ensPos = creer_ensemble_positions();
		ensemble_positions_ajouter(ensPos, POSITION(0, 1));
		ensemble_positions_ajouter(ensPos, POSITION(1, 1));
		ensemble_positions_ajouter(ensPos, POSITION(1, 2));
		ensemble_positions_ajouter(ensPos, POSITION(4, 2));

		Position pos;
		gosh_foreach(Position, pos, ensPos)
		printf("%d %d\n", POSITION_X(pos), POSITION_Y(pos));

		detruire_ensemble_positions(ensPos);
	}
	{
		printf("test du plateau:\n");
		size_t taille = 9;
		Plateau plateau = creer_plateau(taille);
		for (int y = 0; y < taille; y++) {
			for (int x = 0; x < taille; x++) {
				plateau_set(plateau, x, y, rand() % 2 + 1);
			}
		}
		printf("taille: %zd\n", plateau_get_taille(plateau));

		plateau_set(plateau, 0, 0, BLANC);
		plateau_set(plateau, 1, 0, BLANC);
		plateau_set(plateau, 1, 1, BLANC);
		plateau_set(plateau, 2, 0, BLANC);
		plateau_set(plateau, 0, 1, NOIR);
		plateau_set(plateau, 0, 2, NOIR);

		afficher_plateau(plateau);

		Chaine chaine = plateau_determiner_chaine(plateau, POSITION(0, 0));
		if (chaine) {
			printf("chaine:\n");
			Position pos;
			gosh_foreach(Position, pos, ensemble_colore_positions(chaine)) {
				printf("%d %d\n", POSITION_X(pos), POSITION_Y(pos));
			}
			detruire_ensemble_colore(chaine);
		} else {
			printf("pas de chaine\n");
		}

		detruire_plateau(plateau);
	}

	return EXIT_SUCCESS;
}


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

#include "cli/affichage.h"
#include "go/plateau.h"

void cli_afficher_plateau(Plateau plateau)
{
	int taille = plateau_get_taille(plateau);

#define SHOW_LETTERS() do { \
		printf("   "); \
		for (int x = 0; x < taille; x++) { \
			printf(C_GREEN "%s%c ", (x % 2 ? C_NOBOLD : C_BOLD), (char)('A' + x)); \
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

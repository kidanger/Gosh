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

/** @ingroup cli
 *  @brief Affiche nbEspace espaces
 *  @param Nombre d'espaces  afficher
 */
void cli_afficher_espace(unsigned int nbEspace)
{
	for (unsigned int i = 0; i < nbEspace; ++i)
		putchar(' ');
}

/** @ingroup cli
 *  @brief Donne la position relative à la marge la plus proche
 *  @param abscisse ou ordonné
 *  @param Taille du plateau
 *  @return position relative à la marge la plus proche
 */
int get_marge(int i, int taille)
{
	if (i < taille / 2)
		return i;
	else
		return taille - i - 1;
}

void cli_afficher_plateau(Plateau plateau)
{
	int taille = plateau_get_taille(plateau);

#define SHOW_LETTERS() do { \
		printf("   "); \
		for (int x = 0; x < taille; x++) { \
			printf(C_GREEN "%s%c ", (x % 2 ? C_NOBOLD : C_BOLD), (char)('A' + x)); \
		} \
		putchar('\n'); \
	} while (0)

#define SHOW_NUMBER_G(y) do { \
		printf(C_BLUE "%s%2d ", (y % 2 ? C_NOBOLD : C_BOLD), y + 1); \
	} while (0)

#define SHOW_NUMBER_D(y) do { \
		printf(C_BLUE "%s %d ", (y % 2 ? C_NOBOLD : C_BOLD), y + 1); \
	} while (0)
	printf("  ");
	SHOW_LETTERS();

	printf("   ");
	printf(C_BACKGROUND_BROWN);
	cli_afficher_espace(taille * 2 + 3);
	printf(C_BACKGROUND_NORMAL);

	putchar('\n');

	for (int y = 0; y < taille; y++) {
		SHOW_NUMBER_G(y);
		printf(C_BACKGROUND_BROWN);
		printf(C_BOLD);
		printf("  ");
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
				printf(C_YELLOW); // par défaut
				int marge = (taille == 9 ? 2 : 3);
				if ((get_marge(x, taille) == marge || x == taille / 2)
				        && (get_marge(y, taille) == marge || y == taille / 2))
					printf(C_BLACK);
			}

			printf("%s ", car);
		}
		putchar(' ');
		printf(C_BACKGROUND_NORMAL);
		SHOW_NUMBER_D(y);
		putchar('\n');
	}

	printf("   ");
	printf(C_BACKGROUND_BROWN);
	cli_afficher_espace(taille * 2 + 3);
	printf(C_BACKGROUND_NORMAL);

	putchar('\n');
	printf("  ");
	SHOW_LETTERS();
#undef SHOW_LETTERS
#undef SHOW_NUMBER
	printf(C_NORMAL);
}

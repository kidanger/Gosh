#include <stdio.h>

#include "cli/affichage.h"
#include "go/plateau.h"

void cli_afficher_plateau(Plateau plateau) {
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

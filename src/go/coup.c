#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#include "go/coup.h"
#include "gosh_macros.h"

s_Coup str2coup(const char* str, bool* valide) {
	s_Coup coup;
	if (strcmp(str, "p") == 0) {
		// passe son tour
		coup.position = POSITION_INVALIDE;
		if (valide)
			*valide = true;
	} else {
		int lettre = tolower(str[0]) - 'a';
		int numero = atoi(str + 1) - 1;

		// 19, car on ne sait pas la taille du plateau
		if (lettre < 0 || lettre >= 19 || numero < 0 || numero >= 19) {
			gosh_debug("coup invalide %d %d", lettre, numero);
			if (valide)
				*valide = false;
		} else {
			coup.position = POSITION(lettre, numero);
			if (valide)
				*valide = true;
		}
	}
	return coup;
}


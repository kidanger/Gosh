#include <stdio.h>
#include <string.h>
#include <ctype.h>

#include "cli/deroulement_partie.h"
#include "cli/saisie.h"
#include "cli/affichage.h"
#include "go/partie.h"
#include "go/plateau.h"


s_Coup cli_convertir_coup(const Partie partie, const char* str, bool* valide) {
	s_Coup coup;
	if (strcmp(str, "p") == 0) {
		// passe son tour
		coup.position = POSITION_INVALIDE;
		*valide = true;
	} else {
		size_t taille = plateau_get_taille(partie->plateau);
		int lettre = tolower(str[0]) - 'a';
		int numero = atoi(str + 1) - 1;

		if (lettre < 0 || lettre >= taille || numero < 0 || numero >= taille) {
			*valide = false;
			gosh_debug("coup invalide %d %d", lettre, numero);
		} else {
			coup.position = POSITION(lettre, numero);
			*valide = true;
		}
	}
	return coup;
}

void cli_jouer_partie(Partie partie) {
	char label[32];
	char rep[32];
	while (true) {
		snprintf(label, sizeof(label), "Au joueur %s de jouer",
		         partie->joueur_courant == JOUEUR_BLANC ? "blanc" : "noir");
		cli_demander_string(label, rep, sizeof(rep));

		bool valide;
		s_Coup coup = cli_convertir_coup(partie, rep, &valide);
		if (valide) {
			bool reussi = partie_jouer_coup(partie, coup);
			gosh_debug("coup reussi: %s", reussi ? "oui" : "non");
			cli_afficher_plateau(partie->plateau);
		}
	}
}

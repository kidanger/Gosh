#include <stdio.h>
#include <string.h>

#include "cli/configurer_partie.h"
#include "cli/saisie.h"
#include "go/plateau.h"

bool saisir_type_joueur(Partie partie, int num_joueur) {
	const char* str = num_joueur == 0 ? "Type du joueur 1" : "Type du joueur 2";
	char res = cli_demander_char(str, 0, 'h', "humain", 'o', "ordinateur", 'r', "retour", 0);

	enum TypeJoueur type;
	if (res == 'o')
		type = ORDINATEUR;
	else if (res == 'h')
		type = HUMAIN;

	partie->joueurs[num_joueur].type = type;

	return res != 'r';
}

bool saisir_nom_joueur(Partie partie, int num_joueur) {
	const char* str = num_joueur == 0 ? "Nom du joueur 1" : "Nom du joueur 2";
	char buf[TAILLE_NOM_JOUEUR] = {0};
	cli_demander_string(str, buf, sizeof(buf));

	if (buf[0]) {
		strncpy(partie->joueurs[num_joueur].nom, buf, TAILLE_NOM_JOUEUR);
	}

	return buf[0] != 0;
}

bool saisir_taille_plateau(Partie partie) {
	const char* str = "Taille du plateau";
	char rep = cli_demander_char(str, 0, 'p', "petit (9x9)",
	                             'm', "moyen (13x13)", 'g', "grand (19x19)", 'r', "retour");
	if (rep == 'p')
		partie->plateau = creer_plateau(9);
	else if (rep == 'm')
		partie->plateau = creer_plateau(13);
	else if (rep == 'g')
		partie->plateau = creer_plateau(19);
	return rep != 'r';
}

bool questions_callback(enum Question question, Partie partie) {
	switch (question) {
		case TYPE_JOUEUR_1:
				return saisir_type_joueur(partie, 0);
		case NOM_JOUEUR_1:
			return saisir_nom_joueur(partie, 0);
		case TYPE_JOUEUR_2:
			return saisir_type_joueur(partie, 1);
		case NOM_JOUEUR_2:
			return saisir_nom_joueur(partie, 1);
		case TAILLE_PLATEAU:
			return saisir_taille_plateau(partie);
	}
}

Partie cli_creer_nouvelle_partie(void) {
	Partie partie = creer_partie();
	initialisation_partie(partie, questions_callback);
	if (!partie->initialisee) {
		detruire_partie(partie);
		return NULL;
	}
	return partie;
}

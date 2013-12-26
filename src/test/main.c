#include <stdlib.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#include "go/partie.h"
#include "go/plateau.h"
#include "cli/deroulement_partie.h"
#include "cli/affichage.h"

bool handle_passer(Partie partie, FILE* file, const char* arguments) {
	s_Coup coup;
	coup.position = POSITION_INVALIDE;
	partie_jouer_coup(partie, coup);
	return true;
}
bool handle_afficher(Partie partie, FILE* file, const char* arguments) {
	cli_afficher_plateau(partie->plateau);
	return true;
}
bool handle_message(Partie partie, FILE* file, const char* arguments) {
	printf(C_RED "%s\n" C_NORMAL, arguments);
	return true;
}
bool handle_commentaire(Partie partie, FILE* file, const char* arguments) {
	return true;
}
bool handle_coup(Partie partie, FILE* file, const char* arguments) {
	bool valide;
	s_Coup coup = cli_convertir_coup(partie, arguments, &valide);
	if (valide)
		valide &= partie_jouer_coup(partie, coup);
	return valide;
}

bool test_reponses_aux_questions(enum Question question, Partie partie) {
	switch (question) {
		case TYPE_JOUEUR_BLANC:
			partie->joueurs[JOUEUR_BLANC].type = HUMAIN;
			return true;
		case NOM_JOUEUR_BLANC:
			strcpy(partie->joueurs[JOUEUR_BLANC].nom, "Blanc");
			return true;
		case TYPE_JOUEUR_NOIR:
			partie->joueurs[JOUEUR_NOIR].type = HUMAIN;
			return true;
		case NOM_JOUEUR_NOIR:
			strcpy(partie->joueurs[JOUEUR_NOIR].nom, "Noir");
			return true;
		case TAILLE_PLATEAU:
			partie->plateau = creer_plateau(9);
			return true;
		default:
			return true;
	}
}

bool tester(const char* filename) {
	struct {
		const char* name;
		bool(*fonct)(Partie, FILE*, const char*);
	} handlers[] = {
		{.name="passer", .fonct=handle_passer},
		{.name="afficher", .fonct=handle_afficher},
		{.name="#", .fonct=handle_commentaire},
		{.name="!", .fonct=handle_message},
	};
	Partie partie = creer_partie();
	initialisation_partie(partie, test_reponses_aux_questions);
	bool reussi;
	FILE* file = fopen(filename, "r");

	if (file == NULL) {
		printf("impossible d'ouvrir %s\n", filename);
		reussi = false;
		goto out;
	}

	printf("tester(\"%s\")\n", filename);

	char buf[64];
	while (fgets(buf, sizeof(buf), file)) {
		buf[strlen(buf) - 1] = 0;

		const char* commande = buf;
		const char* arguments = NULL;

		char* position_espace;
		if ((position_espace = strstr(buf, " "))) {
			int index = position_espace - buf;
			buf[index] = 0;
			arguments = position_espace + 1;
		}

		bool trouve = false;
		for (int i = 0; i < sizeof(handlers)/sizeof(handlers[0]); i++) {
			if (strcmp(commande, handlers[i].name) == 0) {
				trouve = true;
				bool ok = handlers[i].fonct(partie, file, arguments);
				if (!ok) {
					printf("(!) La commande %s (%s) s'est mal passée.\n", commande, arguments);
					goto out;
				}
				break;
			}
		}
		if (!trouve) {
			if (!handle_coup(partie, file, commande)) {
				printf("(!) Le coup %s s'est mal passé.\n", commande);
			}
		}
	}

out:
	detruire_partie(partie);
	return reussi;
}

int main(int argc, const char *argv[]) {
	for (int i = 1; i < argc; i++) {
		tester(argv[i]);
	}
	return EXIT_SUCCESS;
}


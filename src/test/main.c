#include <stdlib.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#include "go/partie.h"
#include "go/plateau.h"
#include "cli/deroulement_partie.h"
#include "cli/affichage.h"

bool handle_passer(Partie partie, FILE* file, const char* arguments) {
	(void) file;
	(void) arguments;
	s_Coup coup;
	coup.position = POSITION_INVALIDE;
	partie_jouer_coup(partie, coup);
	return true;
}
bool handle_afficher(Partie partie, FILE* file, const char* arguments) {
	(void) file;
	(void) arguments;
	cli_afficher_plateau(partie->plateau);
	return true;
}
bool handle_message(Partie partie, FILE* file, const char* arguments) {
	(void) partie;
	(void) file;
	printf(C_YELLOW "%s\n" C_NORMAL, arguments);
	return true;
}
bool handle_commentaire(Partie partie, FILE* file, const char* arguments) {
	(void) partie;
	(void) file;
	(void) arguments;
	return true;
}
bool handle_fail(Partie partie, FILE* file, const char* arguments) {
	(void) file;
	bool valide;
	s_Coup coup = cli_convertir_coup(partie, arguments, &valide);
	if (valide)
		valide &= partie_jouer_coup(partie, coup) == false;
	return valide;
}
bool handle_vide(Partie partie, FILE* file, const char* arguments) {
	(void) file;
	bool valide;
	s_Coup coup = cli_convertir_coup(partie, arguments, &valide);
	if (valide)
		valide &= plateau_get_at(partie->plateau, coup.position) == VIDE;
	else
		printf("La case %s n'est pas vide.\n", arguments);
	return valide;
}
bool handle_coup(Partie partie, FILE* file, const char* arguments) {
	(void) file;
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
		{.name = "passer", .fonct = handle_passer},
		{.name = "afficher", .fonct = handle_afficher},
		{.name = "#", .fonct = handle_commentaire},
		{.name = "!", .fonct = handle_message},
		{.name = "fail", .fonct = handle_fail},
		{.name = "vide", .fonct = handle_vide},
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

	char buf[256];
	while (fgets(buf, sizeof(buf), file)) {
		buf[strlen(buf) - 1] = 0;
		if (buf[0] == 0) // ligne vide
			continue;

		const char* commande = buf;
		const char* arguments = NULL;

		char* position_espace;
		if ((position_espace = strstr(buf, " "))) {
			int index = position_espace - buf;
			buf[index] = 0;
			arguments = position_espace + 1;
		}

		bool trouve = false;
		for (unsigned i = 0; i < sizeof(handlers) / sizeof(handlers[0]); i++) {
			if (strcmp(commande, handlers[i].name) == 0) {
				trouve = true;
				bool ok = handlers[i].fonct(partie, file, arguments);
				if (!ok) {
					reussi = false;
					printf("(!) La commande %s (%s) s'est mal passée.\n", commande, arguments);
					goto out;
				}
				break;
			}
		}
		if (!trouve) {
			if (!handle_coup(partie, file, commande)) {
				reussi = false;
				printf("(!) Le coup %s s'est mal passé.\n", commande);
				goto out;
			}
		}
	}

	reussi = true;

out:
	if (!reussi && partie->plateau) {
		cli_afficher_plateau(partie->plateau);
	}
	detruire_partie(partie);
	return reussi;
}

int main(int argc, const char *argv[]) {
	for (int i = 1; i < argc; i++) {
		const char* filename = argv[i];

		if (i != 1)
			printf("\n\n");
		printf("============= "C_GREY "%s" C_NORMAL " =================\n", filename);

		if (!tester(filename)) {
			printf(C_BOLD C_RED "Le test %s a échoué.\n" C_NORMAL, filename);
		} else {
			printf(C_BOLD C_GREEN "Le test %s a réussi.\n" C_NORMAL, filename);
		}
	}
	return EXIT_SUCCESS;
}


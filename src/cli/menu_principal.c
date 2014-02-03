#include "cli/menu_principal.h"
#include "cli/saisie.h"

#include <stdio.h>
#include "cli/affichage.h"
#include "cli/configurer_partie.h"
#include "cli/deroulement_partie.h"
#include "go/sauvegarde.h"

void afficher_menu_principal(void)
{
	char choix;
	do {
		puts("==========GOSH===========");
		choix = cli_choisir_option("Que voulez-vous faire ?", 'p',
		                           'p', "Créer une nouvelle partie",
		                           'l', "Charger une partie",
		                           'c', "Voir les crédits",
		                           'q', "Quitter",
		                           0
		                          );

		if (choix == 'p') {
			Partie p = cli_creer_nouvelle_partie();
			if (p) {
				cli_afficher_plateau(p->plateau);
				cli_jouer_partie(p);
			}
		}
		if (choix == 'l') {
			char buffer[4096];
			cli_demander_string("fichier de sauvegarde", buffer, sizeof(buffer));
			Partie p = charger_partie_fichier(buffer);
			if (p) {
				cli_afficher_plateau(p->plateau);
				cli_jouer_partie(p);
			} else
				fprintf(stderr, "Impossible d'ouvrir le fichier '%s'\n", buffer);
		}
		if (choix == 'c')
			puts("==========Credit===========\n"
			     "Programme réalisé par Anger Jérémy et Migdal Denis (2013-2014)"
			    );
	} while (choix != 'q');
}

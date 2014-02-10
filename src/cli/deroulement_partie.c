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

/** @file deroulement_partie.c
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup cli
 *  @brief Implémente les fonctions utiles au déroulement d'une partie.
 */

#include <stdio.h>
#include <string.h>

#include "cli/deroulement_partie.h"
#include "cli/saisie.h"
#include "cli/affichage.h"
#include "go/partie.h"
#include "go/plateau.h"
#include "go/sauvegarde.h"


s_Coup cli_convertir_coup(const Partie partie, const char* str, bool* valide)
{
	(void) partie;

	int taille = plateau_get_taille(partie->plateau);
	s_Coup coup = str2coup(str, taille, valide);
	if (*valide) {
		if (! position_est_valide(coup.position)) {
			*valide = false;
		}
	}
	return coup;
}

void cli_jouer_partie(Partie partie)
{
	char choix;

	do {

		char label[32];
		char rep[32];
		while (!partie->finie) {
			enum CouleurJoueur couleur = partie_get_joueur(partie);

			if (partie->joueurs[couleur].type == HUMAIN) {
				snprintf(label, sizeof(label), "Au joueur %s de jouer",
				         couleur == JOUEUR_BLANC ? "blanc" : "noir");
				cli_demander_string(label, rep, sizeof(rep));

				if (! strcmp(rep, "s")) {
					char filename[4096];
					cli_demander_string("Sauvegarder la partie dans le fichier", filename, sizeof(filename));
					if (! sauvegarder_partie_fichier(filename, partie))
						perror("Erreur dans la sauvegarde de la partie");
					continue;
				} else if (! strcmp(rep, "p")) {
					s_Coup passer = { POSITION_INVALIDE };
					partie_jouer_coup(partie, passer);
					continue;
				} else if (! strcmp(rep, "a")) {
					partie_annuler_coup(partie);
					cli_afficher_plateau(partie->plateau);
					continue;
				} else if (! strcmp(rep, "r")) {
					partie_rejouer_coup(partie);
					cli_afficher_plateau(partie->plateau);
					continue;
				} else if (! strcmp(rep, "q")) {
					break;
				}


				bool valide;
				s_Coup coup = cli_convertir_coup(partie, rep, &valide);
				if (valide) {
					bool reussi = partie_jouer_coup(partie, coup);
					(void) reussi; // pour les erreurs de compilation en mode release
					gosh_debug("coup reussi: %s", reussi ? "oui" : "non");
					cli_afficher_plateau(partie->plateau);
				}
			} else {
				partie_jouer_ordinateur(partie);
				cli_afficher_plateau(partie->plateau);
			}
		}
		if (partie->finie) {
			printf("Partie terminée !\n");
			float scores[2];
			partie_score_joueurs(partie, scores, VALEUR_KOMI_FRANCE);
			enum CouleurJoueur gagnant = scores[JOUEUR_NOIR] > scores[JOUEUR_BLANC] ? JOUEUR_NOIR : JOUEUR_BLANC;
			printf("Gagnant : %s (%s)\n", partie->joueurs[gagnant].nom,
					gagnant == JOUEUR_NOIR ? "noir" : "blanc");
			printf("Score des noirs : %.1f\n", scores[JOUEUR_NOIR]);
			printf("Score des blancs : %.1f\n", scores[JOUEUR_BLANC]);
		}

		choix = cli_choisir_option("Que souhaitez-vous faire ?", 0, 'r', "rejouer la partie",
		                           's', "sauvegarder la partie",
		                           'q', "quitter", 0);
		if (choix == 's') {
			char filename[4096];
			cli_demander_string("Sauvegarder la partie dans le fichier", filename, sizeof(filename));
			if (! sauvegarder_partie_fichier(filename, partie))
				perror("Erreur dans la sauvegarde de la partie");
		} else if (choix == 'r') {
			reinitialisation_partie(partie);
			partie->finie = false;
			cli_afficher_plateau(partie->plateau);
		}
	} while (choix != 'q');
}

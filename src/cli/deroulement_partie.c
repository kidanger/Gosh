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
#include <string.h>

#include "cli/deroulement_partie.h"
#include "cli/saisie.h"
#include "cli/affichage.h"
#include "go/partie.h"
#include "go/plateau.h"


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
	char label[32];
	char rep[32];
	while (!partie->finie) {
		enum CouleurJoueur couleur = partie_get_joueur(partie);
		if (partie->joueurs[couleur].type == HUMAIN) {
			snprintf(label, sizeof(label), "Au joueur %s de jouer",
			         couleur == JOUEUR_BLANC ? "blanc" : "noir");
			cli_demander_string(label, rep, sizeof(rep));

			bool valide;
			s_Coup coup = cli_convertir_coup(partie, rep, &valide);
			if (valide) {
				bool reussi = partie_jouer_coup(partie, coup);
				gosh_debug("coup reussi: %s", reussi ? "oui" : "non");
				cli_afficher_plateau(partie->plateau);
			}
		} else {
			partie_jouer_ordinateur(partie);
			cli_afficher_plateau(partie->plateau);
		}
	}
}

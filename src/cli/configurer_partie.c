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

/** @file configurer_partie.c
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup cli
 *  @brief Implémente les fonctions permettant de configurer une partie.
 */

#include <stdio.h>
#include <assert.h>
#include <string.h>

#include "cli/configurer_partie.h"
#include "cli/saisie.h"
#include "go/plateau.h"
#include "go/joueur.h"
#include "go/ordinateur.h"

/** @ingroup cli
 *  @brief Demande à l'utilisateur de saisir le type d'un joueur
 *  @param Partie à configurer
 *  @param Couleur du joueur à configurer
 *  @return Retourne faux en cas d'échec.
 */
bool saisir_type_joueur(Partie partie, enum CouleurJoueur couleur)
{
#ifdef CONFIGURER_PARTIE_AUTOMATIQUEMENT
	partie->joueurs[couleur].type = ORDINATEUR;
	/*partie->joueurs[couleur].type = HUMAIN;*/
	return true;
#endif
	const char* str = couleur == JOUEUR_NOIR ? "Type du joueur noir" : "Type du joueur blanc";
	char res = cli_choisir_option(str, 0, 'h', "humain", 'o', "ordinateur", 'r', "retour", 0);

	enum TypeJoueur type;
	if (res == 'o')
		type = ORDINATEUR;
	else if (res == 'h')
		type = HUMAIN;
	else
		return false;

	partie->joueurs[couleur].type = type;

	return true;
}


/** @ingroup cli
 *  @brief Demande à l'utilisateur de saisir le nom du joueur.
 *  @param Partie à configurer
 *  @param Couleur du joueur à configurer
 */
bool saisir_nom_joueur(Partie partie, enum CouleurJoueur couleur)
{
#ifdef CONFIGURER_PARTIE_AUTOMATIQUEMENT
	if (couleur == JOUEUR_BLANC)
		strcpy(partie->joueurs[couleur].nom, "Henry");
	else
		strcpy(partie->joueurs[couleur].nom, "Jack");
	return true;
#endif
	const char* str = couleur == JOUEUR_NOIR ? "Nom du joueur noir" : "Nom du joueur blanc";
	char buf[TAILLE_NOM_JOUEUR] = {0};
	cli_demander_string(str, buf, sizeof(buf));

	if (buf[0]) {
		strncpy(partie->joueurs[couleur].nom, buf, TAILLE_NOM_JOUEUR);
	}

	return buf[0] != 0;
}


/** @ingroup cli
 *  @brief Demande à l'utilisateur d'entrer le type de robot à utiliser
 *  @param Partie à configurer
 *  @param Couleur du joueur à configurer
 *  @return Retourne faux en cas d'échec.
 */
bool saisir_programme(Partie partie, enum CouleurJoueur couleur)
{
	Ordinateur ordi;
#ifdef CONFIGURER_PARTIE_AUTOMATIQUEMENT
	if (couleur == JOUEUR_BLANC)
		ordi = charger_ordinateur("random");
	else
		ordi = charger_ordinateur("gnugo");
	partie->joueurs[couleur].ordinateur = ordi;
	return ordi != NULL;
#endif
	do {
		const char* str = "Type d'ordinateur";
		char rep = cli_choisir_option(str, 'g', 'a', "Aléatoire",
		                              'g', "GNU Go", 'r', "retour", 0);
		if (rep == 'a') {
			ordi = charger_ordinateur("random");
		} else if (rep == 'g') {
			ordi = charger_ordinateur("gnugo");
			if (!ordi)
				printf("Nécessite l'installation de GNU Go.\n");
		} else if (rep == 'r') {
			break;
		}
	} while (ordi == NULL);
	partie->joueurs[couleur].ordinateur = ordi;
	return ordi != NULL;
}


/** @ingroup cli
 *  @brief Demande à l'utilisateur de saisir la taille du plateau utilisé
 *  @param Partie à configurer
 *  @return Retourne faux en cas d'échec.
 */
bool saisir_taille_plateau(Partie partie)
{
#ifdef CONFIGURER_PARTIE_AUTOMATIQUEMENT
	partie->plateau = creer_plateau(9);
	return true;
#endif
	const char* str = "Taille du plateau";
	char rep = cli_choisir_option(str, 0, 'p', "petit (9x9)",
	                              'm', "moyen (13x13)", 'g', "grand (19x19)", 'r', "retour", 0);
	if (rep == 'p')
		partie->plateau = creer_plateau(9);
	else if (rep == 'm')
		partie->plateau = creer_plateau(13);
	else if (rep == 'g')
		partie->plateau = creer_plateau(19);
	return rep != 'r';
}


/** @ingroup cli
 *  @brief Demande à l'utilisateur de saisir l'handicap pour la partie
 *  @param Partie à configurer
 *  @return Retourne faux en cas d'échec.
 */
bool saisir_handicap(Partie partie)
{
#ifdef CONFIGURER_PARTIE_AUTOMATIQUEMENT
	partie->handicap = 3;
	return true;
#endif
	const char* str = "Handicap (joueur noir) (-1 pour retour)";
	int rep = cli_demander_int(str);
	partie->handicap = rep;
	return rep != -1;
}

/** @ingroup cli
 *  @brief Demande à l'utilisateur de répondre à une question
 *  @param Question à laquelle l'utilisateur doit répondre
 *  @param Partie à configurer
 *  @param Données quelconques
 *  @return Retourne faux en cas d'échec.
 */
bool questions_callback(enum Question question, Partie partie, void* userdata)
{
	(void) userdata;
	switch (question) {
		case TYPE_JOUEUR_BLANC:
			return saisir_type_joueur(partie, JOUEUR_BLANC);
		case NOM_JOUEUR_BLANC:
			return saisir_nom_joueur(partie, JOUEUR_BLANC);
		case PROGRAMME_JOUEUR_BLANC:
			return saisir_programme(partie, JOUEUR_BLANC);
		case TYPE_JOUEUR_NOIR:
			return saisir_type_joueur(partie, JOUEUR_NOIR);
		case NOM_JOUEUR_NOIR:
			return saisir_nom_joueur(partie, JOUEUR_NOIR);
		case PROGRAMME_JOUEUR_NOIR:
			return saisir_programme(partie, JOUEUR_NOIR);
		case TAILLE_PLATEAU:
			return saisir_taille_plateau(partie);
		case HANDICAP:
			return saisir_handicap(partie);
		default :
			break;
	}
	return true;
}


/** @ingroup cli
 *  @brief Crée une nouvelle partie
 *
 *  Demande à l'utilisateur de saisir les informations nécessaire à la configuration d'une partie
 *  @return Partie ainsi créée.
 */
Partie cli_creer_nouvelle_partie(void)
{
	Partie partie = creer_partie();
	initialisation_partie(partie, questions_callback, NULL);
	if (!partie->initialisee) {
		detruire_partie(partie);
		return NULL;
	}
	return partie;
}


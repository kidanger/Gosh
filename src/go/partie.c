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

/** @file partie.c
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 *  @brief Implémente les fonctions liées à la partie
 */

#include "gosh_alloc.h"
#include "go/plateau.h"
#include "go/position.h"
#include "go/ordinateur.h"
#include "go/partie.h"

/** @def JOUEUR_SUIVANT(couleur)
 *  @ingroup go
 *  @brief Donne le joueur suivant
 */
#define JOUEUR_SUIVANT(couleur) ((couleur) == JOUEUR_BLANC ? JOUEUR_NOIR : JOUEUR_BLANC)

Partie creer_partie(void)
{
	Partie partie = gosh_alloc(*partie);
	partie->initialisee = false;
	partie->plateaux_joues = creer_plateaux();
	partie->plateaux_annules = creer_plateaux();
	partie->handicap = 0;
	partie->finie = false;
	return partie;
}

void detruire_partie(Partie partie)
{
	if (partie->plateaux_joues)
		detruire_plateaux(partie->plateaux_joues);
	if (partie->plateaux_annules)
		detruire_plateaux(partie->plateaux_annules);
	if (partie->plateau)
		detruire_plateau(partie->plateau);
	if (partie->initialisee) {
		if (partie->joueurs[0].type == ORDINATEUR) {
			decharger_ordinateur(partie->joueurs[0].ordinateur);
		}
		if (partie->joueurs[1].type == ORDINATEUR) {
			decharger_ordinateur(partie->joueurs[1].ordinateur);
		}
	}
	gosh_free(partie);
}

bool question_coherante(enum Question idQuestion, Partie partie)
{
	switch (idQuestion) {
		case PROGRAMME_JOUEUR_BLANC:
			if (partie->joueurs[JOUEUR_BLANC].type != ORDINATEUR)
				return false;
			break;

		case PROGRAMME_JOUEUR_NOIR:
			if (partie->joueurs[JOUEUR_NOIR].type != ORDINATEUR)
				return false;
			break;

		default :
			return true;
	}
	return true;
}

void initialisation_partie(Partie partie, FonctionQuestions fonctionQuestions, void* userdata)
{
	int idQuestion = PREMIERE_QUESTION;

	while (idQuestion < NOMBRE_QUESTIONS) {
		if (question_coherante(idQuestion, partie) && ! fonctionQuestions(idQuestion, partie, userdata))
			break;

		idQuestion++;
	}

	if (idQuestion == NOMBRE_QUESTIONS) {
		partie->initialisee = true;
		partie->joueur_courant = JOUEUR_NOIR;
		partie_informer_ordinateur(partie);
	}
}

void reinitialisation_partie(Partie partie)
{
	while (partie_annuler_coup(partie));
	partie->finie = false;

	partie_informer_ordinateur(partie);
}

void partie_informer_ordinateur(Partie partie)
{
	// envoi des informations aux ordinateurs
	for (int j = 0; j < 2; j++) {
		struct s_Joueur joueur = partie->joueurs[j];
		if (joueur.type == ORDINATEUR) {
			ordinateur_remplacer_plateau(joueur.ordinateur, partie->plateau);
		}
	}
}

enum CouleurJoueur partie_get_joueur(Partie partie)
{
	return partie->joueur_courant;
}

bool partie_jouer_coup(Partie partie, s_Coup coup)
{
	if (partie->finie)
		return false;
	bool valide = false;
	bool passer_son_tour = position_est_valide(coup.position) == false;
	Plateau copie = plateau_clone(partie->plateau);
	if (passer_son_tour) {
		// le joueur passe son tour
		valide = true;
	} else {
		// placement d'un pion
		s_Pion pion;
		pion.position = coup.position;
		pion.couleur = partie->joueur_courant == JOUEUR_BLANC ? BLANC : NOIR;
		Chaines capturees = plateau_capture_chaines(partie->plateau, pion, &valide);
		if (capturees)
			detruire_ensemble_chaine(capturees);
	}

	// si le coup est valide, on vérifie que le résultat ne correspond pas à un plateau déjà joué
	if (valide && !passer_son_tour) {
		Plateau p;
		gosh_foreach(p, partie->plateaux_joues) {
			if (plateau_est_identique(partie->plateau, p)) {
				gosh_debug("Plateau identique");
				valide = false;
				break;
			}
		}
		// si non valide, on rétablit le plateau d'avant
		if (!valide) {
			Plateau old = partie->plateau;
			partie->plateau = copie;
			copie = old; // pour qu'il soit détruit
		}
	}

	if (valide) {
		// notification aux ordinateurs
		enum CouleurJoueur couleur = partie->joueur_courant;
		for (int j = 0; j < 2; j++) {
			struct s_Joueur joueur = partie->joueurs[j];
			if (joueur.type == ORDINATEUR) {
				ordinateur_notifier_coup(joueur.ordinateur, partie, couleur, coup);
			}
		}
		// on passe au joueur suivant
		partie->joueur_courant = JOUEUR_SUIVANT(partie->joueur_courant);

		// on sauvegarde le plateau
		gosh_ajouter(partie->plateaux_joues, copie);
		// on vide la liste des coups annulés
		while (!gosh_vide(partie->plateaux_annules)) {
			Plateau p = gosh_supprimer_tete(partie->plateaux_annules);
			detruire_plateau(p);
		}
	} else {
		detruire_plateau(copie);
	}

	// si on est encore en phase 'handicap'
	if (partie_en_cours_de_handicap(partie) && partie->joueur_courant == JOUEUR_BLANC) {
		s_Coup passer = {POSITION_INVALIDE};
		partie_jouer_coup(partie, passer);
	}

	// si on passe son tour, on vérifie la fin de partie
	if (passer_son_tour && gosh_nombre_elements(partie->plateaux_joues) >= 2) {
		Plateau n2 = gosh_get(partie->plateaux_joues, 1);
		Plateau n1 = gosh_get(partie->plateaux_joues, 0);
		if (plateau_est_identique(n1, n2) && plateau_est_identique(partie->plateau, n1)) {
			gosh_debug("Partie terminée");
			partie->finie = true;
		}
	}
	return valide;
}

void partie_jouer_ordinateur(Partie partie)
{
	Ordinateur ordi = partie->joueurs[partie->joueur_courant].ordinateur;
	ordinateur_jouer_coup(ordi, partie, partie->joueur_courant);
}

bool partie_en_cours_de_handicap(Partie partie)
{
	return gosh_nombre_elements(partie->plateaux_joues) / 2 < partie->handicap - 1;
}

bool partie_annuler_coup(Partie partie)
{
	if (gosh_vide(partie->plateaux_joues)) {
		return false;
	}

	Plateau nouveau = gosh_supprimer_tete(partie->plateaux_joues);
	gosh_ajouter(partie->plateaux_annules, partie->plateau);
	partie->plateau = nouveau;
	partie->joueur_courant = JOUEUR_SUIVANT(partie->joueur_courant);

	if (partie_en_cours_de_handicap(partie) && partie->joueur_courant == JOUEUR_BLANC) {
		partie_annuler_coup(partie);
	} else if (partie->joueurs[partie->joueur_courant].type == ORDINATEUR &&
	           partie->joueurs[JOUEUR_SUIVANT(partie->joueur_courant)].type == HUMAIN) {
		// si le nouveau joueur est un ordinateur, on annule son coup
		partie_annuler_coup(partie);
	}

	partie_informer_ordinateur(partie);
	return true;
}

bool partie_rejouer_coup(Partie partie)
{
	if (gosh_vide(partie->plateaux_annules)) {
		return false;
	}

	Plateau nouveau = gosh_supprimer_tete(partie->plateaux_annules);
	gosh_ajouter(partie->plateaux_joues, partie->plateau);
	partie->plateau = nouveau;
	partie->joueur_courant = JOUEUR_SUIVANT(partie->joueur_courant);

	if (partie_en_cours_de_handicap(partie) && partie->joueur_courant == JOUEUR_BLANC) {
		partie_rejouer_coup(partie);
	} else if (partie->joueurs[partie->joueur_courant].type == ORDINATEUR &&
	           partie->joueurs[JOUEUR_SUIVANT(partie->joueur_courant)].type == HUMAIN) {
		// si le nouveau joueur est un ordinateur, on rejoue son coup
		partie_rejouer_coup(partie);
	}

	partie_informer_ordinateur(partie);
	return true;
}

void partie_score_joueurs(Partie partie, float* scores, float valKomi)
{
	// méthode peu efficace, mais on ne calcule le score qu'une fois
	// donc c'est assez négligeable
	scores[JOUEUR_NOIR] = 0;
	scores[JOUEUR_BLANC] = partie->handicap <= 1 ? 0.5 : valKomi;
	int taille = plateau_get_taille(partie->plateau);
	for (int y = 0; y < taille; y++) {
		for (int x = 0; x < taille; x++) {
			Position pos = position(x, y, taille);
			Couleur c = plateau_get_at(partie->plateau, pos);
			if (c == NOIR) {
				scores[JOUEUR_NOIR]++;
			} else if (c == BLANC) {
				scores[JOUEUR_BLANC]++;
			} else {
				Territoire territoire = determiner_territoire(partie->plateau, pos);
				if (ensemble_colore_couleur(territoire) == NOIR) {
					scores[JOUEUR_NOIR]++;
				} else if (ensemble_colore_couleur(territoire) == BLANC) {
					scores[JOUEUR_BLANC]++;
				}
				detruire_territoire(territoire);
			}
		}
	}
}


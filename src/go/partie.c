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
#include "gosh_alloc.h"
#include "go/plateau.h"
#include "go/position.h"
#include "go/ordinateur.h"
#include "go/partie.h"

#define JOUEUR_SUIVANT(couleur) ((couleur) == JOUEUR_BLANC ? JOUEUR_NOIR : JOUEUR_BLANC)

Partie creer_partie(void)
{
	Partie partie = gosh_alloc(*partie);
	partie->initialisee = false;
	return partie;
}

void detruire_partie(Partie partie)
{
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

void initialisation_partie(Partie partie, FonctionQuestions fonctionQuestions)
{
	enum Question idQuestion = PREMIERE_QUESTION;

	while (idQuestion < NOMBRE_QUESTIONS) {
		if (question_coherante(idQuestion, partie) && ! fonctionQuestions(idQuestion, partie))
			break;

		idQuestion++;
	}

	if (idQuestion == NOMBRE_QUESTIONS) {
		partie->initialisee = true;
	}
	// envoi des informations aux ordinateurs
	for (int j = 0; j < 2; j++) {
		struct s_Joueur joueur = partie->joueurs[j];
		if (joueur.type == ORDINATEUR) {
			ordinateur_debut_partie(joueur.ordinateur, partie);
		}
	}

	partie->plateaux_joues = creer_ensemble_plateau();
	partie->plateaux_annules = creer_ensemble_plateau();
	partie->joueur_courant = JOUEUR_NOIR;
}

enum CouleurJoueur partie_get_joueur(Partie partie)
{
	return partie->joueur_courant;
}

bool partie_jouer_coup(Partie partie, s_Coup coup)
{
	bool valide = false;
	Plateau copie = plateau_clone(partie->plateau);
	if (! position_est_valide(coup.position)) {
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
	return valide;
}

void partie_jouer_ordinateur(Partie partie)
{
	Ordinateur ordi = partie->joueurs[partie->joueur_courant].ordinateur;
	ordinateur_jouer_coup(ordi, partie, partie->joueur_courant);
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
	return true;
}


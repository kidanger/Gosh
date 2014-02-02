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
#ifndef GOSH_GO_PARTIE
#define GOSH_GO_PARTIE

#include <stdbool.h>

#include "go/plateau_type.h"
#include "go/joueur.h"
#include "go/coup.h"
#include "go/ensemble_plateaux.h"

struct s_Partie {
	Plateau plateau;
	struct s_Joueur joueurs[2];
	int handicap;
	bool initialisee;
	bool finie;
	enum CouleurJoueur joueur_courant;
	EnsemblePlateau plateaux_joues;
	EnsemblePlateau plateaux_annules;
};

typedef struct s_Partie* Partie;

enum Question {
	PREMIERE_QUESTION,
	TYPE_JOUEUR_BLANC = PREMIERE_QUESTION,
	NOM_JOUEUR_BLANC,
	PROGRAMME_JOUEUR_BLANC, // si type = ORDINATEUR

	TYPE_JOUEUR_NOIR,
	NOM_JOUEUR_NOIR,
	PROGRAMME_JOUEUR_NOIR, // si type = ORDINATEUR

	TAILLE_PLATEAU,
	HANDICAP,
};
#define NOMBRE_QUESTIONS (HANDICAP+1)

typedef bool (*FonctionQuestions)(enum Question question, Partie partie, void* userdata);


Partie creer_partie(void);
void detruire_partie(Partie partie);

/** Initialise la partie en fonction des réponses aux différentes questions :
  * - noms et natures des joueurs
  * - taille du plateau parmi 9x9, 13x13 et 19x19 */
void initialisation_partie(Partie partie, FonctionQuestions fonctionQuestions, void* userdata);
void reinitialisation_partie(Partie partie);

enum CouleurJoueur partie_get_joueur(Partie partie);
bool partie_jouer_coup(Partie partie, s_Coup coup);
void partie_jouer_ordinateur(Partie partie);

bool partie_en_cours_de_handicap(Partie partie);

/**
 * Annule le dernier coup joué
 */
bool partie_annuler_coup(Partie partie);

/**
 * Rejoue le dernier coup annulé
 */
bool partie_rejouer_coup(Partie partie);


#endif

/* Copyright © 2013 Jérémy Anger, Denis Migdal
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

struct s_Partie {
	Plateau plateau;
	struct s_Joueur joueurs[2];
	bool initialisee;
};

typedef struct s_Partie* Partie;

enum Question {
    TYPE_JOUEUR_1,
    NOM_JOUEUR_1,
    TYPE_JOUEUR_2,
    NOM_JOUEUR_2,
    TAILLE_PLATEAU,
    NOMBRE_QUESTIONS,
};

typedef bool (*FonctionQuestions)(enum Question question, Partie partie);


Partie creer_partie(void);
void detruire_partie(Partie partie);

/** Initialise la partie en fonction des réponses aux différentes questions :
  * - noms et natures des joueurs
  * - taille du plateau parmi 9x9, 13x13 et 19x19 */
void initialisation_partie(Partie partie, FonctionQuestions fonctionQuestions);


#endif

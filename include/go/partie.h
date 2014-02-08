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

/** @defgroup go
 *  @brief Ensemble des fichiers et des fonctions relatif au jeu de go (hors affichage)
 */

/** @file partie.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 *  @brief Défini les structures et les fonctions relative à la partie
 */

#include <stdbool.h>

#include "go/plateau_type.h"
#include "go/joueur.h"
#include "go/coup.h"
#include "go/ensemble_plateaux.h"

/** @def VALEUR_KOMI_FRANCE
 *  @ingroup go
 *  @brief Valeur du Komi en France.
 */
#define VALEUR_KOMI_FRANCE 7.5

/** @ingroup go
 *  @brief Décris une partie
 */
struct s_Partie {
    /** @brief Plateau de la partie */
	Plateau plateau;
    /** @brief Joueurs de la partie */
	struct s_Joueur joueurs[2];
    /** @brief handicap de la partie */
	int handicap;
    /** @brief Indique si la partie a été initialisée */
	bool initialisee;
    /** @brief Indique si la partie est finie */
	bool finie;
    /** @brief Indique le joueur dont c'est le tour de jouer. */
	enum CouleurJoueur joueur_courant;
    /** @brief Ensemble des anciens états du plateau */
	EnsemblePlateau plateaux_joues;
    /** @brief Ensemble des états du plateau annulé */
	EnsemblePlateau plateaux_annules;
};

/** @ingroup go
 *  @brief Décris une partie
 */
typedef struct s_Partie* Partie;

/** @ingroup go
 *  @brief Donne les questions à poser au joueur
 */
enum Question {
    /** @brief Première question */
	PREMIERE_QUESTION,
	TYPE_JOUEUR_NOIR = PREMIERE_QUESTION,
	NOM_JOUEUR_NOIR,
    /** @brief Question posée si le joueur noir est une IA */
    PROGRAMME_JOUEUR_NOIR,

	TYPE_JOUEUR_BLANC,
	NOM_JOUEUR_BLANC,
    /** @brief Question posée si le joueur blanc est une IA */
    PROGRAMME_JOUEUR_BLANC,

	TAILLE_PLATEAU,
	HANDICAP,
    /** @brief Nombre de questions */
    NOMBRE_QUESTIONS
};

/** @ingroup go
 *  @brief Défini le prototype des fonctions servant à poser une question à l'utilisateur
 */
typedef bool (*FonctionQuestions)(enum Question question, Partie partie, void* userdata);


/** @ingroup go
 *  @brief Crée une partie
 *  @return Partie ainsi crée
 */
Partie creer_partie(void);

/** @ingroup go
 *  @brief Détruit une partie
 *  @param Partie à détruire
 */
void detruire_partie(Partie partie);

/** @ingroup go
 *  @brief Initialise la partie en fonction des réponses aux différentes questions.
 *  @param Partie à initialiser
 *  @param Questions à poser
 *  @param ?
 */
void initialisation_partie(Partie partie, FonctionQuestions fonctionQuestions, void* userdata);

/** @ingroup go
 *  @brief Annule tous les coups joués et remet les scores à 0.
 *  @param partie à réinitialiser
 */
void reinitialisation_partie(Partie partie);

/** @ingroup go
 *  @brief Demande à l'IA de jouer un coup
 *  @param Partie en cours
 */
void partie_jouer_ordinateur(Partie partie);

/** @ingroup go
 *  @brief Retourne la couleur du joueur courant
 *  @param Partie en cours
 *  @return Couleur du joueur de la partie en cours
 */
enum CouleurJoueur partie_get_joueur(Partie partie);

/** @ingroup go
 *  @brief Joue un coup
 *  @param partie en cours
 *  @param coup à jouer
 *  @return faux en cas d'erreur
 */
bool partie_jouer_coup(Partie partie, s_Coup coup);


/** @ingroup go
 *  @brief Informe l'IA de l'état de la partie
 *  @param Partie en cours
 */
void partie_informer_ordinateur(Partie partie);

/** @ingroup go
 *  @brief Indique si les joueurs sont en train de jouer les handicaps
 *  @param partie en cours
 *  @return vrai si la partie est en cours de handicaps
 */
bool partie_en_cours_de_handicap(Partie partie);

/** @ingroup go
 *  @brief Annule le dernier coup joué
 *  @param Partie en cours
 *  @return Faux en cas d'erreur
 */
bool partie_annuler_coup(Partie partie);

/** @ingroup go
 *  @brief Rejout le dernier coup annulé
 *  @param Partie en cours
 *  @return Faux en cas d'erreur
 */
bool partie_rejouer_coup(Partie partie);

/** @ingroup go
 *  @brief Calcul la valeur des deux scores des deux joueurs en fin de partie en tenant compte du komi.
 *  @param partie en cours
 *  @param scores de la partie en cours
 *  @param valeur du komi
 *  @bug ne tient pas compte des pierres mortes/vivantes
 */
void partie_score_joueurs(Partie p, float *scores, float valKomi);


#endif

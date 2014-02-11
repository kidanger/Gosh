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

/** @file tutoriel.c
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 12/02/2014
 *  @ingroup sdl
 *  @brief Gère le tutoriel
 */

#include <stdlib.h>
#include <stdbool.h>

#include "gosh_alloc.h"
#include "go/plateau.h"
#include "sdl/state.h"
#include "sdl/label.h"
#include "sdl/bouton.h"
#include "sdl/tools.h"
#include "sdl/main.h"
#include "sdl/jouer.h"
#include "sdl/tutoriel.h"

#define NB_ETATS 9

/** @ingroup sdl
 *  @brief Structure du tutoriel
 */
struct tutorieldata {
	/** @brief État parent (le menu) */
	struct state* parent;
	/** @brief Titre */
	struct label* titre;
	/** @brief Bouton précédent */
	struct bouton* bouton_precedent;
	/** @brief Bouton suivant */
	struct bouton* bouton_suivant;
	/** @brief état courant */
	int etat;
	/** @brief Plateaux */
	Plateau plateaux[NB_ETATS];
	/** @brief Indications */
	struct label** labels[NB_ETATS];
	/** @brief Nombre de labels */
	int nb_labels[NB_ETATS];
	/** @brief Titres */
	struct label* titres[NB_ETATS];
};

/** @ingroup sdl
 *  @brief Dessine le tutoriel sur une surface
 *  @param État courant
 *  @param Surface sur laquelle dessiner le tutoriel
 */
static void afficher_tutoriel(struct state*, SDL_Surface*);

/** @ingroup sdl
 *  @brief Met à jour le tutoriel
 *  @param État courant
 *  @param Temps passé de la dernière mise à jour
 */
static void mise_a_jour_tutoriel(struct state* state, double dt);

/** @ingroup sdlDébut du plateau en Y
 *  @brief Traite un événement SDL
 *  @param État courant
 *  @param Événement sdl
 */
static void event_tutoriel(struct state* state, SDL_Event event);

/** @ingroup sdl
 *  @brief Appelée lors du clic sur le bouton suivant
 *  @param Bouton qui a déclenché l'appel
 *  @param État courant
 */
static void tutoriel_bouton_suivant(struct bouton*, void * data);

/** @ingroup sdl
 *  @brief Appelée lors du clic sur le bouton précedent
 *  @param Bouton qui a déclenché l'appel
 *  @param État courant
 */
static void tutoriel_bouton_precedent(struct bouton*, void * data);

struct state* creer_tutoriel(struct state* parent)
{
	struct state* state = gosh_alloc(*state);
	struct tutorieldata* tuto = gosh_alloc(*tuto);
	state->afficher = afficher_tutoriel;
	state->mise_a_jour = mise_a_jour_tutoriel;
	state->mousemotion = event_tutoriel;
	state->mousebuttondown = event_tutoriel;
	state->mousebuttonup = event_tutoriel;
	state->keydown = event_tutoriel;
	state->destructeur = detruire_tutoriel;
	state->data = tuto;
	tuto->parent = parent;

	set_color(50, 50, 150);
	tuto->titre = creer_label("Tutoriel", W / 2 - W * .1, H * .05, CENTER_XY, BIG);

	set_color(50, 250, 50);
	struct bouton* bouton;
	bouton = creer_bouton("Suivant", W * .65, H * .9, 100, 30);
	bouton->callback = tutoriel_bouton_suivant;
	bouton->userdata = state;
	tuto->bouton_suivant = bouton;
	bouton = creer_bouton("Précedent", W * .25, H * .9, 100, 30);
	bouton->callback = tutoriel_bouton_precedent;
	bouton->userdata = state;
	tuto->bouton_precedent = bouton;

	set_color(155, 50, 50);
	const char* instructions[NB_ETATS][11] = {
		{
			"Le Goban",
			"Le plateau s'appelle un Goban.",
			" ",
			"Sa taille officielle est de 19x19",
			"mais on peut aussi jouer sur des",
			"Gobans de 13x13 ou 9x9.",
			NULL
		},
		{
			"Les joueurs",
			"Le go se joue à deux.",
			"Chaque joueur est associé à une",
			"couleur (blanc ou noir).",
			NULL
		},
		{
			"Intersections",
			"Les joueurs peuvent poser un pion",
			"de leur couleur (nommé pierre) sur",
			"une intersection inoccupée.",
			" ",
			"Les intersections mises en",
			"valeurs s'appellent des Hoshis.",
			NULL
		},
		{
			"Déroulement",
			"À chaque tour, les joueurs devront",
			"soit poser une pierre, soit passer son tour",
			"Si les deux joueurs passent leur",
			"tour à la suite, la partie est considérée",
			"comme finie.",
			" ",
			"Un joueur ne peut pas, en jouant,",
			"redonner au Goban un état identique",
			"à un de ses état antérieur.",
			NULL
		},
		{
			"Chaîne",
			"Deux pierres sont voisines si elles",
			"sont adjacentes (gauche, haut, bas, droit).",
			" ",
			"Une chaîne est un ensemble de pierres",
			"voisines de proches en proches.",
			NULL
		},
		{
			"Capture",
			"Les libertés de la chaine sont les",
			"intersections inoccupées et voisines",
			"à la chaine.",
			" ",
			"Un territoire est un ensemble",
			"d'intersections voisines vides.",
			NULL
		},
		{
			"Libertés",
			"Si un joueur supprime la dernière",
			"liberté d'une chaine, il la capture",
			"en retirant les pierres de la chaîne",
			"du Goban.",
			" ",
			"Un joueur ne peut construire une chaîne",
			"sans liberté sauf si par ce coup",
			"il capture une chaîne adverse.",
			NULL
		},
		{
			"Points",
			"À la fin de la partie, les points d'un",
			"joueur correspond au nombre de pierre",
			"de sa couleur et au nombre d'intersections",
			"des territoires qu'il possède.",
			" ",
			"On ajoute 7.5 points (le komi)",
			"au joueur blanc.",
			"Le joueur qui a le plus de points",
			"gagne la partie.",
			NULL
		},
		{
			"Détails",
			"Pour plus de détails,",
			"rendez-vous sur http://jeudego.org",
			NULL
		},
	};
	int x = W * .52;
	for (int e = 0; e < NB_ETATS; e++) {
		const char** instr = instructions[e];
		int y = H * .3;
		const char* titre = instr[0];
		tuto->titres[e] = creer_label(titre, W * .7, H * .2, CENTER_XY, BIG);
		int nb = 0;
		// calcul du nombre d'éléments
		int i = 1;
		while (instr[i]) {
			nb++;
			i++;
		}
		tuto->labels[e] = gosh_allocn(struct label*, nb);
		tuto->nb_labels[e] = nb;
		for (i = 0; i < nb; i++) {
			tuto->labels[e][i] = creer_label(instr[i+1], x, y, LEFT, NORMAL);
			y += 25;
		}
	}

	const Position infos[NB_ETATS][16] = {
		{
			POSITION_INVALIDE,
		},
		{
			position(1, 0, 9),
			position(2, 0, 9),
			POSITION_INVALIDE,
		},
		{
			POSITION_INVALIDE,
		},
		{
			POSITION_INVALIDE,
		},
		{
			position(1, 1, 9),
			position(2, 1, 9),
			POSITION_INVALIDE,
		},
		{
			position(0, 1, 9),
			position(1, 2, 9),
			position(2, 2, 9),
			position(0, 2, 9),
			POSITION_INVALIDE,
		},
		{
			POSITION_INVALIDE,
		},
		{
			POSITION_INVALIDE,
		},
		{
			POSITION_INVALIDE,
		},
	};
	Couleur c = NOIR;
	for (int e = 0; e < NB_ETATS; e++) {
		if (e == 0) {
			tuto->plateaux[e] = creer_plateau(9);
		} else {
			tuto->plateaux[e] = plateau_clone(tuto->plateaux[e - 1]);
		}
		int i = 0;
		while (position_est_valide(infos[e][i])) {
			plateau_set_at(tuto->plateaux[e], infos[e][i], c);
			c = c == NOIR ? BLANC : NOIR;
			i++;
		}
	}

	return state;
}

void detruire_tutoriel(struct state* state)
{
	struct tutorieldata* tuto = state->data;
	detruire_label(tuto->titre);
	detruire_bouton(tuto->bouton_suivant);
	detruire_bouton(tuto->bouton_precedent);
	for (int e = 0; e < NB_ETATS; e++) {
		detruire_label(tuto->titres[e]);
		for (int i = 0; i < tuto->nb_labels[e]; i++) {
			detruire_label(tuto->labels[e][i]);
		}
		gosh_free(tuto->labels[e]);
		detruire_plateau(tuto->plateaux[e]);
	}
	gosh_free(tuto);
	gosh_free(state);
}

static void afficher_tutoriel(struct state* state, SDL_Surface* surface)
{
	struct tutorieldata* tuto = state->data;
	Plateau plateau = tuto->plateaux[tuto->etat];
	int taille = plateau_get_taille(plateau);

	int x1 = W * .05;
	int y1 = H * .25;
	int w = MAX(W * .5 - x1, H * .5 - y1);
	w -= w % (taille);
	int pixel_par_case = w / (taille);
	int interbordure = 2;
	int bordure = (w - pixel_par_case * (taille - 1)) / 2;

	// bois
	set_color(240, 174, 95);
	draw_rect(surface, x1, y1, w, w);

	// dessin des interbordures
	set_color(30, 30, 30);
	for (int x = 0; x < taille; x++) {
		draw_rect(surface,
		          x1 + bordure + x * pixel_par_case - interbordure / 2,
		          y1 + bordure,
		          interbordure, pixel_par_case * (taille - 1));
	}
	for (int y = 0; y < taille; y++) {
		draw_rect(surface,
		          x1 + bordure,
		          y1 + bordure + y * pixel_par_case - interbordure / 2,
		          pixel_par_case * (taille - 1), interbordure);
	}

	int taille_stone = taille == 9 ? 30 : taille == 13 ? 24 : 16;
	for (int x = 0; x < taille; x++) {
		for (int y = 0; y < taille; y++) {
			Couleur c = plateau_get(plateau, x, y);
			bool draw = false;
			if (c != VIDE) {
				if (c == BLANC) {
					set_color(210, 210, 210);
				} else {
					set_color(40, 40, 40);
				}
				draw = true;
			}
			int marge = (taille == 9 ? 2 : 3);
			if (draw) {
				// affichage de la pierre
				int sx, sy;
				get_position_vers_ecran(taille, x, y, &sx, &sy, x1, y1, w);
				sx -= taille_stone / 2;
				sy -= taille_stone / 2;
				draw_rect(surface, sx, sy, taille_stone, taille_stone);
			} else if ((get_marge(x, taille) == marge || x == taille / 2)
					&& (get_marge(y, taille) == marge || y == taille / 2)) {
				// affichage du hoshi
				int sx, sy;
				get_position_vers_ecran(taille, x, y, &sx, &sy, x1, y1, w);
				set_color(0, 0, 0);
				draw_rect(surface, sx - 3, sy - 3, 6, 6);
			}

		}
	}

	afficher_label(surface, tuto->titres[tuto->etat]);
	for (int i = 0; i < tuto->nb_labels[tuto->etat]; i++) {
		afficher_label(surface, tuto->labels[tuto->etat][i]);
	}

	afficher_label(surface, tuto->titre);
	afficher_bouton(surface, tuto->bouton_suivant);
	afficher_bouton(surface, tuto->bouton_precedent);
}

static void mise_a_jour_tutoriel(struct state* state, double dt)
{
	struct tutorieldata* tuto = state->data;
	mise_a_jour_bouton(tuto->bouton_suivant, dt);
	mise_a_jour_bouton(tuto->bouton_precedent, dt);
}

static void tutoriel_precedent(struct state* state)
{
	struct tutorieldata* tuto = state->data;
	if (tuto->etat > 0) {
		tuto->etat -= 1;
	}
}

static void tutoriel_suivant(struct state* state)
{
	struct tutorieldata* tuto = state->data;
	if (tuto->etat < NB_ETATS - 1) {
		tuto->etat += 1;
	} else {
		set_state(tuto->parent);
		detruire_tutoriel(state);
	}
}

static void event_tutoriel(struct state* state, SDL_Event event)
{
	struct tutorieldata* tuto = state->data;
	if (event.type == SDL_KEYDOWN) {
		if (event.key.keysym.sym == SDLK_LEFT) {
			tutoriel_precedent(state);
		} else if (event.key.keysym.sym == SDLK_RIGHT) {
			tutoriel_suivant(state);
			return;
		}
	}

	utiliser_event_bouton(tuto->bouton_precedent, event);
	utiliser_event_bouton(tuto->bouton_suivant, event);
}

static void tutoriel_bouton_precedent(struct bouton* bouton, void * data)
{
	(void) bouton;
	tutoriel_precedent(data);
}

static void tutoriel_bouton_suivant(struct bouton* bouton, void * data)
{
	(void) bouton;
	tutoriel_suivant(data);
}


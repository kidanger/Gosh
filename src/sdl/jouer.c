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

/** @file jouer.c
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup sdl
 *  @brief ???
 */

#include <stdlib.h>
#include <stdbool.h>

#include <SDL/SDL.h>

#include "gosh_alloc.h"
#include "go/partie.h"
#include "go/plateau.h"
#include "go/libertes.h"
#include "go/sauvegarde.h"
#include "sdl/state.h"
#include "sdl/main.h"
#include "sdl/label.h"
#include "sdl/bouton.h"
#include "sdl/textinput.h"
#include "sdl/tools.h"
#include "sdl/jouer.h"

/** @ingroup sdl
 *  @brief ??
 */
struct jouerdata {
	/** @brief ?? */
	struct state* parent;
	/** @brief Partie courante */
	Partie partie;
	/** @brief ?? */
	int taille;

	/** @brief ??? */
	struct label* au_tour_de[2];
	/** @brief Affiche le handicap de la partie */
	struct label* handicap;
	/** @brief Affiche ??? */
	struct label* partie_finie;
	/** @brief Affiche le score */
	struct label* score;
	/** @brief Bouton permettant au joueur de passer son tour */
	struct bouton* passer_son_tour;
	/** @brief Bouton permettant de retourner au menu */
	struct bouton* retour_menu;
	/** @brief Zone de texte permettant de renseigner le nom de la partie */
	struct textinput* nom_partie;
	/** @brief Bouton permettant de sauvegarder la partie courrante */
	struct bouton* sauvegarder;
	/** @brief ?? */
	Position hovered;
};

/** @ingroup sdl
 *  @brief Dessiner le ??? sur une texture
 *  @param ???
 *  @param Texture sur laquelle dessiner le ??
 */
static void afficher_jouer(struct state*, SDL_Surface*);

/** @ingroup sdl
 *  @brief Met à jour ??
 *  @param ??
 *  @param ??
 */
static void mise_a_jour_jouer(struct state*, double);

/** @ingroup sdl
 *  @brief ??
 *  @param
 *  @param événement SDL
 */
static void event_jouer(struct state*, SDL_Event);

/** @ingroup sdl
 *  @brief ??
 *  @brief ??
 */
static void jouer_bouton_retour(struct bouton*, void * data);

/** @ingroup sdl
 *  @brief ??
 *  @brief ??
 */
static void jouer_bouton_passer(struct bouton*, void * data);

/** @ingroup sdl
 *  @brief ??
 *  @brief ??
 */
static void jouer_bouton_sauvegarder(struct bouton*, void * data);

struct state* creer_jouer(struct state* parent, Partie partie)
{
	struct state* state = gosh_alloc(*state);
	state->afficher = afficher_jouer;
	struct jouerdata* jouer = gosh_alloc(*jouer);
	jouer->parent = parent;
	jouer->partie = partie;
	jouer->taille = plateau_get_taille(partie->plateau);
	state->data = jouer;
	state->mise_a_jour = mise_a_jour_jouer;
	state->mousemotion = event_jouer;
	state->mousebuttondown = event_jouer;
	state->mousebuttonup = event_jouer;
	state->keydown = event_jouer;

	char buf[TAILLE_NOM_JOUEUR + 64];

	set_color(230, 200, 150);
	snprintf(buf, sizeof(buf), "Au tour de %s", partie->joueurs[JOUEUR_NOIR].nom);
	jouer->au_tour_de[JOUEUR_NOIR] = creer_label(buf, W / 2, H * .1, CENTER_XY, BIG);
	snprintf(buf, sizeof(buf), "Au tour de %s", partie->joueurs[JOUEUR_BLANC].nom);
	jouer->au_tour_de[JOUEUR_BLANC] = creer_label(buf, W / 2, H * .1, CENTER_XY, BIG);
	jouer->handicap = creer_label("Pierre de handicap", W / 2, H * .1, CENTER_XY, BIG);
	jouer->partie_finie = creer_label("Partie terminée !", W / 2, H * .1, CENTER_XY, BIG);

	set_color(155, 50, 50);
	struct bouton* bouton = creer_bouton("Retour menu", 10, H * .81, 140, 30);
	bouton->callback = jouer_bouton_retour;
	bouton->userdata = state;
	jouer->retour_menu = bouton;

	set_color(255, 255, 255);
	bouton = creer_bouton("Passer son tour", W * .75, H * .15, 150, 30);
	bouton->callback = jouer_bouton_passer;
	bouton->userdata = state;
	jouer->passer_son_tour = bouton;

	set_color(255, 255, 255);
	bouton = creer_bouton("Sauvegarder", W * .75, H * .93, 150, 30);
	bouton->callback = jouer_bouton_sauvegarder;
	bouton->userdata = state;
	bouton->visible = false;
	jouer->sauvegarder = bouton;

	set_color(150, 150, 150);
	jouer->nom_partie = creer_textinput(W * 0.5, H * .94, 180, 20, 16);

	jouer->hovered = POSITION_INVALIDE;

	return state;
}

void detruire_jouer(struct state* state)
{
	struct jouerdata* jouer = state->data;
	detruire_label(jouer->au_tour_de[0]);
	detruire_label(jouer->au_tour_de[1]);
	detruire_label(jouer->handicap);
	detruire_label(jouer->partie_finie);
	if (jouer->score)
		detruire_label(jouer->score);
	detruire_bouton(jouer->retour_menu);
	detruire_textinput(jouer->nom_partie);
	detruire_bouton(jouer->sauvegarder);

	gosh_free(jouer);
	gosh_free(state);
}

static void mise_a_jour_jouer(struct state* state, double dt)
{
	(void) dt;
	struct jouerdata* jouer = state->data;
	Partie partie = jouer->partie;
	if (!partie->finie) {
		if (partie->joueurs[partie->joueur_courant].type == ORDINATEUR) {
			partie_jouer_ordinateur(partie);
		}
	}
	if (partie->finie) {
		if (jouer->score == NULL) {
			float scores[2];
			partie_score_joueurs(partie, scores, VALEUR_KOMI_FRANCE);
			enum CouleurJoueur gagnant = scores[JOUEUR_NOIR] > scores[JOUEUR_BLANC] ? JOUEUR_NOIR : JOUEUR_BLANC;

			char buffer[256] = {0};
			snprintf(buffer, sizeof(buffer), "Gagnant : %s (%s) %.1f - %.1f",
			         partie->joueurs[gagnant].nom,
			         gagnant == JOUEUR_NOIR ? "noir" : "blanc",
			         scores[JOUEUR_NOIR], scores[JOUEUR_BLANC]);
			set_color(200, 200, 200);
			jouer->score = creer_label(buffer, W * .3, H * .95, CENTER_XY, NORMAL);

			set_color(100, 200, 100);
			jouer->retour_menu->couleur = get_color();

			jouer->passer_son_tour->visible = false;
		}
	}

	// mise à jour du bouton passer
	enum CouleurJoueur j = partie->joueur_courant;
	if (j == JOUEUR_NOIR)
		set_color(100, 100, 100);
	else
		set_color(200, 200, 200);
	jouer->passer_son_tour->couleur = get_color();

	mise_a_jour_bouton(jouer->passer_son_tour, dt);
	mise_a_jour_bouton(jouer->retour_menu, dt);
	mise_a_jour_bouton(jouer->sauvegarder, dt);
	mise_a_jour_textinput(jouer->nom_partie, dt);
}

Position get_position_depuis_ecran(struct jouerdata* jouer, int x, int y)
{
	Position pos;
	int x1 = W * .2;
	int y1 = H * .2;
	if (x < x1 || y < y1) {
		return POSITION_INVALIDE;
	}
	int w = MAX(W * .8 - x1, H * .8 - y1);
	w -= w % jouer->taille;
	int pixel_par_case = w / jouer->taille;
	int bordure = (w - pixel_par_case * (jouer->taille - 1)) / 2;
	pos = position((x - x1 - bordure + pixel_par_case / 2) / pixel_par_case,
	               (y - y1 - bordure + pixel_par_case / 2) / pixel_par_case,
	               jouer->taille);
	return pos;
}
void get_position_vers_ecran(struct jouerdata* jouer, int x, int y, int* sx, int* sy)
{
	int x1 = W * .2;
	int y1 = H * .2;
	int w = MAX(W * .8 - x1, H * .8 - y1);
	w -= w % jouer->taille;
	int pixel_par_case = w / jouer->taille;
	int bordure = (w - pixel_par_case * (jouer->taille - 1)) / 2;
	*sx = x1 + bordure + x * pixel_par_case;
	*sy = y1 + bordure + y * pixel_par_case;
}

static void afficher_jouer(struct state* state, SDL_Surface* surface)
{
	struct jouerdata* jouer = state->data;
	Partie partie = jouer->partie;
	int taille = jouer->taille;

	int x1 = W * .2;
	int y1 = H * .2;
	int w = MAX(W * .8 - x1, H * .8 - y1);
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
	int taille_stone2 = taille_stone / 4;
	Position hov = jouer->hovered;
	Chaine chaine = position_est_valide(hov) ?
	                plateau_determiner_chaine(partie->plateau, hov) : NULL;
	Libertes libertes = chaine ? determiner_libertes(partie->plateau, chaine) : NULL;
	EnsemblePosition yeux = chaine ? lesYeuxDeLaChaine(chaine, partie->plateau) : NULL;
	for (int x = 0; x < taille; x++) {
		for (int y = 0; y < taille; y++) {
			Position pos = position(x, y, taille);
			Couleur c = plateau_get(partie->plateau, x, y);
			bool draw = false;
			if (c != VIDE) {
				if (c == BLANC) {
					set_color(210, 210, 210);
				} else {
					set_color(40, 40, 40);
				}
				draw = true;
			} else if (position_est_valide(hov) && hov.x == x && hov.y == y) {
				if (partie->joueur_courant == JOUEUR_BLANC) {
					set_color(240, 240, 240);
				} else {
					set_color(20, 20, 20);
				}
				draw = true;
			}
			if (draw) {
				int sx, sy;
				get_position_vers_ecran(jouer, x, y, &sx, &sy);
				sx -= taille_stone / 2;
				sy -= taille_stone / 2;
				draw_rect(surface, sx, sy, taille_stone, taille_stone);
			}
			draw = false;
			if (chaine && gosh_appartient(chaine, pos)) {
				set_color(120, 120, 120);
				draw = true;
			} else if (yeux && gosh_appartient(yeux, pos)) {
				set_color(255, 130, 130);
				draw = true;
			} else if (libertes && gosh_appartient(libertes, pos)) {
				set_color(200, 40, 40);
				draw = true;
			}
			if (draw) {
				int sx, sy;
				get_position_vers_ecran(jouer, x, y, &sx, &sy);
				sx -= taille_stone2 / 2;
				sy -= taille_stone2 / 2;
				draw_rect(surface, sx, sy, taille_stone2, taille_stone2);
			}
		}
	}
	if (chaine)
		detruire_chaine(chaine);
	if (libertes)
		detruire_libertes(libertes);
	if (yeux)
		detruire_ensemble_position(yeux);

	if (!partie->finie) {
		if (partie_en_cours_de_handicap(partie)) {
			afficher_label(surface, jouer->handicap);
		} else {
			afficher_label(surface, jouer->au_tour_de[partie->joueur_courant]);
		}
	} else {
		afficher_label(surface, jouer->partie_finie);
		afficher_label(surface, jouer->score);
	}
	afficher_bouton(surface, jouer->retour_menu);
	afficher_bouton(surface, jouer->passer_son_tour);
	afficher_textinput(surface, jouer->nom_partie);
	afficher_bouton(surface, jouer->sauvegarder);
}

static void afficher_sauvegarder(struct jouerdata* jouer)
{
	jouer->sauvegarder->visible = jouer->nom_partie->buffer[0] != 0;
}

static void event_jouer(struct state* state, SDL_Event event)
{
	struct jouerdata* jouer = state->data;
	utiliser_event_bouton(jouer->retour_menu, event);
	utiliser_event_bouton(jouer->passer_son_tour, event);
	utiliser_event_bouton(jouer->sauvegarder, event);
	utiliser_event_textinput(jouer->nom_partie, event);
	if (jouer->nom_partie->active) {
		afficher_sauvegarder(jouer);
		return; // ne pas interférer entre la saisie et les raccourcis claviers
	}
	if (event.type == SDL_MOUSEMOTION) {
		jouer->hovered = get_position_depuis_ecran(jouer, event.motion.x, event.motion.y);
	} else if (event.type == SDL_MOUSEBUTTONUP) {
		int b = event.button.button;
		if (b == 1) {
			Position pos = get_position_depuis_ecran(jouer, event.motion.x, event.motion.y);
			if (position_est_valide(pos)) {
				s_Coup coup = {pos};
				partie_jouer_coup(jouer->partie, coup);
				afficher_sauvegarder(jouer);
			}
		} else if (b == 2) {
			s_Coup coup;
			coup.position = POSITION_INVALIDE;
			partie_jouer_coup(jouer->partie, coup);
			afficher_sauvegarder(jouer);
		} else if (b == 4) {
			partie_annuler_coup(jouer->partie);
			afficher_sauvegarder(jouer);
		} else if (b == 5) {
			partie_rejouer_coup(jouer->partie);
			afficher_sauvegarder(jouer);
		}
	} else if (event.type == SDL_KEYDOWN) {
		if (event.key.keysym.sym == SDLK_p) {
			s_Coup coup = {POSITION_INVALIDE};
			partie_jouer_coup(jouer->partie, coup);
			afficher_sauvegarder(jouer);
		} else if (event.key.keysym.sym == SDLK_a) {
			partie_annuler_coup(jouer->partie);
			afficher_sauvegarder(jouer);
		} else if (event.key.keysym.sym == SDLK_r) {
			partie_rejouer_coup(jouer->partie);
			afficher_sauvegarder(jouer);
		}
	}
}

static void jouer_bouton_retour(struct bouton* bouton, void * data)
{
	(void) bouton;
	struct state* state = data;
	struct jouerdata* jouer = state->data;
	detruire_partie(jouer->partie);
	set_state(jouer->parent);
	detruire_jouer(state);
}

static void jouer_bouton_passer(struct bouton* bouton, void * data)
{
	(void) bouton;
	struct state* state = data;
	struct jouerdata* jouer = state->data;
	s_Coup coup;
	coup.position = POSITION_INVALIDE;
	partie_jouer_coup(jouer->partie, coup);
}

static void jouer_bouton_sauvegarder(struct bouton* bouton, void * data)
{
	(void) bouton;
	struct state* state = data;
	struct jouerdata* jouer = state->data;
	if (sauvegarder_partie_fichier(jouer->nom_partie->buffer, jouer->partie)) {
		jouer->sauvegarder->visible = false;
	} else {
		perror("sauvegarder");
	}
}


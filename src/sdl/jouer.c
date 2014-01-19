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
#include <stdlib.h>
#include <stdbool.h>

#include <SDL/SDL.h>

#include "gosh_alloc.h"
#include "go/partie.h"
#include "go/plateau.h"
#include "sdl/state.h"
#include "sdl/label.h"
#include "sdl/tools.h"
#include "sdl/jouer.h"

struct jouerdata {
	struct state* parent;
	Partie partie;
	int taille;

	struct label* au_tour_de[2];
	struct bouton* passer_son_tour;
	Position hovered;
};

static void afficher_jouer(struct state*, SDL_Surface*);
static void mousemotion_jouer(struct state*, SDL_Event);

struct state* creer_jouer(struct state* parent, Partie partie)
{
	struct state* state = gosh_alloc(*state);
	state->afficher = afficher_jouer;
	struct jouerdata* jouer = gosh_alloc(*jouer);
	jouer->parent = parent;
	jouer->partie = partie;
	jouer->taille = plateau_get_taille(partie->plateau);
	state->data = jouer;
	state->mousemotion = mousemotion_jouer;

	char buf[TAILLE_NOM_JOUEUR + 12];
	snprintf(buf, sizeof(buf), "Au tour de %s", partie->joueurs[JOUEUR_NOIR].nom);
	jouer->au_tour_de[JOUEUR_NOIR] = creer_label(buf, W / 2, H * .1, CENTER_XY, BIG);
	snprintf(buf, sizeof(buf), "Au tour de %s", partie->joueurs[JOUEUR_BLANC].nom);
	jouer->au_tour_de[JOUEUR_BLANC] = creer_label(buf, W / 2, H * .1, CENTER_XY, BIG);
	jouer->hovered = POSITION_INVALIDE;

	return state;
}

void detruire_jouer(struct state* state)
{
	struct jouerdata* jouer = state->data;
	detruire_label(jouer->au_tour_de[0]);
	detruire_label(jouer->au_tour_de[1]);

	gosh_free(jouer);
	gosh_free(state);
}

Position get_position_depuis_ecran(struct jouerdata* jouer, int x, int y)
{
	Position pos;
	int x1 = W * .2;
	int y1 = H * .2;
	int w = MAX(W*.8 - x1, H*.8 - y1);
	w -= w % jouer->taille;
	int pixel_par_case = w / jouer->taille;
	int bordure = (w - pixel_par_case * (jouer->taille - 1)) / 2;
	pos = position((x - x1 - bordure) / pixel_par_case,
					(y - y1 - bordure) / pixel_par_case,
					jouer->taille);
	return pos;
}
void get_position_vers_ecran(struct jouerdata* jouer, Position pos, int* x, int* y)
{
	int x1 = W * .2;
	int y1 = H * .2;
	int w = MAX(W*.8 - x1, H*.8 - y1);
	w -= w % jouer->taille;
	int pixel_par_case = w / jouer->taille;
	int bordure = (w - pixel_par_case * (jouer->taille - 1)) / 2;
	*x = x1 + bordure + pos.x * pixel_par_case;
	*y = y1 + bordure + pos.y * pixel_par_case;
}

static void afficher_jouer(struct state* state, SDL_Surface* surface)
{
	struct jouerdata* jouer = state->data;
	Partie partie = jouer->partie;
	int taille = jouer->taille;

	afficher_label(surface, jouer->au_tour_de[partie->joueur_courant]);

	int x1 = W * .2;
	int y1 = H * .2;
	int w = MAX(W*.8 - x1, H*.8 - y1);
	w -= w % (taille );
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

	Position hov = jouer->hovered;
	for (int x = 0; x < taille; x++) {
		for (int y = 0; y < taille; y++) {
			if (position_est_valide(hov) && hov.x == x && hov.y == y) {
				set_color(255, 30, 30);
				int x, y;
				get_position_vers_ecran(jouer, hov, &x, &y);
				draw_rect(surface, x - 10, y - 10, 20, 20);
			}
		}
	}
}

static void mousemotion_jouer(struct state* state, SDL_Event event)
{
	struct jouerdata* jouer = state->data;
	if (event.type == SDL_MOUSEMOTION) {
		jouer->hovered = get_position_depuis_ecran(jouer, event.motion.x, event.motion.y);
	}
}


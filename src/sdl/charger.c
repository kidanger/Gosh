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
#include "sdl/state.h"
#include "sdl/tools.h"
#include "sdl/bouton.h"
#include "sdl/label.h"
#include "sdl/main.h"
#include "sdl/charger.h"

#define NUM_BOUTONS 1
struct chargerdata {
	struct state* parent;
	struct label* titre;
	struct label* choix;
	struct bouton* boutons[NUM_BOUTONS];
};

static void afficher_charger(struct state*, SDL_Surface*);
static void event_charger(struct state* state, SDL_Event event);
static void charger_bouton_retour(struct bouton*, void * data);

struct state* creer_charger(struct state* parent)
{
	struct state* state = gosh_alloc(*state);
	struct chargerdata* charger = gosh_alloc(*charger);
	state->data = charger;
	state->quitter = false;
	state->afficher = afficher_charger;
	state->mousemotion = event_charger;
	state->mousebuttondown = event_charger;
	state->mousebuttonup = event_charger;
	charger->parent = parent;

	set_color(50, 50, 150);
	charger->titre = creer_label("Charger", W / 2, H * .1, CENTER_XY, BIG);
	set_color(200, 200, 200);
	charger->choix = creer_label("Choix de la partie :", (W - W * .7) / 2 + 10, H * .22, LEFT, NORMAL);

	set_color(155, 50, 50);
	struct bouton* bouton = creer_bouton("Retour", W * .1, H * .9, 100, 30);
	bouton->callback = charger_bouton_retour;
	bouton->userdata = state;
	charger->boutons[0] = bouton;

	return state;
}

void detruire_charger(struct state* state)
{
	struct chargerdata* charger = state->data;
	detruire_label(charger->titre);
	detruire_label(charger->choix);
	for (int i = 0; i < NUM_BOUTONS; i++) {
		struct bouton* b = charger->boutons[i];
		detruire_bouton(b);
	}
	gosh_free(state->data);
	gosh_free(state);
}

static void afficher_charger(struct state* state, SDL_Surface* surface)
{
	struct chargerdata* charger = state->data;
	set_color(50, 50, 50);
	draw_rect(surface, (W - W * .7) / 2, H * .2, W * .7, H * .6);
	afficher_label(surface, charger->titre);
	afficher_label(surface, charger->choix);
	for (int i = 0; i < NUM_BOUTONS; i++) {
		struct bouton* b = charger->boutons[i];
		afficher_bouton(surface, b);
	}
}

static void event_charger(struct state* state, SDL_Event event)
{
	struct chargerdata* charger = state->data;
	for (int i = 0; i < NUM_BOUTONS; i++) {
		struct bouton* b = charger->boutons[i];
		utiliser_event_bouton(b, event);
	}
}

static void charger_bouton_retour(struct bouton* bouton, void * data)
{
	(void) bouton;
	struct state* state = data;
	struct chargerdata* charger = state->data;
	set_state(charger->parent);
	detruire_charger(state);
}


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
#include "sdl/menu.h"

/*
						Gosh





								[Jouer]

	[Quitter]						[Charger]
*/

#define NUM_BOUTONS 2
struct menudata {
	SDL_Surface* titre;
	struct bouton* boutons[NUM_BOUTONS];
};

static void afficher_menu(struct state*, SDL_Surface*);
static void event_menu(struct state*, SDL_Event);
static void menu_bouton_quitter(void *);

struct state* creer_menu()
{
	struct state* state = gosh_alloc(*state);
	struct menudata* menu = gosh_alloc(*menu);
	state->data = menu;
	state->quitter = false;
	state->afficher = afficher_menu;
	state->mousemotion = event_menu;
	state->mousebuttondown = event_menu;

	set_color(200, 50, 50);
	menu->titre = text_surface("Gosh", BIG);

	set_color(255, 10, 10);
	struct bouton* bouton = creer_bouton("Quitter", W*.1, H*.8, 100, 30);
	bouton->callback = menu_bouton_quitter;
	bouton->userdata = state;
	menu->boutons[0] = bouton;

	set_color(10, 200, 10);
	bouton = creer_bouton("Valider", W*.7, H*.8, 100, 30);
	bouton->callback = menu_bouton_quitter;
	bouton->userdata = state;
	menu->boutons[1] = bouton;
	return state;
}

void detruire_menu(struct state* state)
{
	struct menudata* menu = state->data;
	SDL_FreeSurface(menu->titre);
	for (int i = 0; i < NUM_BOUTONS; i++) {
		struct bouton* b = menu->boutons[i];
		detruire_bouton(b);
	}
	gosh_free(state->data);
	gosh_free(state);
}

void afficher_menu(struct state* state, SDL_Surface* surface)
{
	struct menudata* menu = state->data;
	draw_surface(surface, menu->titre, W/2, H*.1, CENTER);
	for (int i = 0; i < NUM_BOUTONS; i++) {
		struct bouton* b = menu->boutons[i];
		afficher_bouton(surface, b);
	}
}

static void event_menu(struct state* state, SDL_Event event)
{
	struct menudata* menu = state->data;
	for (int i = 0; i < NUM_BOUTONS; i++) {
		struct bouton* b = menu->boutons[i];
		if (utiliser_event_bouton(b, event)) {
			break;
		}
	}
}

static void menu_bouton_quitter(void * data)
{
	struct state* state = (struct state*) data;
	state->quitter = true;
}

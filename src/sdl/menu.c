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
#include "sdl/menu.h"

/*
					Gosh

	Type joueur 1: o humain  o ordinateur
		Nom: [|    ]
	(si ordi): Programme: o aléatoire  o gnugo

	Type joueur 2: o humain  o ordinateur
		Nom: [|    ]
	(si ordi): Programme: o aléatoire  o gnugo

	Taille: o 9  o 13  o 19

						[Jouer]

	[Quitter]						[Charger]
*/

#define NUM_BOUTONS 3
#define NUM_LABELS 7
struct menudata {
	struct label* titre;
	struct label* labels[NUM_LABELS];
	struct bouton* boutons[NUM_BOUTONS];
};

static void afficher_menu(struct state*, SDL_Surface*);
static void event_menu(struct state*, SDL_Event);
static void mise_a_jour_menu(struct state *);
static void menu_bouton_quitter(void *);
static void menu_bouton_jouer(void *);
static void menu_bouton_charger(void *);

struct state* creer_menu()
{
	struct state* state = gosh_alloc(*state);
	struct menudata* menu = gosh_alloc(*menu);
	state->data = menu;
	state->quitter = false;
	state->afficher = afficher_menu;
	state->mousemotion = event_menu;
	state->mousebuttondown = event_menu;
	state->mousebuttonup = event_menu;
	state->mise_a_jour = mise_a_jour_menu;

	set_color(200, 50, 50);
	menu->titre = creer_label("Gosh", W/2, H*.1, CENTER_XY, BIG);

	set_color(255, 10, 10);
	struct bouton* bouton = creer_bouton("Quitter", W*.1, H*.9, 100, 30);
	bouton->callback = menu_bouton_quitter;
	bouton->userdata = state;
	menu->boutons[0] = bouton;

	set_color(10, 200, 10);
	bouton = creer_bouton("Jouer", W*.6, H*.7, 100, 30);
	bouton->callback = menu_bouton_jouer;
	bouton->userdata = state;
	menu->boutons[1] = bouton;

	set_color(50, 50, 200);
	bouton = creer_bouton("Charger", W*.7, H*.9, 100, 30);
	bouton->callback = menu_bouton_charger;
	bouton->userdata = state;
	menu->boutons[2] = bouton;

	int x = (W-W*.7)/2 + 20;
	int y = H * .2;
	menu->labels[0] = creer_label("Joueur noir :", x, y, LEFT, NORMAL);
	y += 20;
	menu->labels[1] = creer_label("Nom :", x + 50, y, LEFT, NORMAL);
	y += 20;
	menu->labels[2] = creer_label("Programme :", x, y, LEFT, NORMAL);
	menu->labels[2]->visible = false;
	y += 20;
	menu->labels[3] = creer_label("Joueur blanc :", x, y, LEFT, NORMAL);
	y += 20;
	menu->labels[4] = creer_label("Nom :", x + 50, y, LEFT, NORMAL);
	y += 20;
	menu->labels[5] = creer_label("Programme :", x, y, LEFT, NORMAL);
	menu->labels[5]->visible = false;
	y += 20;
	menu->labels[6] = creer_label("Taille :", x, y, LEFT, NORMAL);
	return state;
}

void detruire_menu(struct state* state)
{
	struct menudata* menu = state->data;
	detruire_label(menu->titre);
	for (int i = 0; i < NUM_LABELS; i++) {
		struct label* l = menu->labels[i];
		detruire_label(l);
	}
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
	afficher_label(surface, menu->titre);
	set_color(50, 50, 50);
	draw_rect(surface, (W-W*.7)/2, H*.2, W*.7, H*.6);
	for (int i = 0; i < NUM_LABELS; i++) {
		struct label* l = menu->labels[i];
		afficher_label(surface, l);
	}
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

static void mise_a_jour_menu(struct state* state)
{
	struct menudata* menu = state->data;
	(void) menu;
}

static void menu_bouton_quitter(void * data)
{
	struct state* state = data;
	state->quitter = true;
}

static void menu_bouton_jouer(void * data)
{
	struct state* state = data;
	(void) state; // TODO
}

static void menu_bouton_charger(void * data)
{
	struct state* state = data;
	struct state* new_state = creer_charger(state);
	set_state(new_state);
}


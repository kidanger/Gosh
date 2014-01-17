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
#include "sdl/tools.h"

struct jouerdata {
	struct state* parent;
	Partie partie;
	struct label* titre;
};

static void afficher_jouer(struct state*, SDL_Surface*);

struct state* creer_jouer(struct state* parent, Partie partie)
{
	struct state* state = gosh_alloc(*state);
	state->afficher = afficher_jouer;
	struct jouerdata* jouer = gosh_alloc(*jouer);
	jouer->parent = parent;
	jouer->partie = partie;
	state->data = jouer;
	printf("%d %s\n", partie->joueurs[JOUEUR_NOIR].type, partie->joueurs[JOUEUR_NOIR].nom);
	printf("%d %s\n", partie->joueurs[JOUEUR_BLANC].type, partie->joueurs[JOUEUR_BLANC].nom);
	printf("%d\n", plateau_get_taille(partie->plateau));
	return state;
}

static void afficher_jouer(struct state* state, SDL_Surface* surface)
{
	(void) state;
	set_color(50, 50, 50);
	draw_rect(surface, (W-W*.7)/2, H*.2, W*.7, H*.6);
}


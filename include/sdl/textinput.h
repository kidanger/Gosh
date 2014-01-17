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
#ifndef GOSH_SDL_TEXTINPUT
#define GOSH_SDL_TEXTINPUT

#include <stdbool.h>
#include <SDL/SDL.h>

struct textinput {
	SDL_Surface* surface;

	int taillemax;
	int curseur;
	char* buffer;

	int x, y;
	int w, h;
	SDL_Color couleur;

	bool hover;
	bool active;
	double time;
};

struct textinput* creer_textinput(int x, int y, int w, int h, int taillemax);
void afficher_textinput(SDL_Surface* on, struct textinput*);
void mise_a_jour_textinput(struct textinput*, double);
void utiliser_event_textinput(struct textinput*, SDL_Event);
void detruire_textinput(struct textinput*);

#endif


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
#ifndef GOSH_SDL_BOUTON
#define GOSH_SDL_BOUTON

#include <stdbool.h>
#include <SDL/SDL.h>

struct bouton {
	SDL_Surface* surface;
	float x, y;
	float ox, oy;
	int w, h;
	SDL_Color couleur;
	float deplacement_auto_timer;
	bool visible;

	void(*callback)(struct bouton*, void*);
	void* userdata;
	bool hover;
	bool en_deplacement;
};
struct bouton* creer_bouton(const char* text, int x, int y, int w, int h);
void afficher_bouton(SDL_Surface* on, struct bouton*);
void mise_a_jour_bouton(struct bouton*, double);
void utiliser_event_bouton(struct bouton*, SDL_Event);
void detruire_bouton(struct bouton*);

#endif


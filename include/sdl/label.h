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
#ifndef GOSH_SDL_LABEL
#define GOSH_SDL_LABEL

#include <stdbool.h>
#include <SDL/SDL.h>

#include "sdl/tools.h"

struct label {
	SDL_Surface* surface;
	int x, y;
	int w, h;
	enum Align align;
	SDL_Color couleur;
	bool visible;
};

struct label* creer_label(const char* text, int x, int y, enum Align align, enum FontSize size);
void afficher_label(SDL_Surface* on, struct label*);
void detruire_label(struct label*);

#endif



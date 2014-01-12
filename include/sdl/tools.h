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
#ifndef GOSH_SDL_TOOLS
#define GOSH_SDL_TOOLS

#include <stdbool.h>
#include <stdio.h>

#include <SDL/SDL.h>

#define W 800
#define H 680

#define COLOR(r, g, b) ((SDL_Color){(r), (g), (b), 0})

void draw_rect(SDL_Surface*, int x, int y, int w, int h);
void set_color(int r, int g, int b);

enum FontSize {
	SMALL = 0,
	NORMAL,
	BIG,
	NUM_FONTS
};
SDL_Surface* text_surface(const char*, enum FontSize taille);

// alignement
enum Align {
	LEFT = 0,
	CENTER,
	RIGHT
};
void draw_surface(SDL_Surface* on, SDL_Surface* from, int x, int y, enum Align align);

struct bouton {
	SDL_Surface* surface;
	int x, y;
	int w, h;
	SDL_Color couleur;
	bool hover;
	void(*callback)(void*);
	void* userdata;
};
struct bouton* creer_bouton(const char* text, int x, int y, int w, int h);
void afficher_bouton(SDL_Surface* on, struct bouton*);
bool utiliser_event_bouton(struct bouton*, SDL_Event);
void detruire_bouton(struct bouton*);


#define SDL_CHECK(cond) \
	do { \
		if (!(cond)) { \
			perror(SDL_GetError()); \
			exit(EXIT_FAILURE); \
		} \
	} while (0)

#define TTF_CHECK(cond) \
	do { \
		if (!(cond)) { \
			perror(TTF_GetError()); \
			exit(EXIT_FAILURE); \
		} \
	} while (0)

#endif


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
#include <string.h>
#include <ctype.h>

#include "gosh_alloc.h"
#include "sdl/tools.h"
#include "sdl/textinput.h"

struct textinput* creer_textinput(int x, int y, int w, int h, int taillemax)
{
	struct textinput* textinput = gosh_alloc(*textinput);
	textinput->surface = NULL;
	textinput->x = x;
	textinput->y = y;
	textinput->w = w;
	textinput->h = h;
	textinput->taillemax = taillemax;
	textinput->buffer = gosh_allocn(char, taillemax);
	textinput->curseur = 0;
	textinput->time = 0;
	textinput->couleur = get_color();
	textinput->hover = false;
	textinput->active = false;
	return textinput;
}

void afficher_textinput(SDL_Surface* on, struct textinput* ti)
{
	if (ti->hover) {
		set_color(ti->couleur.r / 2, ti->couleur.g / 2, ti->couleur.b / 2);
	} else {
		set_color(MIN(255, ti->couleur.r * 2),
		          MIN(255, ti->couleur.g * 2),
		          MIN(255, ti->couleur.b * 2));
	}
	draw_rect(on, ti->x, ti->y, ti->w, ti->h);

	set_color(ti->couleur.r, ti->couleur.g, ti->couleur.b);
	int border = 2;
	draw_rect(on, ti->x + border, ti->y + border, ti->w - border * 2, ti->h - border * 2);

	if (ti->active) {
		float freq = .4; // clignotements par seconde
		bool blink = (int)(ti->time * 1000) / (int)(1000 / freq) % 2;
		if (blink) {
			set_color(20, 20, 20);
			int border = 2;
			int pitch = ti->curseur > 0 ? ti->surface->w / strlen(ti->buffer) + 1 : 0;
			draw_rect(on, ti->x + border + ti->curseur * pitch, ti->y + border, 20 / 4, ti->h - border * 2);
		}
	}
	if (ti->surface)
		draw_surface(on, ti->surface, ti->x + 1, ti->y, LEFT);
}

void mise_a_jour_textinput(struct textinput* ti, double dt)
{
	ti->time += dt;
}

static void refresh(struct textinput* ti)
{
	if (ti->surface) {
		SDL_FreeSurface(ti->surface);
		ti->surface = NULL;
	}
	if (ti->curseur > 0) {
		set_color(0, 0, 0);
		ti->surface = text_surface(ti->buffer, NORMAL);
	}
}

void utiliser_event_textinput(struct textinput* ti, SDL_Event event)
{
#define INSIDE(_x, _y) \
	(ti->x < (_x) && (_x) < ti->x + ti->w && \
	 ti->y < (_y) && (_y) < ti->y + ti->h)
	if (event.type == SDL_MOUSEMOTION) {
		if (INSIDE(event.motion.x, event.motion.y)) {
			ti->hover = true;
		} else {
			ti->hover = false;
		}
	} else if (event.type == SDL_MOUSEBUTTONDOWN) {
		if (INSIDE(event.button.x, event.button.y)) {
			if (event.button.button == 1) {
				ti->active = true;
			}
		} else {
			ti->active = false;
		}
	} else if (event.type == SDL_KEYDOWN && ti->active) {
		char c = event.key.keysym.sym;
		if (event.key.keysym.sym == SDLK_BACKSPACE) {
			if (ti->curseur > 0) {
				ti->buffer[--ti->curseur] = 0;
				refresh(ti);
			}
		} else if (isalpha(c)) {
			if (ti->curseur < ti->taillemax) {
				ti->buffer[ti->curseur++] = c;
				refresh(ti);
			}
		}
	}
#undef INSIDE
}

void detruire_textinput(struct textinput* ti)
{
	if (ti->surface) {
		SDL_FreeSurface(ti->surface);
	}
	gosh_free(ti->buffer);
	gosh_free(ti);
}


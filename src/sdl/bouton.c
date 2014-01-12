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
#include "gosh_alloc.h"
#include "sdl/tools.h"
#include "sdl/bouton.h"

struct bouton* creer_bouton(const char* text, int x, int y, int w, int h)
{
	struct bouton* bouton = gosh_alloc(*bouton);
	bouton->surface = text_surface(text, NORMAL);
	bouton->x = x;
	bouton->y = y;
	bouton->w = w;
	bouton->h = h;
	bouton->couleur = get_color();
	bouton->hover = false;
	return bouton;
}
void afficher_bouton(SDL_Surface* on, struct bouton* bouton)
{
	if (bouton->hover) {
		set_color(bouton->couleur.r / 2, bouton->couleur.g / 2, bouton->couleur.b / 2);
	} else {
		set_color(MIN(255, bouton->couleur.r * 2),
				MIN(255, bouton->couleur.g * 2),
				MIN(255, bouton->couleur.b * 2));
	}
	draw_rect(on, bouton->x, bouton->y, bouton->w, bouton->h);
	set_color(bouton->couleur.r / 3, bouton->couleur.g / 3, bouton->couleur.b / 3);
	draw_rect(on, bouton->x + 2, bouton->y + 2, bouton->w - 4, bouton->h - 4);
	draw_surface(on, bouton->surface, bouton->x + bouton->w / 2, bouton->y + bouton->h / 2, CENTER_XY);
}

bool utiliser_event_bouton(struct bouton* bouton, SDL_Event event)
{
#define INSIDE(_x, _y) \
		(bouton->x < (_x) && (_x) < bouton->x + bouton->w && \
				bouton->y < (_y) && (_y) < bouton->y + bouton->h)
	if (event.type == SDL_MOUSEMOTION) {
		if (INSIDE(event.motion.x, event.motion.y)) {
			bouton->hover = true;
		} else {
			bouton->hover = false;
		}
		if (bouton->en_deplacement) {
			bouton->x += event.motion.xrel;
			bouton->y += event.motion.yrel;
		}
	} else if (event.type == SDL_MOUSEBUTTONDOWN) {
		if (INSIDE(event.button.x, event.button.y)) {
			if (event.button.button == 1) {
				bouton->callback(bouton->userdata);
			} else if (event.button.button == 3) {
				bouton->en_deplacement = true;
			}
		}
	} else if (event.type == SDL_MOUSEBUTTONUP) {
		if (INSIDE(event.button.x, event.button.y)) {
			if (event.button.button == 3) {
				bouton->en_deplacement = false;
			}
		}
	}
	return false;
#undef INSIDE
}

void detruire_bouton(struct bouton* bouton)
{
	SDL_FreeSurface(bouton->surface);
	gosh_free(bouton);
}


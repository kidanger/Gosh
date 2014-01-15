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
#include "sdl/tools.h"
#include "sdl/radio.h"

struct groupe_radio* creer_groupe_radio(int nombre)
{
	struct groupe_radio* groupe = gosh_alloc(*groupe);
	groupe->nombre = nombre;
	groupe->radios = gosh_allocn(struct radio*, nombre);
	groupe->radio_courante = NULL;
	return groupe;
}

void afficher_groupe_radio(SDL_Surface* surface, struct groupe_radio* groupe)
{
	for (int i = 0; i < groupe->nombre; i++) {
		afficher_radio(surface, groupe->radios[i]);
	}
}

bool utiliser_event_groupe_radio(struct groupe_radio* groupe, SDL_Event event)
{
	for (int i = 0; i < groupe->nombre; i++) {
		struct radio* radio = groupe->radios[i];
		bool etait_coche = radio->coche;
		if (utiliser_event_radio(radio, event)) {
			if (!etait_coche && radio->coche) {
				if (groupe->radio_courante)
					groupe->radio_courante->coche = false;
				groupe->radio_courante = radio;
			}
			return true;
		}
	}
	return false;
}

void detruire_groupe_radio(struct groupe_radio* groupe)
{
	for (int i = 0; i < groupe->nombre; i++) {
		gosh_free(groupe->radios[i]);
	}
	gosh_free(groupe);
}

struct radio* creer_radio(const char* texte, int x, int y)
{
	struct radio* radio = gosh_alloc(*radio);
	radio->texte_surface = text_surface(texte, NORMAL);
	radio->x = x;
	radio->y = y;
	radio->w = radio->texte_surface->w;
	radio->h = radio->texte_surface->h;
	radio->couleur = get_color();
	radio->visible = true;
	radio->coche = false;
	return radio;
}

void afficher_radio(SDL_Surface* on, struct radio* radio)
{
	int w = radio->texte_surface->h * .5;
	int border = 2;
	set_color(200, 200, 200);
	draw_rect(on, radio->x, radio->y + w * .5, w, w);
	if (radio->coche) {
		set_color(50, 50, 50);
		draw_rect(on, radio->x + border, (radio->y + w * .5) + border, w - border*2, w - border*2);
	}
	draw_surface(on, radio->texte_surface,  radio->x + w + 2, radio->y, LEFT);
}

bool utiliser_event_radio(struct radio* radio, SDL_Event event)
{
	int w = radio->texte_surface->h;
	#define INSIDE(_x, _y) \
		(radio->x < (_x) && (_x) < radio->x + w && \
				radio->y < (_y) && (_y) < radio->y + w)
	if (event.type == SDL_MOUSEBUTTONDOWN) {
		if (INSIDE(event.button.x, event.button.y)) {
			if (event.button.button == 1) {
				radio->coche = true;
				return true;
			}
		}
	}
	return false;
#undef INSIDE
}

void detruire_radio(struct radio* radio)
{
	SDL_FreeSurface(radio->texte_surface);
	gosh_free(radio);
}


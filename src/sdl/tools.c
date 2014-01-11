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
#include <stdbool.h>

#include <SDL/SDL.h>
#include <SDL/SDL_ttf.h>

#include "gosh_alloc.h"
#include "sdl/tools.h"

#define FONT_FILENAME "data/arial.ttf"

SDL_Color color = {255, 255, 255, 0};
const int font_sizes[] = {12, 20, 64};

static TTF_Font* get_font(enum FontSize size);

void set_color(int r, int g, int b)
{
	color.r = r;
	color.g = g;
	color.b = b;
}

void draw_rect(SDL_Surface* surface, int x, int y, int w, int h)
{
	SDL_Rect rect = {x,y,w,h};
	uint32_t c = SDL_MapRGB(surface->format, color.r, color.g, color.b);
	SDL_FillRect(surface, &rect, c);
}

SDL_Surface* text_surface(const char* text, enum FontSize size)
{
	TTF_Font* font = get_font(size);
	SDL_Surface* surface = TTF_RenderUTF8_Blended(font, text, color);
	return surface;
}

void draw_surface(SDL_Surface* on, SDL_Surface* from, int x, int y, enum Align align)
{
	SDL_Rect dest = {x, y, 0, 0};
	if (align == CENTER) {
		dest.x -= from->w / 2;
		dest.y -= from->h / 2; // centré aussi par rapport à y
	} else if (align == RIGHT) {
		dest.x -= from->w;
	}
	SDL_BlitSurface(from, NULL, on, &dest);
}

struct bouton* creer_bouton(const char* text, int x, int y, int w, int h)
{
	struct bouton* bouton = gosh_alloc(*bouton);
	bouton->surface = text_surface(text, NORMAL);
	bouton->x = x;
	bouton->y = y;
	bouton->w = w;
	bouton->h = h;
	bouton->couleur = color;
	bouton->hover = false;
	return bouton;
}
void afficher_bouton(SDL_Surface* on, struct bouton* bouton)
{
	if (bouton->hover) {
		set_color(bouton->couleur.r / 2, bouton->couleur.g / 2, bouton->couleur.b / 2);
	} else {
		set_color(bouton->couleur.r * 2, bouton->couleur.g * 2, bouton->couleur.b * 2);
	}
	draw_rect(on, bouton->x, bouton->y, bouton->w, bouton->h);
	set_color(bouton->couleur.r / 3, bouton->couleur.g / 3, bouton->couleur.b / 3);
	draw_rect(on, bouton->x + 2, bouton->y + 2, bouton->w - 4, bouton->h - 4);
	draw_surface(on, bouton->surface, bouton->x + bouton->w / 2, bouton->y + bouton->h / 2, CENTER);
}

bool utiliser_event_bouton(struct bouton* bouton, SDL_Event event)
{
	if (event.type == SDL_MOUSEMOTION) {
		int x = event.motion.x;
		int y = event.motion.y;
		if (bouton->x < x && x < bouton->x + bouton->w &&
				bouton->y < y && y < bouton->y + bouton->h) {
			bouton->hover = true;
		} else {
			bouton->hover = false;
		}
	} else if (event.type == SDL_MOUSEBUTTONDOWN) {
		int x = event.button.x;
		int y = event.button.y;
		if (bouton->x < x && x < bouton->x + bouton->w &&
				bouton->y < y && y < bouton->y + bouton->h) {
			bouton->callback(bouton->userdata);
		}
	}
	return false;
}

void detruire_bouton(struct bouton* bouton)
{
	(void) bouton;
}

TTF_Font* get_font(enum FontSize size)
{
	static TTF_Font* fonts[NUM_FONTS] = {NULL};
	int i = size;
	if (!fonts[i]) {
		fonts[i] = TTF_OpenFont(FONT_FILENAME, font_sizes[i]);
		TTF_CHECK(fonts[i] != NULL);
	}
	return fonts[i];
}


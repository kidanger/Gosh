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

static SDL_Color color = {255, 255, 255, 0};
static const int font_sizes[] = {12, 20, 64};

static TTF_Font* get_font(enum FontSize size);

void set_color(int r, int g, int b)
{
	color.r = r;
	color.g = g;
	color.b = b;
}

SDL_Color get_color()
{
	return color;
}

void draw_rect(SDL_Surface* surface, int x, int y, int w, int h)
{
	SDL_Rect rect = {x, y, w, h};
	uint32_t c = SDL_MapRGB(surface->format, color.r, color.g, color.b);
	SDL_FillRect(surface, &rect, c);
}

SDL_Surface* text_surface(const char* text, enum FontSize size)
{
	TTF_Font* font = get_font(size);
#ifdef EMSCRIPTEN
	SDL_Surface* surface = TTF_RenderText_Blended(font, text, color);
#else
	SDL_Surface* surface = TTF_RenderUTF8_Blended(font, text, color);
#endif
	return surface;
}

void draw_surface(SDL_Surface* on, SDL_Surface* from, int x, int y, enum Align align)
{
	SDL_Rect dest = {x, y, 0, 0};
	if (align == CENTER_X) {
		dest.x -= from->w / 2;
	} else if (align == CENTER_XY) {
		dest.x -= from->w / 2;
		dest.y -= from->h / 2;
	} else if (align == RIGHT) {
		dest.x -= from->w;
	}
	SDL_BlitSurface(from, NULL, on, &dest);
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


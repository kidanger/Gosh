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

/** @file tools.c
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup sdl
 *  @brief Implémente les outils sdl
 */

#include <stdbool.h>

#include <SDL/SDL.h>
#include <SDL/SDL_ttf.h>

#include "gosh_alloc.h"
#include "sdl/tools.h"

/** @def FONT_FILENAMES
 *  @ingroup sdl
 *  @brief Chemins possible vers la police
 */
const char* FONT_FILENAMES[] = {
	SOURCE_PATH"/ressources/arial.ttf",
	INSTALL_PATH"/share/gosh/arial.ttf"
};

/** @ingroup sdl
 *  @brief Couleur du pinceau
 */
static SDL_Color color = {255, 255, 255, 0};

/** @ingroup sdl
 *  @brief Différentes tailles de polices.
 *  @see FontSize
 */
static const int font_sizes[] = {12, 20, 64};

/** @ingroup sdl
 *  @brief Crée une police ttf
 *  @param Taille de la police
 *  @return Police ainsi créée
 */
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

static TTF_Font* fonts[NUM_FONTS] = {NULL};

TTF_Font* get_font(enum FontSize size)
{
	int i = size;
	if (!fonts[i]) {
		unsigned p = 0;
		while (!fonts[i] && p < sizeof(FONT_FILENAMES)/sizeof(FONT_FILENAMES[0])) {
			fonts[i] = TTF_OpenFont(FONT_FILENAMES[p], font_sizes[i]);
			p++;
		}
		TTF_CHECK(fonts[i] != NULL);
	}
	return fonts[i];
}

void liberer_polices()
{
	int i;
	for (i = 0; i < NUM_FONTS; i++) {
		TTF_CloseFont(fonts[i]);
	}
	TTF_Quit();
}


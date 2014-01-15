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
#include "sdl/label.h"

struct label* creer_label(const char* text, int x, int y, enum Align align, enum FontSize size)
{
	struct label* label = gosh_alloc(*label);
	label->surface = text_surface(text, size);
	label->x = x;
	label->y = y;
	label->align = align;
	label->couleur = get_color();
	label->visible = true;
	return label;
}

void afficher_label(SDL_Surface* on, struct label* label)
{
	if (label->visible) {
		draw_surface(on, label->surface, label->x, label->y, label->align);
	}
}

void detruire_label(struct label* label)
{
	SDL_FreeSurface(label->surface);
	gosh_free(label);
}


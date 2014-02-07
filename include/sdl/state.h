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
#ifndef GOSH_SDL_STATE
#define GOSH_SDL_STATE

/** @file state.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup sdl
 *  @brief Défini les états
 */

#include <stdbool.h>
#include <SDL/SDL.h>

/** @ingroup sdl
 *  @brief Défini les états
 *  @todo compléter
 */
struct state {
	bool quitter;

	void(*afficher)(struct state*, SDL_Surface*);
	void(*keydown)(struct state*, SDL_Event);
	void(*mousemotion)(struct state*, SDL_Event);
	void(*mousebuttondown)(struct state*, SDL_Event);
	void(*mousebuttonup)(struct state*, SDL_Event);
	void(*mise_a_jour)(struct state*, double);
	void* data;
};


#endif


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
#include <stdio.h>

#include <SDL/SDL.h>
#include <SDL/SDL_ttf.h>

#include "sdl/state.h"
#include "sdl/menu.h"
#include "sdl/tools.h"
#include "sdl/main.h"

SDL_Surface* window;
struct state* state;

void sdl_handle_events(struct state* state)
{
	SDL_Event event;
	while (SDL_PollEvent(&event)) {
		switch (event.type) {
			case SDL_QUIT:
				state->quitter = true;
				break;
			case SDL_KEYDOWN:
				if (state->keydown)
					state->keydown(state, event);
				break;
			case SDL_KEYUP:
				break;
			case SDL_MOUSEMOTION:
				if (state->mousemotion)
					state->mousemotion(state, event);
				break;
			case SDL_MOUSEBUTTONDOWN:
				if (state->mousebuttondown)
					state->mousebuttondown(state, event);
				break;
			case SDL_MOUSEBUTTONUP:
				if (state->mousebuttonup)
					state->mousebuttonup(state, event);
				break;
		}
	}
}

void set_state(struct state* newstate)
{
	state = newstate;
}

#ifdef EMSCRIPTEN
#include "emscripten.h"
#endif

void update()
{
	sdl_handle_events(state);

	double dt = 1 / 60.;
	if (state->mise_a_jour)
		state->mise_a_jour(state, dt);

	set_color(40, 40, 40);
	draw_rect(window, 0, 0, W, H);
	state->afficher(state, window);

	SDL_Flip(window);

	if (state->quitter) {
		printf("Quitte!\n");
#ifdef EMSCRIPTEN
		emscripten_cancel_main_loop();
#endif
	}
}

int main(void)
{
	SDL_CHECK(SDL_Init(SDL_INIT_EVERYTHING) == 0);
	atexit(SDL_Quit);

	TTF_CHECK(TTF_Init() == 0);

	window = SDL_SetVideoMode(W, H, 32, SDL_HWSURFACE | SDL_DOUBLEBUF);
	SDL_CHECK(window != NULL);

	state = creer_menu();

#ifdef EMSCRIPTEN
	emscripten_set_main_loop(update, 0, true);
#else
	while (!state->quitter) {
		update();
		SDL_Delay(1 / 60.);
	}
#endif

	return EXIT_SUCCESS;
}


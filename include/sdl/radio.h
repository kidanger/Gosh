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
#ifndef GOSH_SDL_RADIO
#define GOSH_SDL_RADIO

#include <stdbool.h>

#include <SDL/SDL.h>

struct groupe_radio {
	int nombre;
	int index_prochain;
	struct radio** radios;
	int courante;
	bool visible;

	void(*callback)(struct groupe_radio*, void*);
	void* userdata;
};

struct groupe_radio* creer_groupe_radio(int nombre);
void groupe_radio_ajouter(struct groupe_radio* groupe, const char* texte, int x, int y);
void afficher_groupe_radio(SDL_Surface*, struct groupe_radio*);
void utiliser_event_groupe_radio(struct groupe_radio*, SDL_Event);
void detruire_groupe_radio(struct groupe_radio*);

#endif


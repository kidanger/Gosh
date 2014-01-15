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

struct groupe_radio {
	int nombre;
	struct radio** radios;
	struct radio* radio_courante;
};

struct radio {
	SDL_Surface* texte_surface;

	float x;
	float y;
	int w;
	int h;
	SDL_Color couleur;
	bool visible;

	bool coche;
};

struct groupe_radio* creer_groupe_radio(int nombre);
void afficher_groupe_radio(SDL_Surface*, struct groupe_radio*);
bool utiliser_event_groupe_radio(struct groupe_radio*, SDL_Event);

void detruire_groupe_radio(struct groupe_radio*);

struct radio* creer_radio(const char* texte, int x, int y);
void afficher_radio(SDL_Surface*, struct radio*);
bool utiliser_event_radio(struct radio*, SDL_Event);
void detruire_radio(struct radio*);

#endif


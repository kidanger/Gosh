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

/** @file radio.c
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup sdl
 *  @brief Implémente les fonctionnalités liées aux boutons radios
 */

#include <stdlib.h>
#include <stdbool.h>

#include <SDL/SDL.h>

#include "gosh_alloc.h"
#include "sdl/tools.h"
#include "sdl/radio.h"

/** @ingroup sdl
 *  @brief Représente un bouton radio
 */
struct radio {
	/** @brief Label du bouton radio */
	SDL_Surface* texte_surface;
	/** @brief Abscisse du bouton */
	float x;
	/** @brief Ordonné du bouton */
	float y;
	/** @brief Largeur du bouton */
	int w;
	/** @brief Hauteur du bouton */
	int h;
	/** @brief Couleur du bouton */
	SDL_Color couleur;
	/** @brief Indique si le bouton est coché ou non */
	bool coche;
	/** @brief Indique si le bouton est actuellement survolé par le curseur */
	bool hover;
};

/** @ingroup sdl
 *  @brief Crée un bouton radio
 *  @param Label du bouton radio
 *  @param Abscisse du bouton
 *  @param Ordonné du bouton
 *  @return Bouton ainsi crée
 */
struct radio* creer_radio(const char* texte, int x, int y);

/** @ingroup sdl
 *  @brief Dessine un bouton radio sur une texture
 *  @param Texture sur laquelle dessiner le bouton
 *  @param Bouton à dessiner
 */
void afficher_radio(SDL_Surface*, struct radio*);

/** @ingroup sdl
 *  @brief Traite un événement SDL
 *  @param bouton radio
 *  @param événement sdl
 */
void utiliser_event_radio(struct radio*, SDL_Event);

/** @ingroup sdl
 *  @brief Détruit un bouton radio et libère les ressources associées
 *  @brief Bouton radio à détruire.
 */
void detruire_radio(struct radio*);

struct groupe_radio* creer_groupe_radio(int nombre)
{
	struct groupe_radio* groupe = gosh_alloc(*groupe);
	groupe->nombre = nombre;
	groupe->index_prochain = 0;
	groupe->radios = gosh_allocn(struct radio*, nombre);
	groupe->courante = -1;
	groupe->callback = NULL;
	groupe->userdata = NULL;
	groupe->visible = true;
	return groupe;
}

void groupe_radio_ajouter(struct groupe_radio* groupe, const char* texte, int x, int y)
{
	struct radio* radio = creer_radio(texte, x, y);
	if (groupe->index_prochain == 0) {
		groupe->courante = 0;
		radio->coche = true;
	}
	groupe->radios[groupe->index_prochain++] = radio;
}

void afficher_groupe_radio(SDL_Surface* surface, struct groupe_radio* groupe)
{
	if (groupe->visible) {
		for (int i = 0; i < groupe->nombre; i++) {
			afficher_radio(surface, groupe->radios[i]);
		}
	}
}

void utiliser_event_groupe_radio(struct groupe_radio* groupe, SDL_Event event)
{
	for (int i = 0; i < groupe->nombre; i++) {
		struct radio* radio = groupe->radios[i];
		bool etait_coche = radio->coche;
		utiliser_event_radio(radio, event);
		if (!etait_coche && radio->coche) {
			if (groupe->courante != -1)
				groupe->radios[groupe->courante]->coche = false;
			groupe->courante = i;
			if (groupe->callback) {
				groupe->callback(groupe, groupe->userdata);
			}
		}
	}
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
	radio->coche = false;
	radio->hover = false;
	return radio;
}

void afficher_radio(SDL_Surface* on, struct radio* radio)
{
	int w = radio->texte_surface->h * .5;
	int border = 2;
	set_color(200, 200, 200);
	draw_rect(on, radio->x, radio->y + w * .5, w, w);
	if (radio->coche) {
		if (radio->hover) {
			set_color(150, 100, 100);
		} else {
			set_color(50, 50, 50);
		}
	} else if (radio->hover) {
		set_color(100, 100, 100);
	}
	draw_rect(on, radio->x + border, (radio->y + w * .5) + border, w - border * 2, w - border * 2);
	draw_surface(on, radio->texte_surface,  radio->x + w + 2, radio->y, LEFT);
}

void utiliser_event_radio(struct radio* radio, SDL_Event event)
{
	int w = radio->texte_surface->h;
#define INSIDE(_x, _y) \
	(radio->x < (_x) && (_x) < radio->x + w && \
	 radio->y < (_y) && (_y) < radio->y + w)
	if (event.type == SDL_MOUSEBUTTONDOWN) {
		if (INSIDE(event.button.x, event.button.y)) {
			if (event.button.button == 1) {
				radio->coche = true;
			}
		}
	} else if (event.type == SDL_MOUSEMOTION) {
		if (INSIDE(event.motion.x, event.motion.y)) {
			radio->hover = true;
		} else {
			radio->hover = false;
		}
	}
#undef INSIDE
}

void detruire_radio(struct radio* radio)
{
	SDL_FreeSurface(radio->texte_surface);
	gosh_free(radio);
}


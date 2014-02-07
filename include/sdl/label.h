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
#ifndef GOSH_SDL_LABEL
#define GOSH_SDL_LABEL

/** @file label.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup sdl
 *  @brief Défini les labels
 */

#include <stdbool.h>
#include <SDL/SDL.h>

#include "sdl/tools.h"

/** @ingroup sdl
 *  @brief Représente un label
 */
struct label {
    /** @brief Label à afficher */
	SDL_Surface* surface;
    /** @brief Position du label */
	int x, y;
    /** @brief Taille du label */
	int w, h;
    /** @brief Alignement du texte dans le label */
	enum Align align;
    /** @brief Couleur du texte du label */
	SDL_Color couleur;
    /** @brief Indique si le label est visible ou non */
	bool visible;
};

/** @ingroup sdl
 *  @brief Crée un label
 *  @param Texte du label
 *  @param abscisse du label
 *  @param ordonné du label
 *  @param aligement du texte dans le label
 *  @param Taille de la police
 */
struct label* creer_label(const char* text, int x, int y, enum Align align, enum FontSize size);

/** @ingroup sdl
 *  @brief Dessine le label sur une texture
 *  @param Texture sur laquelle dessiner le label
 *  @param label à dessiner
 */
void afficher_label(SDL_Surface* on, struct label*);

/** @ingroup sdl
 *  @brief Détruit un label et libère les ressources associées
 *  @param Label à détruire
 */
void detruire_label(struct label*);

#endif



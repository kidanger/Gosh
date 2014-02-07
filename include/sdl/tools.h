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
#ifndef GOSH_SDL_TOOLS
#define GOSH_SDL_TOOLS

/** @file tools.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 *  @brief Défini quelques outils
 */

#include <stdbool.h>
#include <stdio.h>

#include <SDL/SDL.h>

/** @def W
 *  @ingroup sdl
 *  @brief Largeur de la fenêtre en pixel
 */
#define W 800

/** @def H
 *  @ingroup sdl
 *  @brief Hauteur de la fenêtre en pixel
 */
#define H 680


/** @def MIN(a, b)
 *  @ingroup sdl
 *  @brief Donne le minimum entre a et b
 */
#define MIN(a, b) ((a) < (b) ? (a) : (b))

/** @def MIN(a, b)
 *  @ingroup sdl
 *  @brief Donne le maximum entre a et b
 */
#define MAX(a, b) ((a) > (b) ? (a) : (b))

/** @def COLOR(r, g, b)
 *  @ingroup sdl
 *  @brief Crée une SDL_Color
 */
#define COLOR(r, g, b) ((SDL_Color){(r), (g), (b), 0})

/** @ingroup sdl
 *  @brief Dessine un rectangle
 *  @param Texture du rectangle
 *  @param abscisse du coin supérieur gauche du rectangle
 *  @param ordonné du coin supérieur gauche du rectangle
 *  @param largeur du rectangle
 *  @param hauteur du rectangle
 */
void draw_rect(SDL_Surface*, int x, int y, int w, int h);

/** @ingroup sdl
 *  @brief Change la couleur du pinceau
 *  @param quantité de rouge de la couleur
 *  @param quantité de vert de la couleur
 *  @param quantité de bleu de la couleur
 */
void set_color(int r, int g, int b);

/** @ingroup sdl
 *  @brief Retourne la couleur du pinceau
 *  @return Couleur de fond de la fenêtre.
 */
SDL_Color get_color();


/** @ingroup sdl
 *  @brief Taille de la police
 */
enum FontSize {
	SMALL = 0,
	NORMAL,
	BIG,
    /** @brief Nombre de tailles possibles */
	NUM_FONTS
};

/** @ingroup sdl
 *  @brief Crée une surface contenant un texte
 *  @param Texte à mettre sur la surface
 *  @param Taille de la police
 *  @return Surface ainsi crée
 */
SDL_Surface* text_surface(const char*, enum FontSize taille);

/** @ingroup sdl
 *  @brief Donne les alignements du texte possibles
 */
enum Align {
    /** @brief aligné à gauche */
	LEFT = 0,
    /** @brief Centré horizontalement */
	CENTER_X,
    /** @brief Centré verticalement */
	CENTER_XY,
    /** @brief aligné à droite */
	RIGHT
};

/** @ingroup sdl
 *  @brief Dessiner une surface sur une autre surface
 *  @param surface sur laquelle dessiner
 *  @param surface à dessiner
 *  @param abscisse
 *  @param ordonné
 *  @param alignement à utilisé
 */
void draw_surface(SDL_Surface* on, SDL_Surface* from, int x, int y, enum Align align);

/** @def SDL_CHECK(cond)
 *  @ingroup sdl
 *  @brief Vérifie le bon fonctionnement d'une fonction SDL
 */
#define SDL_CHECK(cond) \
	do { \
		if (!(cond)) { \
			perror(SDL_GetError()); \
			exit(EXIT_FAILURE); \
		} \
	} while (0)

/** @def TTF_CHECK(cond)
 *  @ingroup sdl
 *  @brief Vérifie le bon fonctionnement d'une fonction SDL_TTF
 */
#define TTF_CHECK(cond) \
	do { \
		if (!(cond)) { \
			perror(TTF_GetError()); \
			exit(EXIT_FAILURE); \
		} \
	} while (0)

#endif


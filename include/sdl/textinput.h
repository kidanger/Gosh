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
#ifndef GOSH_SDL_TEXTINPUT
#define GOSH_SDL_TEXTINPUT

/** @file textinput.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup sdl
 *  @brief Fournit une zone de texte
 */

#include <stdbool.h>
#include <SDL/SDL.h>

/** @ingroup sdl
 *  @brief Décris une zone de texte
 */
struct textinput {
    /** @brief Surface de la zone de texte */
	SDL_Surface* surface;

    /** @brief Taille maximal de la chaîne de caractère */
	int taillemax;
    /** @brief Position du curseur dans la chaîne de caractères */
	int curseur;
    /** @brief Buffer contenant le texte tapé par l'utilisateur */
	char* buffer;

    /** @brief position de la zone de texte */
	int x, y;
    /** @brief taille de la zone de texte */
	int w, h;
    /** @brief Couleur du texte */
	SDL_Color couleur;

    /** @brief ?? */
	bool hover;
    /** @brief Indique si la zone de texte est active ou non. */
	bool active;
    /** @brief ?? */
	double time;
};

/** @ingroup sdl
 *  @brief Crée une zone de texte
 *  @param abscisse
 *  @param ordonné
 *  @param largeur
 *  @param hauteur
 *  @param taille maximale du texte de la zone de texte
 *  @return zone de texte ainsi créée.
 */
struct textinput* creer_textinput(int x, int y, int w, int h, int taillemax);

/** @ingroup sdl
 *  @brief Dessine la zone de texte dans une surface
 *  @param Surface surlaquelle dessiner la zone de texte
 *  @param zone de texte à dessiner
 */
void afficher_textinput(SDL_Surface* on, struct textinput*);

/** @ingroup sdl
 *  @brief ??
 *  @param zone de texte
 *  @param ??
 */
void mise_a_jour_textinput(struct textinput*, double);

/** @ingroup sdl
 *  @brief ???
 *  @param zone de texte
 *  @param événement sdl
 */
void utiliser_event_textinput(struct textinput*, SDL_Event);

/** @ingroup sdl
 *  @brief Détruit une zone de texte et libère les ressources associées.
 *  @param zone de texte à détruit
 */
void detruire_textinput(struct textinput*);

#endif


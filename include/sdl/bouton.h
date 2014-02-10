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
#ifndef GOSH_SDL_BOUTON
#define GOSH_SDL_BOUTON

/** @file bouton.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup sdl
 *  @brief Permet d'utiliser des buttons avec la SDL
 */


#include <stdbool.h>
#include <SDL/SDL.h>


/** @ingroup sdl
 *  @brief Bouton SDL
 */
struct bouton {
	/** @brief Texture du bouton */
	SDL_Surface* surface;
	/** @brief position du bouton */
	float x, y;
	/** @brief position d'origine du bouton */
	float ox, oy;
	/** @brief taille du bouton */
	int w, h;
	/** @brief Couleur du texte du bouton */
	SDL_Color couleur;
	/** @brief Temps de déplacement */
	float deplacement_auto_timer;
	/** @brief Indique si le bouton doit être visible ou non */
	bool visible;

	/** @brief Fonction appelée lorsque le bouton est cliqué */
	void(*callback)(struct bouton*, void*);
	/** @brief Donnée à passer en paramètre lorsque le bouton est cliqué */
	void* userdata;
	/** @brief Indique si le bouton est survolé par le curseur */
	bool hover;
	/** @brief indique si le bouton est en mouvement ou non */
	bool en_deplacement;
};

/** @ingroup sdl
 *  @brief Crée un bouton
 *  @param texte affiché sur le bouton
 *  @param absisce de la position du bouton
 *  @param ordonné de la position du bouton
 *  @param largeur du bouton
 *  @param hauteur du bouton
 *  @return bouton ainsi crée
 */
struct bouton* creer_bouton(const char* text, int x, int y, int w, int h);

/** @ingroup sdl
 *  @brief Dessine un bouton sur une surface
 *  @param Surface surlaquelle dessiner le bouton
 *  @param Bouton à dessiner.
 */
void afficher_bouton(SDL_Surface* on, struct bouton*);

/** @ingroup sdl
 *  @brief Actualise l'état du bouton (remise à sa place s'il avait été déplacé)
 *  @param Bouton à mettre à jour
 *  @param Temps depuis la dernière mise à jour
 */
void mise_a_jour_bouton(struct bouton*, double dt);

/** @ingroup sdl
 *  @brief Traite un événement SDL
 *  @param Bouton potentiellement intéressé par l'événement
 *  @param Événement SDL
 */
void utiliser_event_bouton(struct bouton*, SDL_Event);

/** @ingroup sdl
 *  @brief Détruit un bouton
 *  @param Bouton à détruire
 */
void detruire_bouton(struct bouton*);

#endif


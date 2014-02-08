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

/** @file radio.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup sdl
 *  @brief Permet l'utilisation de boutons radios.
 */

#include <stdbool.h>

#include <SDL/SDL.h>

/** @ingroup sdl
 *  @brief Défini un groupe de boutons radios.
 *
 *  Un seul bouton radio peut être coché à la fois.
 */
struct groupe_radio {
	/** @brief Nombre de boutons radios de ce groupe */
	int nombre;
	/** @brief ?? */
	int index_prochain;
	/** @brief Boutons radios du groupe */
	struct radio** radios;
	/** @brief Bouton coché */
	int courante;
	/** @brief Indique si le groupe de bouton est visible ou non */
	bool visible;
	/** @brief Indique la fonction à appeler lorsqu'un bouton radio est coché */
	void(*callback)(struct groupe_radio*, void*);
	/** @brief ?? */
	void* userdata;
};

/** @ingroup sdl
 *  @brief Crée un groupe de boutons radio
 *  @param Nombre de boutons radio dans le groupe
 *  @return Groupe de boutons radio ainsi crées
 */
struct groupe_radio* creer_groupe_radio(int nombre);

/** @ingroup sdl
 *  @brief Ajoute un bouton à un groupe de boutons radio
 *  @param Groupe auquel ajouter le bouton radio
 *  @param Label du bouton radio à ajouter
 *  @param abscisse du bouton à ajouter
 *  @param ordonné du bouton à ajouter
 */
void groupe_radio_ajouter(struct groupe_radio* groupe, const char* texte, int x, int y);

/** @ingroup sdl
 *  @brief Dessine un groupe de boutons radio sur une texture
 *  @param Texture sur laquelle afficher le groupe
 *  @param Groupe de boutons radios à dessiner
 */
void afficher_groupe_radio(SDL_Surface*, struct groupe_radio*);

/** @ingroup sdl
 *  @brief ???
 *  @param Groupe de boutons radio
 *  @param Evénement SDL
 */
void utiliser_event_groupe_radio(struct groupe_radio*, SDL_Event);

/** @ingroup sdl
 *  @brief Detruit un groupe de boutons radio et libère les ressources associées
 *  @param Groupe à détruire
 */
void detruire_groupe_radio(struct groupe_radio*);

#endif


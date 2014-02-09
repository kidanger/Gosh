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
#ifndef GOSH_SDL_CHARGER
#define GOSH_SDL_CHARGER

/** @file charger.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup sdl
 *  @brief Gère le menu de chargement de partie
 */


/** @ingroup sdl
 *  @brief Créer l'état "menu de chargement"
 *  @param État parent (le menu principal)
 *  @return menu de chargement
 */
struct state* creer_charger(struct state* parent);

/** @ingroup sdl
 *  @brief Détruit l'état "menu de chargement"
 *  @param État à détruire
 */
void detruire_charger(struct state*);

#endif

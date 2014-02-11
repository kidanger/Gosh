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
#ifndef GOSH_CLI_DEROULEMENT_PARTIE
#define GOSH_CLI_DEROULEMENT_PARTIE

/** @file deroulement_partie.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup cli
 *  @brief Déclare les fonctions utiles au déroulement d'une partie.
 */

#include "go/partie.h"


/** @ingroup cli
 *  @brief Convertit la réponse de l'utilisateur en un coup.
 *  @param Partie en cours
 *  @param Coup entré par le joueur
 *  @param Si non nul, mis à faux si le coup est invalide
 *  @return Le coup joué par le joueur.
 */
s_Coup cli_convertir_coup(const Partie partie, const char* str, bool* valide);


/** @ingroup cli
 *  @brief Joue une partie
 *
 *  @warning Cette fonction ne retourne pas avant la fin de la partie.
 *  @param Partie à jouer.
 */
void cli_jouer_partie(Partie partie);

#endif

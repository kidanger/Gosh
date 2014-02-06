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
#ifndef GOSH_CLI_CONFIGURER_PARTIE
#define GOSH_CLI_CONFIGURER_PARTIE

/** @file configurer_partie.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup cli
 *  @brief Déclare les fonctions permettant la configuration d'une partie.
 */

#include "go/partie.h"

//#define CONFIGURER_PARTIE_AUTOMATIQUEMENT // pour passer l'étape de configuration;


/** @ingroup cli
 *  @brief Configure une partie
 *
 *  Demande à l'utilisateur de renseigner quelques données pour configurer la partie.
 *  @return Partie ainsi créée
 */
Partie cli_creer_nouvelle_partie(void);


#endif

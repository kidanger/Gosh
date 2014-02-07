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
#ifndef SAUVEGARDE_H
#define SAUVEGARDE_H

/** @file sauvegarde.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 *  @brief Déclare les méthodes de chargement et de sauvegarde de parties
 */

#include<stdbool.h>
#include<stdio.h>

#include "go/plateau_type.h"
#include "go/partie.h"

/** @ingroup go
 *  @brief Sauvegarde une partie dans un fichier
 *  @param Nom du fichier dans lequel sauvegarder la partie
 *  @param Partie à sauvegarder
 *  @return Faux en cas d'erreur
 */
bool sauvegarder_partie_fichier(const char * filename, Partie);

/** @ingroup go
 *  @brief Sauvegarde une partie dans un flux
 *  @param flux dans lequel sauvegarder la partie
 *  @param Partie à sauvegarder
 *  @return Faux en cas d'erreur
 */
bool sauvegarder_partie(Partie, FILE * file);

/** @ingroup go
 *  @brief Crée une partie en la chargeant à partir d'un fichier
 *
 *  Place errno à ENOTSUP si le type de format n'est pas supporté
 *  @param fichier à partir duquel charger la partie
 *  @return Partie ainsi crée
 */

Partie charger_partie_fichier(const char * filename);
/** @ingroup go
 *  @brief Crée une partie en la chargeant à partir d'un flux
 *  @param flux à partir duquel charger la partie
 *  @return Partie ainsi crée
 */
Partie charger_partie(FILE * file);

/** @ingroup go
 *  @brief Sauvegarde un plateau dans un fichier
 *  @param Nom du fichier dans lequel sauvegarder le plateau
 *  @param Plateau à sauvegarder
 *  @return Faux en cas d'erreur
 */
bool sauvegarder_plateau_fichier(const char * filename, Plateau);

/** @ingroup go
 *  @brief Sauvegarde un plateau dans un flux
 *  @param Flux dans lequel sauvegarder le plateau
 *  @param Plateau à sauvegarder
 *  @return Faux en cas d'erreur
 */
bool sauvegarder_plateau(Plateau, FILE * file);


/** @ingroup go
 *  @brief Crée un plateau en le chargeant à partir d'un fichier
 *
 *  Place errno à ENOTSUP si le type de format n'est pas supporté
 *  @param fichier à partir duquel charger le plateau
 *  @return Plateau ainsi crée
 */
Plateau charger_plateau_fichier(const char * filename);

/** @ingroup go
 *  @brief Crée un plateau en le chargeant à partir d'un flux
 *
 *  Place errno à ENOTSUP si le type de format n'est pas supporté
 *  @param Flux à partir duquel charger le plateau
 *  @return Plateau ainsi crée
 */
Plateau charger_plateau(FILE * file);

#endif // SAUVEGARDE_H

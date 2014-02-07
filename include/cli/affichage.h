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
#ifndef GOSH_CLI_AFFICHAGE
#define GOSH_CLI_AFFICHAGE

/** @file affichage.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup cli
 *  @brief Déclare les fonctions d'affichages
 */


#include "go/plateau_type.h"

#ifndef _WIN32
/** @def C_NORMAL
 *  @ingroup cli
 *  @brief Valeur à écrire dans la sortie standard pour changer la couleur du texte (couleur par défaut).
 */
#define C_NORMAL "\033[m"
/** @def C_WHITE
 *  @ingroup cli
 *  @brief Valeur à écrire dans la sortie standard pour changer la couleur du texte (en blanc).
 */
#define C_WHITE "\033[37m"
/** @def C_BLACK
 *  @ingroup cli
 *  @brief Valeur à écrire dans la sortie standard pour changer la couleur du texte (en noir).
 */
#define C_BLACK "\033[30m"
/** @def C_GREEN
 *  @ingroup cli
 *  @brief Valeur à écrire dans la sortie standard pour changer la couleur du texte (en vert).
 */
#define C_GREEN "\033[32m"
/** @def C_RED
 *  @ingroup cli
 *  @brief Valeur à écrire dans la sortie standard pour changer la couleur du texte (en rouge).
 */
#define C_RED "\033[31m"
/** @def C_YELLOW
 *  @ingroup cli
 *  @brief Valeur à écrire dans la sortie standard pour changer la couleur du texte (en jaune).
 */
#define C_YELLOW "\033[33m"
/** @def C_GREY
 *  @ingroup cli
 *  @brief Valeur à écrire dans la sortie standard pour changer la couleur du texte (en gris).
 */
#define C_GREY "\033[37m"
/** @def C_BLUE
 *  @ingroup cli
 *  @brief Valeur à écrire dans la sortie standard pour changer la couleur du texte (en bleu).
 */
#define C_BLUE "\033[34m"
/** @def C_
 *  @ingroup cli
 *  @brief Valeur à écrire dans la sortie standard pour changer la police du texte (en gras).
 */
#define C_BOLD "\033[1m"
/** @def C_NOBOLD
 *  @ingroup cli
 *  @brief Valeur à écrire dans la sortie standard pour changer la police du texte (sans gras).
 */
#define C_NOBOLD "\033[22m"
/** @def C_BACKGROUND_BROWN
 *  @ingroup cli
 *  @brief Valeur à écrire dans la sortie standard pour changer la couleur de fond (marron).
 */
#define C_BACKGROUND_BROWN "\033[43m"
/** @def C_BACKGROUND_NORMAL
 *  @ingroup cli
 *  @brief Valeur à écrire dans la sortie standard pour changer la couleur de fond (couleur par défaut).
 */
#define C_BACKGROUND_NORMAL "\033[m"
#else
#define C_NORMAL ""
#define C_WHITE ""
#define C_BLACK ""
#define C_GREEN ""
#define C_RED ""
#define C_YELLOW ""
#define C_GREY ""
#define C_BLUE ""
#define C_BOLD ""
#define C_NOBOLD ""
#define C_BACKGROUND_BROWN ""
#define C_BACKGROUND_NORMAL ""
#endif

#define C_YELLOW_BG "\033[43m"

/** @ingroup cli
 *  @brief Affiche un tableau
 *  @param Tableau à afficher
 */
void cli_afficher_plateau(Plateau plateau);

#endif

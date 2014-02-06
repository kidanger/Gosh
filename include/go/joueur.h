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
#ifndef GOSH_GO_JOUEUR
#define GOSH_GO_JOUEUR

/** @file joueur.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 *  @brief Défini les structures décrivant les joueurs
 */

#include "go/plateau_type.h"

/** @def TAILLE_NOM_JOUEUR
 *  @ingroup go
 *  @brief Taille maximale pour le nom d'un joueur.
 */
#define TAILLE_NOM_JOUEUR 12

/** @ingroup go
 *  @brief Indique la couleur du joueur
 *  @todo remplacer par Couleur
 */
enum CouleurJoueur {
	JOUEUR_BLANC,
	JOUEUR_NOIR
};

/** @ingroup go
 *  @brief Indique le type du joueur
 */
enum TypeJoueur {
    /** @brief Le joueur est un être humain */
	HUMAIN,
    /** @brief Le joueur est joué par l'ordinateur. */
	ORDINATEUR
};


/** @ingroup go
 *  @brief Décris un joueur
 */
struct s_Joueur {
    /** @brief Type du joueur. */
	enum TypeJoueur type;
    /** @brief Nom du joueur */
	char nom[TAILLE_NOM_JOUEUR];
    /** @brief Si le joueur est joué par l'ordinateur, décris l'IA utilisé */
    struct s_Ordinateur* ordinateur;
};


/** @brief Joueur */
typedef struct s_Joueur* Joueur;

#endif

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
#ifndef GOSH_GO_ORDINATEUR
#define GOSH_GO_ORDINATEUR

/** @file ordinateur.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 *  @brief Défini l'interface utilisé pour les IA
 */

#include "go/partie.h"

#define JOUER_COUP_STR "jouer_coup_ordi"
#define JOUER_COUP __attribute__((used)) jouer_coup_ordi
#define INITIALISER_STR "initialiser_ordi"
#define INITIALISER __attribute__((used)) initialiser_ordi
#define LIBERER_STR "liberer_ordi"
#define LIBERER __attribute__((used)) liberer_ordi
#define REMPLACER_PLATEAU_STR "remplacer_plateau_ordi"
#define REMPLACER_PLATEAU __attribute__((used)) remplacer_plateau_ordi
#define NOTIFICATION_COUP_STR "notification_coup_ordi"
#define NOTIFICATION_COUP __attribute__((used)) notification_coup_ordi

typedef void(*JouerFunc)(void*, Partie, enum CouleurJoueur);
typedef void(*RemplacerPlateauFunc)(void*, Plateau);
typedef void(*NotificationCoupFunc)(void*, Partie, enum CouleurJoueur, s_Coup);

/** @ingroup go
 *  @brief Décris une IA
 */
struct s_Ordinateur {
	/** @brief bibliothèque dynamique contenant l'IA */
	char * name;
	void* dlptr;
	/** @brief Fonction jouer */
	JouerFunc jouer;
	/** @brief Change le plateau */
	RemplacerPlateauFunc remplacer_plateau;
	/** @brief Notifie l'IA d'un changement de coup */
	NotificationCoupFunc notification_coup;
	/** @brief Données utilisées par l'IA */
	void* ordidata;
};

typedef struct s_Ordinateur* Ordinateur;

/** @ingroup go
 *  @brief Charge une IA
 *  @param Nom de la bibliothèque dynamique contenant l'IA
 *  @return Description de l'IA
 */
Ordinateur charger_ordinateur(const char* name);

/** @ingroup go
 *  @brief Libère les ressources associées à l'IA
 *  @param IA à libérer
 */
void decharger_ordinateur(Ordinateur ordi);


/** @ingroup go
 *  @brief Demande à l'IA de jouer un coup
 *  @param IA
 *  @param Partie en cours
 *  @param Couleur du joueur
 */
void ordinateur_jouer_coup(Ordinateur ordi, Partie partie, enum CouleurJoueur couleur);

/** @ingroup go
 *  @brief Remplace le plateau
 *  @param IA
 *  @param Nouveau plateau
 */
void ordinateur_remplacer_plateau(Ordinateur ordi, Plateau plateau);

/** @ingroup go
 *  @brief Notifie l'IA qu'un coup vient d'être joué
 *  @param IA
 *  @param Partie en cours
 *  @param Joueur
 *  @param Coup joué
 */
void ordinateur_notifier_coup(Ordinateur ordi, Partie partie, enum CouleurJoueur, s_Coup coup);

#endif


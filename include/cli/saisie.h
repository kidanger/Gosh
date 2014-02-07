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
#ifndef GOSH_CLI_SAISIE
#define GOSH_CLI_SAISIE

/** @file saise.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup cli
 *  @brief Déclare les fonctions de demande d'informations à l'utilisateur.
 */

#include <stdbool.h>
#include <stdarg.h>


/** @ingroup cli
 *  @brief Réponse possible
 */
typedef struct {
    /** @brief Lettre associée à l'option */
	char code;
    /** @brief Description de l'option */
	const char* phrase;
} Option;


/** @ingroup cli
 *  @brief Demande à l'utilisateur de faire un choix
 *
 *  La liste des options doit se terminer par 0.
 *
 *  Utilisation : cli_choisir_option("Que voulez-vous faire ?", 'p',
                                   'p', "Créer une nouvelle partie",
                                   0
                                  );
 *  @param prompt à afficher
 *  @param choix par défaut
 *  @return choix de l'utilisateur
 */
char cli_choisir_option(const char* prompt, char defaut, ...);


/** @ingroup cli
 *  @brief Demande à l'utilisateur de faire un choix
 *  @param prompt à afficher
 *  @param choix par défaut
 *  @param options possibles
 *  @return Choix de l'utilisateur
 */
char cli_choisir_option2(const char *prompt, char defaut, const Option * option);


/** @ingroup cli
 *  @brief Demande à l'utilisateur d'entrer une chaîne de caractères non-nul.
 *  @param prompt à afficher
 *  @param buffer
 *  @param taille du buffer.
 */
void cli_demander_string(const char* prompt, char* buffer, unsigned int taille);


/** @ingroup cli
 *  @brief Demande à l'utilisateur de renseigner un entier
 *  @param Prompt à afficher
 *  @return entier saisi par l'utilisateur.
 */
int cli_demander_int(const char* prompt);

#endif

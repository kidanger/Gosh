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

/** @defgroup gnugo
 *  @brief Ensemble des fonctions et des fichiers relatifs à l'IA gnugo.
 */

/** @file gnugo/main.c
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup gnugo
 *  @brief Bibliothèque de l'ordinateur qui joue aléatoirement
 */


#include <stdlib.h>
#include <stdio.h>
#include <ctype.h>
#include <string.h>
#include <unistd.h>
#include <time.h>

#include "go/ordinateur.h"
#include "go/plateau.h"
#include "go/coup.h"
#include "gosh_macros.h"
#include "gosh_alloc.h"

/** @ingroup gnugo
 *  @brief Commande et arguments utilisés pour lancer gnugo
 */
char * const GNUGO_COMMAND[] = { "gnugo", "--mode=gtp", NULL };

/** @ingroup gnugo
 *  @brief Convertit une lettre de gosh vers gnugo
 *
 *  Les lettres servent à identifier la colonne d'une position sur le plateau. Or gnugo n'utilise pas la
 *  lettre "i".
 */
char GOSH_TO_GNUGNO[] = { 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
                          'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'
                        };

/** @ingroup gnugo
 *  @brief Convertit une lettre de gnugo vers gosh
 *
 *  Les lettres servent à identifier la colonne d'une position sur le plateau. Or gnugo n'utilise pas la
 *  lettre "i".
 */
char GNUGO_TO_GOSH[] = { 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'x', 'I',
                         'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'
                       };

/** @ingroup gnugo
 *  @brief Ensemble des files descriptions utilisés pour les E/S avec gnugo
 */
typedef struct {
    /** @brief file descriptor utilisé comme entrée */
	int fdin;
    /** @brief file descriptor utilisé comme sortie */
	int fdout;
} *Data;

/** @ingroup gnugo
 *  @brief Vide les E/S
 *  @param E/S à vider
 */
void ignorer_sortie(Data data)
{
	// vide la sortie de gnugo
	char buf[256];
	int len = read(data->fdin, buf, sizeof(buf));
	buf[len] = 0;
	if (isalpha(buf[0])) {
		gosh_debug("buffer vidé: %s", buf);
	}
	if (len == sizeof(buf)) {
		ignorer_sortie(data);
	}
}

/** @ingroup gnugo
 *  @brief Envoie une instruction à gnugo
 *  @param E/S
 *  @param Commande à envoyer
 */
bool envoyer_commande(Data data, const char* commande)
{
	gosh_debug("GNUGO => %s", commande);
	write(data->fdout, commande, strlen(commande));
	write(data->fdout, "\n", 1);

	// vérification de la commande
	char c; // "= " ou "? "
	do {
		read(data->fdin, &c, 1);
	} while (c != '?' && c != '=');

	char blank;
	read(data->fdin, &blank, 1);

	if (c == '=') {
		return true;
	} else {
		gosh_debug("gnugo commande invalide %s (ret: '%c')", commande, c);
		ignorer_sortie(data);

		exit(1);
	}
}

/** @ingroup gnugo
 *  @brief Récupère le coup joué par gnugo
 *  @param E/S
 *  @param partie en cours
 */
s_Coup recuperer_coup(Data data, Partie partie)
{
	int taille = plateau_get_taille(partie->plateau);
	char buf[256];
	int len = read(data->fdin, buf, sizeof(buf));
	buf[len] = 0;
	s_Coup coup;
	if (strncmp(buf, "PASS", 4) == 0) {
		coup.position = POSITION_INVALIDE;
	} else {
		buf[0] = GNUGO_TO_GOSH[buf[0] - 'A'];
		coup = str2coup(buf, taille, NULL);
	}
	return coup;
}

/** @ingroup gnugo
 *  @brief Demande à gnugo de jouer un coup
 *  @param E/S
 *  @param Partie en cours
 *  @param Joueur joué par gnugo
 */
void JOUER_COUP(Data data, Partie partie, enum CouleurJoueur couleur)
{
	const char* cmd = couleur == JOUEUR_BLANC ? "reg_genmove white" : "reg_genmove black";

	s_Coup coup;
	envoyer_commande(data, cmd);
	coup = recuperer_coup(data, partie);
	bool valide = partie_jouer_coup(partie, coup);
	if (!valide) {
		gosh_debug("coup invalide");
		exit(1);
	}
}

/** @ingroup gnugo
 *  @brief Notifie gnugo d'un coup joué
 *  @param E/S
 *  @param Partie en cours
 *  @param Joueur ayant joué
 *  @param coup joué
 */
void NOTIFICATION_COUP(Data data, Partie partie, enum CouleurJoueur couleur, s_Coup coup)
{
	(void) partie;
	// les "passe" sont ignorés, non nécessaire avec gnugo
	if (position_est_valide(coup.position)) {
		char cmd[64];
		sprintf(cmd, "play %s %c%d", couleur == JOUEUR_BLANC ? "white" : "black",
		        GOSH_TO_GNUGNO[coup.position.x], coup.position.y + 1);
		envoyer_commande(data, cmd);
		ignorer_sortie(data);
	}
}

/** @ingrou gnugo
 *  @brief Change le plateau utilisé par gnugo
 *  @param E/S
 *  @param Nouveau plateau à utiliser
 */
void REMPLACER_PLATEAU(Data data, Plateau plateau)
{
	int taille = plateau_get_taille(plateau);
	char buf[64];
	sprintf(buf, "boardsize %d", taille);
	envoyer_commande(data, buf);
	ignorer_sortie(data);
	envoyer_commande(data, "level 1");
	ignorer_sortie(data);

	for (int y = 0; y < taille; y++) {
		for (int x = 0; x < taille; x++) {
			Couleur c = plateau_get(plateau, x, y);
			if (c != VIDE) {
				char cmd[64];
				sprintf(cmd, "play %s %c%d", c == BLANC ? "white" : "black",
				        GOSH_TO_GNUGNO[x], y + 1);
				envoyer_commande(data, cmd);
				ignorer_sortie(data);
			}
		}
	}
}

/** @ingroup gnugo
 *  @brief Initialise gnugo
 *  @return E/S
 */
void* INITIALISER()
{
	srand(time(0));
	gosh_debug("Initialisation du botgnugo");
	FILE* f_test = fopen("/usr/bin/gnugo", "r");
	if (!f_test) {
		fprintf(stderr, "Binaire GNUGO non présent.\n");
		return NULL;
	}
	fclose(f_test);

	int fds1[2]; // [1] : écrire vers gnugo
	int fds2[2]; // [0] : lire ce qu'envoie gnugo
	if (pipe(fds1)) {
		perror("pipe");
		return NULL;
	}
	if (pipe(fds2)) {
		perror("pipe");
		return NULL;
	}
	int pid;
	if ((pid = fork()) == -1) {
		close(fds1[0]);
		close(fds1[1]);
		close(fds2[0]);
		close(fds2[1]);
		perror("fork");
		return NULL;
	}

	if (pid == 0) { // enfant
		gosh_debug("execution de gnugo");
		close(fds1[1]);
		close(fds2[0]);
		dup2(fds1[0], 0);
		dup2(fds2[1], 1);
		execvp(GNUGO_COMMAND[0], GNUGO_COMMAND);
		perror("execvp");
		exit(1);
	} else { // parent
		close(fds1[0]);
		close(fds2[1]);
	}

	Data data = gosh_alloc(*data);
	data->fdin = fds2[0];
	data->fdout = fds1[1];

	// pour être sûr que gnugo est lancé et prêt
	write(data->fdout, "=\n", 2);
	char recv[1];
	read(data->fdin, recv, 1);
	ignorer_sortie(data);
	if (recv[0] != '?') {
		gosh_free(data);
		return NULL;
	}

	return data;
}

void LIBERER(Data data)
{
	close(data->fdout);
	close(data->fdin);
	free(data);
}


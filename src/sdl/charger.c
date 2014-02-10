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

/** @file charger.c
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup sdl
 *  @brief Gère le menu de chargement de partie
 */

#include <stdlib.h>
#include <stdbool.h>

#include <SDL/SDL.h>

#include "gosh_alloc.h"
#include "go/partie.h"
#include "go/sauvegarde.h"
#include "sdl/state.h"
#include "sdl/tools.h"
#include "sdl/bouton.h"
#include "sdl/label.h"
#include "sdl/textinput.h"
#include "sdl/main.h"
#include "sdl/jouer.h"
#include "sdl/charger.h"


#define NUM_BOUTONS 2


/** @ingroup sdl
 *  @brief Structure du menu de chargement de partie
 */
struct chargerdata {
	/** @brief État parent (le menu) */
	struct state* parent;
	/** @brief Titre */
	struct label* titre;
	/** @brief Label indiquant de saisir un nom */
	struct label* saisir;
	/** @brief Label affichant "impossible de charger" */
	struct label* erreur;
	/** @brief Boite de saisie du nom de la partie */
	struct textinput* nom_partie;
	/** @brief Boutons (retour, valider) */
	struct bouton* boutons[NUM_BOUTONS];
	/** @brief Indique si l'erreur est en cours de mouvement */
	bool shake;
	/** @brief Indique si la structure doit être libérée (suite à un changement d'état) */
	bool libere;
};

/** @ingroup sdl
 *  @brief Dessine le menu sur une texture
 *  @param État courant
 *  @param Texture sur laquelle dessiner le menu
 */
static void afficher_charger(struct state*, SDL_Surface*);

/** @ingroup sdl
 *  @brief Met à jour le menu
 *  @param État courant
 *  @param Temps passé de la dernière mise à jour
 */
static void mise_a_jour_charger(struct state* state, double dt);

/** @ingroup sdl
 *  @brief Traite un événement SDL
 *  @param État courant
 *  @param Événement sdl
 */
static void event_charger(struct state* state, SDL_Event event);

/** @ingroup sdl
 *  @brief Appelée lors du clic sur le bouton retour, ferme le menu charger
 *  @param Bouton qui a déclenché l'appel
 *  @param État courant
 */
static void charger_bouton_retour(struct bouton*, void * data);

/** @ingroup sdl
 *  @brief Appelée lors du clic sur le bouton "charger la partie"
 *  @param Bouton qui a déclenché l'appel
 *  @param État courant
 */
static void charger_bouton_charger(struct bouton*, void * data);

struct state* creer_charger(struct state* parent)
{
	struct state* state = gosh_alloc(*state);
	struct chargerdata* charger = gosh_alloc(*charger);
	state->data = charger;
	state->quitter = false;
	state->afficher = afficher_charger;
	state->mise_a_jour = mise_a_jour_charger;
	state->mousemotion = event_charger;
	state->mousebuttondown = event_charger;
	state->mousebuttonup = event_charger;
	state->keydown = event_charger;
	charger->parent = parent;
	charger->libere = false;
	state->destructeur = detruire_jouer;

	set_color(50, 50, 150);
	charger->titre = creer_label("Charger", W / 2, H * .1, CENTER_XY, BIG);
	set_color(200, 200, 200);
	int x = (W - W * .7) / 2;
	charger->saisir = creer_label("Saisir le nom de la partie :", x + 10, H * .3, LEFT, NORMAL);

	set_color(250, 20, 20);
	charger->erreur = creer_label("Impossible de charger la partie !", W * .5, H * .5, CENTER_XY, NORMAL);
	charger->erreur->visible = false;

	set_color(100, 100, 100);
	charger->nom_partie = creer_textinput(x + 200, H * .4, 200, 25, 16);

	struct bouton* bouton;

	set_color(50, 250, 50);
	bouton = creer_bouton("Charger", W * .6, H * .7, 100, 30);
	bouton->callback = charger_bouton_charger;
	bouton->userdata = state;
	charger->boutons[0] = bouton;

	set_color(155, 50, 50);
	bouton = creer_bouton("Retour", W * .1, H * .9, 100, 30);
	bouton->callback = charger_bouton_retour;
	bouton->userdata = state;
	charger->boutons[1] = bouton;

	charger->shake = false;

	return state;
}

void detruire_charger(struct state* state)
{
	struct chargerdata* charger = state->data;
	detruire_label(charger->titre);
	detruire_label(charger->saisir);
	detruire_label(charger->erreur);
	detruire_textinput(charger->nom_partie);
	for (int i = 0; i < NUM_BOUTONS; i++) {
		struct bouton* b = charger->boutons[i];
		detruire_bouton(b);
	}
	gosh_free(state->data);
	gosh_free(state);
}

static void afficher_charger(struct state* state, SDL_Surface* surface)
{
	struct chargerdata* charger = state->data;
	set_color(50, 50, 50);
	draw_rect(surface, (W - W * .7) / 2, H * .2, W * .7, H * .6);
	afficher_label(surface, charger->titre);
	afficher_label(surface, charger->saisir);
	afficher_label(surface, charger->erreur);
	afficher_textinput(surface, charger->nom_partie);
	for (int i = 0; i < NUM_BOUTONS; i++) {
		struct bouton* b = charger->boutons[i];
		afficher_bouton(surface, b);
	}
}

static void mise_a_jour_charger(struct state* state, double dt)
{
	struct chargerdata* charger = state->data;
	mise_a_jour_textinput(charger->nom_partie, dt);
	for (int i = 0; i < NUM_BOUTONS; i++)
		mise_a_jour_bouton(charger->boutons[i], dt);
	if (charger->shake) {
		float offset;
		offset = ((float)rand() / RAND_MAX) * 11 - 5;
		charger->erreur->x = W * .5 + offset;
		offset = ((float)rand() / RAND_MAX) * 11 - 5;
		charger->erreur->y = H * .5 + offset;
		// shake durera en moyenne une seconde
		if ((float)rand() / RAND_MAX < dt) {
			charger->shake = false;
		}
	}
}

static void event_charger(struct state* state, SDL_Event event)
{
	struct chargerdata* charger = state->data;
	utiliser_event_textinput(charger->nom_partie, event);
	if (charger->nom_partie->active) {
		charger->erreur->visible = false;
		charger->shake = false;
	}
	for (int i = 0; i < NUM_BOUTONS; i++) {
		struct bouton* b = charger->boutons[i];
		utiliser_event_bouton(b, event);
	}
	if (charger->libere) {
		detruire_charger(state);
	}
}

static void charger_bouton_retour(struct bouton* bouton, void * data)
{
	(void) bouton;
	struct state* state = data;
	struct chargerdata* charger = state->data;
	set_state(charger->parent);
	detruire_charger(state);
}

static void charger_bouton_charger(struct bouton* bouton, void * data)
{
	(void) bouton;
	struct state* state = data;
	struct chargerdata* charger = state->data;
	Partie partie = charger_partie_fichier(charger->nom_partie->buffer);
	if (partie != NULL) {
		struct state* jeu = creer_jouer(charger->parent, partie);
		set_state(jeu);
		charger->libere = true;
	} else {
		charger->erreur->visible = true;
		charger->shake = true;
	}
}


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

/** @file menu.c
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup sdl
 *  @brief Implémente les fonctionnalités liées aux menus
 */

#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <assert.h>

#include <SDL/SDL.h>

#include "gosh_alloc.h"
#include "go/partie.h"
#include "go/plateau.h"
#include "go/ordinateur.h"
#include "sdl/state.h"
#include "sdl/tools.h"
#include "sdl/bouton.h"
#include "sdl/label.h"
#include "sdl/radio.h"
#include "sdl/textinput.h"
#include "sdl/main.h"
#include "sdl/charger.h"
#include "sdl/tutoriel.h"
#include "sdl/jouer.h"
#include "sdl/menu.h"

/*
					Gosh

	Type joueur 1: o humain  o ordinateur
		Nom: [|    ]
	(si ordi): Programme: o aléatoire  o gnugo

	Type joueur 2: o humain  o ordinateur
		Nom: [|    ]
	(si ordi): Programme: o aléatoire  o gnugo

	Taille: o 9  o 13  o 19
	Handicap: [|  ]

						[Jouer]

	[Quitter]		[Tutoriel] 		[Charger]
*/

/** @brief Indice du groupe radio correspondant au type du joueur 1 */
#define GROUPE_TYPE_J1 0
/** @brief Indice du groupe radio correspondant au programme du joueur 1 */
#define GROUPE_PROGRAMME_J1 1
/** @brief Indice du groupe radio correspondant au type du joueur 2 */
#define GROUPE_TYPE_J2 2
/** @brief Indice du groupe radio correspondant au programme du joueur 2 */
#define GROUPE_PROGRAMME_J2 3
/** @brief Indice du groupe radio correspondant à la taille du Goban */
#define GROUPE_TAILLE 4

#define NUM_BOUTONS 4
#define NUM_LABELS 8
#define NUM_GROUPES 5
#define NUM_TEXTINPUTS 3


/** @ingroup sdl
 *  @brief Donne les données du menu
 */
struct menudata {
	/** @brief Titre du menu */
	struct label* titre;
	/** @brief Labels du menu */
	struct label* labels[NUM_LABELS];
	/** @brief Boutons du menu */
	struct bouton* boutons[NUM_BOUTONS];
	/** @brief Groupe de boutons radio du menu */
	struct groupe_radio* groupes[NUM_GROUPES];
	/** @brief Zones de textes du menu */
	struct textinput* textinputs[NUM_TEXTINPUTS];
};

/** @ingroup sdl
 *  @brief Dessine le menu sur une texture
 *  @param Menu à dessiner ?
 *  @param Texture sur laquelle dessiner le menu
 */
static void afficher_menu(struct state*, SDL_Surface*);

/** @ingroup sdl
 *  @brief Traite un événement SDL
 *  @param État courant
 *  @param événement sdl
 */
static void event_menu(struct state*, SDL_Event);

/** @ingroup sdl
 *  @brief Met à jour le menu
 *  @param Menu à mettre à jour
 *  @param Temps passé depuis la dernière mise à jour
 */
static void mise_a_jour_menu(struct state *, double);

/** @ingroup sdl
 *  @brief Quitte le programme
 */
static void menu_bouton_quitter(struct bouton*, void *);
/** @ingroup sdl
 *  @brief Entre dans l'écran de jeu
 */
static void menu_bouton_jouer(struct bouton*, void *);
/** @ingroup sdl
 *  @brief Entre dans le menu "charger une partie"
 */
static void menu_bouton_charger(struct bouton*, void *);
/** @ingroup sdl
 *  @brief Entre dans le "tutoriel"
 */
static void menu_bouton_tutoriel(struct bouton*, void *);
/** @ingroup sdl
 *  @brief Appelé lorsque l'utilisateur coche une case
 */
static void menu_radio_type_joueur(struct groupe_radio*, void*);

struct state* creer_menu()
{
	struct state* state = gosh_alloc(*state);
	struct menudata* menu = gosh_alloc(*menu);
	state->data = menu;
	state->quitter = false;
	state->afficher = afficher_menu;
	state->mousemotion = event_menu;
	state->mousebuttondown = event_menu;
	state->mousebuttonup = event_menu;
	state->keydown = event_menu;
	state->mise_a_jour = mise_a_jour_menu;
	state->destructeur = detruire_menu;

	set_color(200, 50, 50);
	menu->titre = creer_label("Gosh", W / 2, H * .1, CENTER_XY, BIG);

	int id_groupe = 0;
	int id_label = 0;
	int id_bouton = 0;
	int id_textinput = 0;

	set_color(255, 10, 10);
	struct bouton* bouton = creer_bouton("Quitter", W * .1, H * .9, 100, 30);
	bouton->callback = menu_bouton_quitter;
	bouton->userdata = state;
	menu->boutons[id_bouton++] = bouton;

	set_color(10, 200, 10);
	bouton = creer_bouton("Jouer", W * .6, H * .7, 100, 30);
	bouton->callback = menu_bouton_jouer;
	bouton->userdata = state;
	menu->boutons[id_bouton++] = bouton;

	set_color(50, 50, 200);
	bouton = creer_bouton("Charger", W * .7, H * .9, 100, 30);
	bouton->callback = menu_bouton_charger;
	bouton->userdata = state;
	menu->boutons[id_bouton++] = bouton;

	set_color(50, 200, 200);
	bouton = creer_bouton("Tutoriel", W * .5, H * .9, 100, 30);
	bouton->callback = menu_bouton_tutoriel;
	bouton->userdata = state;
	menu->boutons[id_bouton++] = bouton;

	set_color(255, 255, 255);

	int initx = (W - W * .7) / 2 + 20;
	int y = H * .2 + 20;

	int x = initx;
	//
	// joueur 1
	//
	// choix du type de joueur
	menu->labels[id_label] = creer_label("Joueur noir :", x, y, LEFT, NORMAL);
	x += menu->labels[id_label]->w + 50;
	id_label++;
	struct groupe_radio* groupe_type_j1 = creer_groupe_radio(2);
	groupe_radio_ajouter(groupe_type_j1, "Humain", x, y);
	groupe_radio_ajouter(groupe_type_j1, "Ordinateur", x + 100, y);
	groupe_type_j1->callback = menu_radio_type_joueur;
	groupe_type_j1->userdata = state;
	menu->groupes[id_groupe++] = groupe_type_j1;

	x = initx;
	y += 30;
	menu->labels[id_label++] = creer_label("Nom :", x, y, LEFT, NORMAL);
	set_color(150, 150, 150);
	menu->textinputs[id_textinput] = creer_textinput(x + 80, y, 300, 20, TAILLE_NOM_JOUEUR);
	id_textinput++;
	set_color(255, 255, 255);

	// (si ordinateur) choix du programme
	y += 30;
	menu->labels[id_label] = creer_label("Programme :", x, y, LEFT, NORMAL);
	menu->labels[id_label]->visible = false;
	x += menu->labels[id_label]->w + 50;
	id_label++;
#ifndef EMSCRIPTEN
	struct groupe_radio* groupe_programme_j1 = creer_groupe_radio(2);
	groupe_radio_ajouter(groupe_programme_j1, "GNU Go", x, y);
	groupe_radio_ajouter(groupe_programme_j1, "Aléatoire", x + 100, y);
#else
	struct groupe_radio* groupe_programme_j1 = creer_groupe_radio(1);
	groupe_radio_ajouter(groupe_programme_j1, "Aléatoire", x + 100, y);
#endif
	groupe_programme_j1->visible = false;
	menu->groupes[id_groupe++] = groupe_programme_j1;

	x = initx;
	y += 30 * 2;

	//
	// joueur 2
	//
	// choix du type de joueur
	menu->labels[id_label] = creer_label("Joueur blanc :", x, y, LEFT, NORMAL);
	x += menu->labels[id_label]->w + 50;
	id_label++;
	struct groupe_radio* groupe_type_j2 = creer_groupe_radio(2);
	groupe_radio_ajouter(groupe_type_j2, "Humain", x, y);
	groupe_radio_ajouter(groupe_type_j2, "Ordinateur", x + 100, y);
	groupe_type_j2->callback = menu_radio_type_joueur;
	groupe_type_j2->userdata = state;
	menu->groupes[id_groupe++] = groupe_type_j2;

	x = initx;
	y += 30;
	menu->labels[id_label++] = creer_label("Nom :", x, y, LEFT, NORMAL);
	set_color(150, 150, 150);
	menu->textinputs[id_textinput] = creer_textinput(x + 80, y, 300, 20, TAILLE_NOM_JOUEUR);
	id_textinput++;
	set_color(255, 255, 255);

	// (si ordinateur) choix du programme
	y += 30;
	menu->labels[id_label] = creer_label("Programme :", x, y, LEFT, NORMAL);
	menu->labels[id_label]->visible = false;
	x += menu->labels[id_label]->w + 50;
	id_label++;
#ifndef EMSCRIPTEN
	struct groupe_radio* groupe_programme_j2 = creer_groupe_radio(2);
	groupe_radio_ajouter(groupe_programme_j2, "GNU Go", x, y);
	groupe_radio_ajouter(groupe_programme_j2, "Aléatoire", x + 100, y);
#else
	struct groupe_radio* groupe_programme_j2 = creer_groupe_radio(1);
	groupe_radio_ajouter(groupe_programme_j2, "Aléatoire", x + 100, y);
#endif
	groupe_programme_j2->visible = false;
	menu->groupes[id_groupe++] = groupe_programme_j2;

	x = initx;
	y += 30 * 2;

	// taille du plateau
	menu->labels[id_label] = creer_label("Taille :", x, y, LEFT, NORMAL);
	x += menu->labels[id_label]->w + 50;
	id_label++;
	struct groupe_radio* groupe_taille = creer_groupe_radio(3);
	groupe_radio_ajouter(groupe_taille, "9x9", x, y);
	groupe_radio_ajouter(groupe_taille, "13x13", x + 100, y);
	groupe_radio_ajouter(groupe_taille, "19x19", x + 200, y);
	menu->groupes[id_groupe++] = groupe_taille;

	x = initx;
	y += 30;

	// handicap
	menu->labels[id_label] = creer_label("Handicap :", x, y, LEFT, NORMAL);
	x += menu->labels[id_label]->w + 20;
	id_label++;
	set_color(150, 150, 150);
	menu->textinputs[id_textinput] = creer_textinput(x, y, 60, 20, 3);
	id_textinput++;

	assert(id_label == NUM_LABELS);
	assert(id_bouton == NUM_BOUTONS);
	assert(id_groupe == NUM_GROUPES);
	assert(id_textinput == NUM_TEXTINPUTS);
	return state;
}

void detruire_menu(struct state* state)
{
	struct menudata* menu = state->data;
	detruire_label(menu->titre);
	for (int i = 0; i < NUM_LABELS; i++) {
		struct label* l = menu->labels[i];
		detruire_label(l);
	}
	for (int i = 0; i < NUM_BOUTONS; i++) {
		struct bouton* b = menu->boutons[i];
		detruire_bouton(b);
	}
	for (int i = 0; i < NUM_GROUPES; i++) {
		struct groupe_radio* g = menu->groupes[i];
		detruire_groupe_radio(g);
	}
	for (int i = 0; i < NUM_TEXTINPUTS; i++) {
		struct textinput* ti = menu->textinputs[i];
		detruire_textinput(ti);
	}
	gosh_free(menu);
	gosh_free(state);
}

void afficher_menu(struct state* state, SDL_Surface* surface)
{
	struct menudata* menu = state->data;
	afficher_label(surface, menu->titre);
	set_color(50, 50, 50);
	draw_rect(surface, (W - W * .7) / 2, H * .2, W * .7, H * .6);
	for (int i = 0; i < NUM_LABELS; i++) {
		struct label* l = menu->labels[i];
		afficher_label(surface, l);
	}
	for (int i = 0; i < NUM_BOUTONS; i++) {
		struct bouton* b = menu->boutons[i];
		afficher_bouton(surface, b);
	}
	for (int i = 0; i < NUM_GROUPES; i++) {
		struct groupe_radio* g = menu->groupes[i];
		afficher_groupe_radio(surface, g);
	}
	for (int i = 0; i < NUM_TEXTINPUTS; i++) {
		struct textinput* ti = menu->textinputs[i];
		afficher_textinput(surface, ti);
	}
}

static void event_menu(struct state* state, SDL_Event event)
{
	struct menudata* menu = state->data;
	for (int i = 0; i < NUM_BOUTONS; i++) {
		struct bouton* b = menu->boutons[i];
		utiliser_event_bouton(b, event);
	}
	for (int i = 0; i < NUM_GROUPES; i++) {
		struct groupe_radio* g = menu->groupes[i];
		utiliser_event_groupe_radio(g, event);
	}
	for (int i = 0; i < NUM_TEXTINPUTS; i++) {
		struct textinput* ti = menu->textinputs[i];
		utiliser_event_textinput(ti, event);
	}
}

static void mise_a_jour_menu(struct state* state, double dt)
{
	struct menudata* menu = state->data;
	for (int i = 0; i < NUM_BOUTONS; i++) {
		struct bouton* b = menu->boutons[i];
		mise_a_jour_bouton(b, dt);
	}
	for (int i = 0; i < NUM_TEXTINPUTS; i++) {
		struct textinput* ti = menu->textinputs[i];
		mise_a_jour_textinput(ti, dt);
	}
}

static void menu_bouton_quitter(struct bouton* bouton, void * data)
{
	(void) bouton;
	struct state* state = data;
	state->quitter = true;
}

static bool construction_function(enum Question question, Partie partie, void* userdata)
{
	struct menudata* menu = userdata;
	switch (question) {
		case TYPE_JOUEUR_BLANC:
			partie->joueurs[JOUEUR_BLANC].type = menu->groupes[GROUPE_TYPE_J2]->courante == 0 ? HUMAIN : ORDINATEUR;
			break;
		case NOM_JOUEUR_BLANC:
			strcpy(partie->joueurs[JOUEUR_BLANC].nom, menu->textinputs[1]->buffer);
			break;
		case PROGRAMME_JOUEUR_BLANC:
			partie->joueurs[JOUEUR_BLANC].ordinateur = charger_ordinateur(
					menu->groupes[GROUPE_PROGRAMME_J2]->courante == 0 ? "gnugo" : "random");
			return partie->joueurs[JOUEUR_BLANC].ordinateur != NULL;
		case TYPE_JOUEUR_NOIR:
			partie->joueurs[JOUEUR_NOIR].type = menu->groupes[GROUPE_TYPE_J1]->courante == 0 ? HUMAIN : ORDINATEUR;
			break;
		case NOM_JOUEUR_NOIR:
			strcpy(partie->joueurs[JOUEUR_NOIR].nom, menu->textinputs[0]->buffer);
			break;
		case PROGRAMME_JOUEUR_NOIR:
			return partie->joueurs[JOUEUR_NOIR].ordinateur != NULL;

		case TAILLE_PLATEAU: {
			int id = menu->groupes[NUM_GROUPES - 1]->courante;
			int taille = id == 0 ? 9 : id == 1 ? 13 : 19;
			partie->plateau = creer_plateau(taille);
			break;
		}
		case HANDICAP: {
			int handicap = atoi(menu->textinputs[NUM_TEXTINPUTS - 1]->buffer);
			partie->handicap = handicap;
			break;
			default :
				break;
			}
	}
	return true;
}
static void menu_bouton_jouer(struct bouton* bouton, void * data)
{
	(void) bouton;
	struct state* state = data;
	struct menudata* menu = state->data;

	Partie partie = creer_partie();
	initialisation_partie(partie, construction_function, menu);
	if (partie->initialisee) {
		struct state* new_state = creer_jouer(state, partie);
		set_state(new_state);
	} else {
		detruire_partie(partie);
	}
}

static void menu_bouton_charger(struct bouton* bouton, void * data)
{
	(void) bouton;
	struct state* state = data;
	struct state* new_state = creer_charger(state);
	set_state(new_state);
}

static void menu_bouton_tutoriel(struct bouton* bouton, void * data)
{
	(void) bouton;
	struct state* state = data;
	struct state* new_state = creer_tutoriel(state);
	set_state(new_state);
}

static void menu_radio_type_joueur(struct groupe_radio* groupe, void* data)
{
	struct state* state = data;
	struct menudata* menu = state->data;
	int groupe_prog;
	int label;
	if (groupe == menu->groupes[0]) { // joueur noir
		groupe_prog = GROUPE_PROGRAMME_J1;
		label = 2;
	} else { // joueur blanc
		groupe_prog = GROUPE_PROGRAMME_J2;
		label = 5;
	}
	if (groupe->courante == 0) { // humain
		menu->groupes[groupe_prog]->visible = false; // choix type ordi
		menu->labels[label]->visible = false;
	} else {
		menu->groupes[groupe_prog]->visible = true;
		menu->labels[label]->visible = true;
	}
}


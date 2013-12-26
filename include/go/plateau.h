/* Copyright © 2013 Jérémy Anger, Denis Migdal
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
#ifndef GOSH_GO_PLATEAU
#define GOSH_GO_PLATEAU

#include <stdlib.h> // size_t
#include <stdbool.h>

#include "go/plateau_type.h"

#include "go/couleur.h"
#include "go/position.h"
#include "go/pion.h"
#include "go/chaines.h"
#include "go/chaine.h"
#include "go/territoire.h"

Plateau creer_plateau(size_t taille);
void detruire_plateau(Plateau plateau);

Couleur plateau_get(Plateau plateau, int i, int j);
Couleur plateau_get_at(Plateau plateau, Position pos);
void plateau_set(Plateau plateau, int i, int j, Couleur couleur);

size_t plateau_get_taille(Plateau plateau);

/** @brief Produit la chaîne à laquelle appartient le pion à la position pos sur le plateau. S’il n’y a pas de pion sur cette case, alors le résultat retourné est NULL */
Chaine plateau_determiner_chaine(Plateau plateau, Position pos);

// TODO: à tester
/** @brief Réalise la capture des pions correspondant à la chaine en les enlevant du plateau. */
void plateau_realiser_capture(Plateau plateau, Chaine chaine);

// TODO: à tester
/** @brief indique si l’organisation du plateau est identique à une précédente organisation de plateau. */
bool plateau_est_identique(Plateau plateau, Plateau ancienPlateau);

// TODO: à tester
/** @brief Copie un plateau. Les deux tableaux sont supposé ́être déjà alloués */
void plateau_copie(Plateau from, Plateau to);

// TODO: à tester
/** @brief Détermine la ou les chaines entourant un territoire */
Chaines plateau_entoure_un_territoire(Plateau plateau, Territoire territoire);

/** @brief en fonction de la position du pion et de sa couleur retourne les chaines capturées.
 * Si aucune chaîne n’est capturée par la pose du pion, alors la valeur NULL est retournée.
 * Le booléan (référencé par) valide est égal à false si le fait de placer le point en cette position
 * conduit à contruire une chaîne sans libertée de la couleur du pion (sauf si ce coup produit la capture d’au moins une chaîne adverse).
 * Dans le cas contraire valide est égal à true. */
Chaines plateau_capture_chaines(Plateau plateau, s_Pion pion, bool* valide);

#endif

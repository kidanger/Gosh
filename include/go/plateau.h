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
#ifndef GOSH_GO_PLATEAU
#define GOSH_GO_PLATEAU

/** @file plateau.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 *  @brief Déclare toutes les fonctions permettant de manipuler un plateau
 */

#include <stdlib.h> // size_t
#include <stdbool.h>
#include <stdint.h>

#include "go/plateau_type.h"

#include "go/couleur.h"
#include "go/pion.h"
#include "go/chaines.h"
#include "go/chaine.h"
#include "go/territoire.h"

/** @ingroup go
 *  @brief Crée un plateau
 *  @param taille du plateau
 *  @return Plateau ainsi crée
 */
Plateau creer_plateau(int taille);

/** @ingroup go
 *  @brief Détruit un plateau
 *  @param plateau à détruire
 */
void detruire_plateau(Plateau plateau);

/** @ingroup go
 *  @brief Retourne la couleur présente à une position du plateau
 *  @param Plateau à tester
 *  @param abscisce de la position à tester
 *  @param ordonné de la position à tester
 *  @return Couleur présente à la position testée
 */
Couleur plateau_get(Plateau plateau, int i, int j);

/** @ingroup go
 *  @brief Retourne la couleur présente à une position du plateau
 *  @param Plateau à tester
 *  @param position à tester
 *  @return Couleur présente à la position testée
 */
Couleur plateau_get_at(Plateau plateau, Position pos);

/** @ingroup go
 *  @brief Place un pion sur le plateau
 *  @param Plateau surlequel placer le pion
 *  @param abscisce de la position sur lequel placer le pion
 *  @param ordonné de la position sur lequel placer le pion
 *  @param Couleur du pion à placer
 */
void plateau_set(Plateau plateau, int i, int j, Couleur couleur);


/** @ingroup go
 *  @brief Place un pion sur le plateau
 *  @param Plateau surlequel placer le pion
 *  @param position sur lequel placer le pion
 *  @param Couleur du pion à placer
 */
void plateau_set_at(Plateau plateau, Position pos, Couleur couleur);

/** @ingroup go
 *  @brief Retourne la taille du plateau
 *  @param plateau à tester
 *  @return taille du plateau
 */
int plateau_get_taille(Plateau plateau);

/** @ingroup go
 *  @brief Produit la chaîne à laquelle appartient le pion à la position pos sur le plateau.
 *
 *  S’il n’y a pas de pion sur cette case, alors le résultat retourné est NULL.
 *  @param Plateau à tester
 *  @param position
 *  @return chaine composée du pion à la position pos
 */
Chaine plateau_determiner_chaine(Plateau plateau, Position pos);

/** @ingroup go
 *  @brief Réalise la capture des pions correspondant à la chaine en les enlevant du plateau.
 *  @param Plateau courrant
 *  @param Chaine à capturer
 */
void plateau_realiser_capture(Plateau plateau, Chaine chaine);

/** @ingroup go
 *  @brief indique si l’organisation du plateau est identique à une précédente organisation de plateau.
 *  @param plateau à tester
 *  @param second plateau à tester
 *  @return vrai si les deux plateaux sont identiques
 */
bool plateau_est_identique(Plateau plateau, Plateau ancienPlateau);

/** @ingroup go
 *  @brief Copie un plateau. Les deux tableaux sont supposé ́être déjà alloués
 *  @param plateau à copier
 *  @param plateau ainsi crée
 */
void plateau_copie(Plateau from, Plateau to);


/** @ingroup go
 *  @brief Copie un plateau.
 *  @param plateau à copier
 *  @return plateau ainsi crée
 */
Plateau plateau_clone(Plateau from);

/** @ingroup go
 *  @brief Détermine la ou les chaines entourant un territoire
 *  @param plateau courrant
 *  @param Territoire
 *  @return Chaines entourant le territoire
 */
Chaines plateau_entoure_un_territoire(Plateau plateau, Territoire territoire);

/** @ingroup go
 *  @brief en fonction de la position du pion et de sa couleur retourne les chaines capturées.
 *
 *  Si aucune chaîne n’est capturée par la pose du pion, alors la valeur NULL est retournée.
 *  Le booléan (référencé par) valide est égal à false si le fait de placer le point en cette position
 *  conduit à contruire une chaîne sans libertée de la couleur du pion (sauf si ce coup produit la capture
 *  d’au moins une chaîne adverse).
 *  Dans le cas contraire valide est égal à true.
 *  @param plateau courrant
 *  @param pion à poser
 *  @param mis à false en cas d'erreur
 *  @return chaines à capturer
 */
Chaines plateau_capture_chaines(Plateau plateau, s_Pion pion, bool* valide);

/** @ingroup go
 *  @brief Donne les données du plateau pour une sérialisation de ce dernier
 *  @param Plateau dont on veut récupérer les données
 *  @return données du plateau
 */
const uint32_t * plateau_data(Plateau p);

/** @ingroup go
 *  @brief Charge un plateau à partir des données sérialisée.
 *  @param plateau à charger
 *  @param données à désérialiser
 */
void plateau_load_data(Plateau plateau, const uint32_t * data);

/** @ingroup go
 *  @brief Donne la taille des données du plateau
 *  @param taille du plateau
 *  @return taille des données du plateau
 */
size_t plateau_data_size(size_t taille);

#endif

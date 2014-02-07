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
#ifndef GOSH_FOREACH_H
#define GOSH_FOREACH_H

/** @defgroup outils
 *  @brief Défini un ensemble d'outils, principalement d'allocation et de manipulation de containers.
 */

/** @file gosh_macros.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup outils
 *  @brief Défini principalement les macros utiles à la manipulation des containers.
 */


/** @ingroup outils
 *  @brief Itérateur.
 *
 *  Un itérateur est une sorte de pointeur vers un élément d'un container permettant de parcourrir ce dernier.
 */
typedef struct {
    /** @brief Donnee permettant d'identifier vers quel élément du container pointe l'itérateur. */
	void * m_pos;
} GoshIterateur;


/** @def CREATE_ITERATOR(CONTAINER)
 *  @ingroup outils
 *  @brief Retourne un itérateur sur le premier élément du container.
 */
#define CREATE_ITERATOR(CONTAINER) (CONTAINER)->create_iterator()


/** @def gosh_foreach(ELEMENT, CONTAINER)
 *  @ingroup outils
 *  @brief Parcours le container.
 *
 *  Fonctionne de la même manière que for(element : container) en C++11.
 *  @note ELEMENT doit être une variable préalablement définie.
 */
#define gosh_foreach(ELEMENT, CONTAINER) \
	for ( GoshIterateur it = (CONTAINER)->createIterateur(); \
	        (CONTAINER)->next(&it, (CONTAINER), &(ELEMENT) ) ; \
	    )


/** @def gosh_foreach_ptr(ELEMENT, CONTAINER)
 *  @ingroup outils
 *  @brief Parcours le container.
 *
 *  Fonctionne de manière similaire à for(element & : container) en C++11.
 *  Ici, nous utilisons un pointeur au lieu d'une référence.
 *  @note ELEMENT doit être une variable préalablement définie.
 */
#define gosh_foreach_ptr(ELEMENT, CONTAINER) \
	for ( GoshIterateur it = (CONTAINER)->createIterateur(); \
	        (ELEMENT) = (CONTAINER)->next(&it, (CONTAINER), NULL ) ; \
	    )


/** @def gosh_appartient(CONTAINER, ELEMENT)
 *  @ingroup outils
 *  @brief Returne true si ELEMENT appartient à CONTAINER.
 *
 */
#define gosh_appartient(CONTAINER, ELEMENT) \
	(CONTAINER)->appartient( (CONTAINER), (ELEMENT) )


/** @def gosh_vide(CONTAINER)
 *  @ingroup outils
 *  @brief Returne true si CONTAINER est vide.
 *
 */
#define gosh_vide(CONTAINER) \
	(CONTAINER)->vide( (CONTAINER) )


/** @def gosh_ajouter(CONTAINER, ELEMENT)
 *  @ingroup outils
 *  @brief Ajoute l'élément ELEMENT à CONTAINER.
 */
#define gosh_ajouter(CONTAINER, ELEMENT) \
	(CONTAINER)->ajouter( (CONTAINER), (ELEMENT) )


/** @def gosh_supprimer_tete(CONTAINER)
 *  @ingroup outils
 *  @brief Supprime l'élément en tête de CONTAINER et retourne l'élément supprimé.
 */
#define gosh_supprimer_tete(CONTAINER) \
	(CONTAINER)->supprimer_tete( (CONTAINER) )


/** @def gosh_reserve(CONTAINER, SIZE)
 *  @ingroup outils
 *  @brief Réserve SIZE élément dans CONTAINER.
 */
#define gosh_reserve(CONTAINER, SIZE) \
	(CONTAINER)->reserve( (SIZE) )


/** @def gosh_nombre_elements(CONTAINER)
 *  @ingroup outils
 *  @brief Retourne le nombre d'éléments contenus dans CONTAINER.
 */
#define gosh_nombre_elements(CONTAINER) \
	(CONTAINER)->nombre_elements( (CONTAINER) )


/** @def gosh_get(CONTAINER, N)
 *  @ingroup outils
 *  @brief Retourne le N ième élément de CONTAINER.
 */
#define gosh_get(CONTAINER, N) \
	(CONTAINER)->get( (CONTAINER), (N) )


/** @def gosh_debug(str, ...)
 *  @ingroup outils
 *  @brief Affiche un message de debug si NDEBUG est défini.
 */
#ifndef NDEBUG
#include <stdio.h>
#define gosh_debug(str, ...) printf("[%s:%d]\t" str "\n", __FILE__, __LINE__, ##__VA_ARGS__)
#else
#define gosh_debug(str, ...)
#endif

#endif // GOSH_FOREACH_H

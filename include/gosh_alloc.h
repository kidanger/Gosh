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
#ifndef GOSH_ALLOC
#define GOSH_ALLOC

/** @file gosh_alloc.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup outils
 *  @brief Défini des fonctions d'allocations/libérations de la mémoire.
 */

#include <stdlib.h> // size_t


/** @def gosh_alloc(TYPE)
 *  @ingroup outils
 *  @brief Alloue un espace mémoire permettant de stocker un TYPE.
 *
 *  Retourne un pointeur sur l'espace mémoire allouée.
 */
#define gosh_alloc(TYPE) gosh_alloc_size(sizeof(TYPE))


/** @def gosh_alloc(TYPE)
 *  @ingroup outils
 *  @brief Alloue un espace mémoire permettant de stocker N fois un TYPE.
 *
 *  Retourne un pointeur sur l'espace mémoire allouée.
 */
#define gosh_allocn(TYPE, N) gosh_alloc_size((N) * sizeof(TYPE))


/** @def gosh_realloc(OLD_PTR, TYPE)
 *  @ingroup outils
 *  @brief Realloue un espace mémoire permettant de stocker un TYPE.
 *
 *  OLD_PTR est un pointeur sur l'ancien espace mémoire alloué.
 *  gosh_realloc retourne un pointeur sur l'espace mémoire.
 *  @warning OLD_PTR ne doit plus être utilisé par la suite.
 */
#define gosh_realloc(OLD_PTR, TYPE) gosh_realloc_size( (OLD_PTR), sizeof(TYPE) )


/** @def gosh_alloc(TYPE)
 *  @ingroup outils
 *  @brief Realloue un espace mémoire permettant de stocker N fois un TYPE.
 *
 *  OLD_PTR est un pointeur sur l'ancien espace mémoire alloué.
 *  gosh_reallocn retourne un pointeur sur l'espace mémoire.
 *  @warning OLD_PTR ne doit plus être utilisé par la suite.
 */
#define gosh_reallocn(OLD_PTR, TYPE, N) gosh_realloc_size( (OLD_PTR), sizeof(TYPE)*(N) )


/** @ingroup outils
 *  @brief Alloue un espace mémoire
 *  @note utilisez gosh_alloc et gosh_allocn à la place.
 *  @param Taille du nouvel espace mémoire.
 *  @return Pointeur sur l'espace mémoire alloué.
 */
void* gosh_alloc_size(size_t size);


/** @ingroup outils
 *  @brief Libère un espace mémoire
 *  @param Pointeur sur l'espace mémoire à libérer
 *  @warning N'utilisez plus le pointeur passé en paramètre, l'espace mémoire a été libérée.
 */
void gosh_free(void* ptr);


/** @ingroup outils
 *  @brief Réalloue un espace mémoire.
 *  @param Pointeur sur l'ancien espace mémoire.
 *  @param Taille du nouvel espace mémoire.
 *  @return Pointeur sur l'espace mémoire alloué.
 *  @warning N'utilisez plus le pointeur passé en paramètre, il est possible que l'espace mémoire ai été libérée.
 */
void * gosh_realloc_size(void * ptr, size_t size);


#endif

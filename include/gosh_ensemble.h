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

/** @file gosh_ensemble.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup outils
 *  @brief Défini un ensemble contenant des objets de type TYPE.
 *
 *  Un ensemble est un container implémenté sous forme de liste.
 *  Pour utiliser cet header, vous devez définir TYPE et TYPE_LOWER (nom du type en minuscule).
 */

#include <stdbool.h>
#include "concat.h"
#include "gosh_macros.h"

#ifndef TYPE
#error "TYPE non défini"
#endif
#ifndef TYPE_LOWER
#error "TYPE_LOWER non défini"
#endif


/** @def CONTAINER_NAME
 *  @ingroup outils
 *  @brief Type du container
 */
#define CONTAINER_NAME CONCAT_2(Ensemble, TYPE)


/** @def NODE_NAME
 *  @ingroup outils
 *  @brief Type des noeuds utilisés par le container
 *  @note Vous n'avez pas à l'utiliser.
 */
#define NODE_NAME CONCAT_2 (Noeud, TYPE)


/** @def FUNC_NAME(name)
 *  @ingroup outils
 *  @brief Donne le nom d'une fonction permettant de manipuler le container.
 *  @note Vous n'avez pas à l'utiliser.
 */
#define FUNC_NAME(name) CONCAT_3(ensemble_, TYPE_LOWER, _##name)


/** @def IPLM_CONTAINER_NAME
 *  @ingroup outils
 *  @brief Nom de la structure "interne" d'un ensemble.
 *  @note Vous n'avez pas à l'utiliser.
 */
#define IPLM_CONTAINER_NAME CONCAT_2(Impl, CONTAINER_NAME)


/** @def SCN
 *  @ingroup outils
 *  @brief Structure Container Name
 *  @note Vous n'avez pas à l'utiliser.
 */
#define SCN CONCAT_2(s_, CONTAINER_NAME)


/** @ingroup outils
 *  @brief Données de l'ensemble
 *  @note Vous n'avez pas d'accès direct à ces données.
 */
struct IMPL_CONTAINER_NAME;


/** @ingroup outils
 *  @brief Structure donnant les fonctionnalités offerte par l'ensemble.
 *  @note Utilisez les macro définies dans gosh_macros.h pour manipuler l'ensemble.
 */
struct SCN {
	/** @brief Permet d'incrémenter l'itérateur passé en paramètre. */
	TYPE * (* next)(GoshIterateur *, struct SCN *, TYPE *);
	/** @brief Créé un itérateur sur le premier élément */
	GoshIterateur(*createIterateur)(void);
	/** @brief Teste si l'ensemble est vide */
	bool (*vide)(struct SCN *);
	/** @brief Ajoute un élément à l'ensemble. */
	void (*ajouter)(struct SCN *, TYPE);
	/** @brief Indique si un élément appartient à l'ensemble. */
	bool (*appartient)(struct SCN *, TYPE);
	/** @brief Supprime l'élément en tête de l'ensemble. */
	TYPE(*supprimer_tete)(struct SCN *);
	/** @brief Retourne le nombre d'élément contenu dans l'ensemble */
	int(*nombre_elements)(struct SCN *);
	/** @brief Retourne le nième élément de l'ensemble */
	TYPE(*get)(struct SCN *, int n);

	/** @brief Données de l'ensemble */
	struct IMPL_CONTAINER_NAME * data;

};

/** @ingroup outils
 *  @brief Ensemble
 *
 *  Vous n'avez pas d'accès direct aux éléments de ce container.
 *  Utilisez les macros contenues dans gosh_macros.h pour manipuler le container.
 */
typedef struct SCN * CONTAINER_NAME;

// déclaration des fonctions

/** @ingroup outils
 *  @brief Crée un ensemble.
 *  @return Ensembre ainsi créé.
 */
CONTAINER_NAME CONCAT_2(creer_ensemble_, TYPE_LOWER)(void);

/** @ingroup outils
 *  @brief Detruit un ensemble
 *  @param ensemble à détruire.
 */
void CONCAT_2(detruire_ensemble_, TYPE_LOWER)(CONTAINER_NAME ensemble);

/** @ingroup outils
 *  @brief Incrémente un itérateur
 *  @param Itérateur à incrémenter
 *  @param Ensemble vers lequel point l'itérateur
 *  @param si non NULL, copie le nouvel élément pointé par l'itérateur après son incrémentation.
 *  @return pointeur sur le nouvel élément pointé par l'itérateur après son incrémentation.
 *  Retourne NULL si l'itérateur est arrivé à la fin de l'ensemble.
 */
TYPE * FUNC_NAME(next)(GoshIterateur *, CONTAINER_NAME, TYPE *);

/** @ingroup outils
 *  @brief Crée un itérateur sur le premier élément de l'ensemble.
 *  @return Itérateur ainsi crée */
GoshIterateur FUNC_NAME(createIterateur)(void);

/** @ingroup outils
 *  @brief Indique si l'ensemble est vide ou non
 *  @param Ensemble à tester
 *  @return vrai si l'ensemble est vide sinon retourne faux.
 */
bool FUNC_NAME(vide)(CONTAINER_NAME ensemble);


/** @ingroup outils
 *  @brief Ajoute un élément à l'ensemble.
 *  @param Ensemble auquel ajouter l'élément.
 *  @param Element à ajouter au container.
 */
void FUNC_NAME(ajouter)(CONTAINER_NAME ensemble, TYPE element);


/** @brief Supprimer l'élément en tête de l'ensemble.
 *  @param Ensemble dont on va supprimer l'élément en tête.
 *  @return valeur de l'élément supprimé.
 */
TYPE FUNC_NAME(supprimer_tete)(CONTAINER_NAME ensemble);


/** @ingroup outils
 *  @brief Indique si un élément appartient à l'ensemble ou non.
 *  @param Ensemble à tester
 *  @param Element à rechercher dans l'ensemble
 *  @return true si l'élément est trouvé dans le container sinon retourne false.
 */
bool FUNC_NAME(appartient)(CONTAINER_NAME ensemble, TYPE element);


/** @ingroup outils
 *  @brief Retourne le nombre d'élément de l'ensemble.
 *  @param Container à tester
 *  @return Nombre d'éléments de l'ensemble.
 */
int FUNC_NAME(nombre_elements)(CONTAINER_NAME ensemble);


/** @ingroup outils
 *  @brief Retourne un pointeur sur un élément de l'ensemble.
 *  @param Ensemble auquel appartient l'élément
 *  @param Numéro de l'élément à récupérer
 *  @todo Retourner un TYPE * au lieu d'un TYPE ?
 *  @return Element voulu
 */
TYPE FUNC_NAME(get)(CONTAINER_NAME ensemble, int n);

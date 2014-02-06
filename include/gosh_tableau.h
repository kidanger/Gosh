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

/** @file gosh_tableau.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup outils
 *  @brief Défini un container de type tableau dynamique.
 *
 *  TYPE (type stocké par le tableau) et TYPE_LOWER (TYPE en minuscules) doivent être définis.
 *  Utilisez les macro de gosh_macros.h pour le manipuler.
 */

#ifndef TYPE
#error "TYPE non défini"
#endif
#ifndef TYPE_LOWER
#error "TYPE_LOWER non défini"
#endif

#include <stdbool.h>
#include "concat.h"
#include "gosh_macros.h"

/** @def CONTAINER_NAME
 *  @ingroup outils
 *  @brief Type du container déclaré.
 */
#define CONTAINER_NAME CONCAT_2(DynamicTab, TYPE)


/** @def FUNC_NAME(name)
 *  @ingroup outils
 *  @brief Donne le nom d'une fonction permettant de manipuler le tableau.
 *  @note Vous n'avez pas à l'utiliser.
 */
#define FUNC_NAME(name) CONCAT_3(dynamicTab_, TYPE_LOWER, _##name)

/** @def IPLM_CONTAINER_NAME
 *  @ingroup outils
 *  @brief Type de la structure stockant les données du container.
 *  @note Vous n'avez pas à l'utiliser.
 */
#define IPLM_CONTAINER_NAME

/** @def SCN CONCAT_2(s_, CONTAINER_NAME)
 *  @ingroup outils
 *  @brief Type de la structure du container.
 *  @note Vous n'avez pas à l'utiliser.
 */
#define SCN CONCAT_2(s_, CONTAINER_NAME)

/** @ingroup outils
 *  @brief Structure stockant les données du container
 */
struct IMPL_CONTAINER_NAME;


/** @ingroup outils
 *  @brief structure du container.
 */
struct SCN {
    /** @brief Permet d'incrémenter l'itérateur */
	TYPE * (* next)(GoshIterateur *, struct SCN *, TYPE *);
    /** @brief Permet de créer un itérateur */
	GoshIterateur(*createIterateur)(void);
    /** @brief Permet de tester si le container est vide. */
	bool (*vide)(struct SCN *);
    /** @brief Permet d'ajouter un élément au container. */
	void (*ajouter)(struct SCN *, TYPE);
    /** @brief Permet de réserver size éléments dans le container. */
	void (*reserve)(struct SCN *, size_t size);
	//bool (*appartient)(struct SCN *, TYPE);
    /** @brief Supprime l'élément en tête du container. */
	TYPE(*supprimer_tete)(struct SCN *);

    /** @brief Données stockées par le container. */
	struct IMPL_CONTAINER_NAME * data;
};

/** @ingroup outils
 *  @brief Container.
 *  @note utilisez les macro de gosh_macros.h pour le manipuler.
 */
typedef SCN * CONTAINER_NAME;

// déclaration des fonctions

/** @ingroup outils
 *  @brief Crée un tableau
 *  @return Tableau créé.
 */
CONTAINER_NAME CONCAT_2(creer_tableau_, TYPE_LOWER)(void);

/** @ingroup outils
 *  @brief Détruit un tableau
 *  @param Tableau à détruire.
 *  @todo : modifier nom ?
 */
void CONCAT_2(detruire_tableau_, TYPE_LOWER)(CONTAINER_NAME tableau);


/** @ingroup outils
 *  @brief Incrémente un itérateur
 *  @param itérateur à incrémenter
 *  @param Tableau sur lequel pointe l'itérateur
 *  @param si non NULL copie le nouvel élément pointé par l'itérateur dans l'espace mémoire pointé par le pointeur.
 *  @return pointeur sur l'élément suivant ou NULL si l'itérateur ne pointe sur aucun élément.
 */
TYPE * FUNC_NAME(next)(GoshIterateur *, CONTAINER_NAME, TYPE *);

/** @ingroup outils
 *  @brief Créé un itérateur sur le premier élément
 *  @return Itérateur ainsi créé
 */
GoshIterateur FUNC_NAME(createIterateur)(void);


/** @ingroup outils
 *  @brief Teste si le tableau est vide.
 *  @return Vrai si le tableau est vide, faux sinon.
 */
bool FUNC_NAME(vide)(CONTAINER_NAME tableau);

/** @ingroup outils
 *  @brief Ajoute un élément en tête du tableau
 *  @param Tableau auquel ajouter l'élément
 *  @param Element à ajouter au tableau
 */
void FUNC_NAME(ajouter)(CONTAINER_NAME tableau, TYPE element);

/** @ingroup outils
 *  @brief Supprime l'élément en tête du tableau
 *  @param Tableau auquel supprimer l'élément en tête
 *  @return Valeur de l'élément en tête.
 */
TYPE FUNC_NAME(supprimer_tete)(CONTAINER_NAME tableau);


/** @ingroup outils
 *  @brief Indique si un élément appartient au tableau
 *  @param Tableau à tester
 *  @param Element à rechercher
 *  @return Vrai si l'élément appartient au tableau, faux sinon.
 */
bool FUNC_NAME(appartient)(CONTAINER_NAME tableau, TYPE element);

/** @ingroup outils
 *  @brief Réserve size éléments dans le tableau
 *  @param Tableau
 *  @param Nouvelle taille (en nombre d'élément)
 */
void FUNC_NAME(reserve)(CONTAINER_NAME tableau, size_t size);

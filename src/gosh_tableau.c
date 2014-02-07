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
#ifdef TYPE

struct IMPL_CONTAINER_NAME {
	TYPE * m_data;
	size_t m_size;
	size_t m_reservedSize;
};

GoshIterateur FUNC_NAME(createIterateur)(void)
{
	GoshIterateur it = {NULL};
	return it;
}

TYPE * FUNC_NAME(next)(GoshIterateur * it, CONTAINER_NAME container, TYPE* element)
{

	TYPE * ptrElement = NULL;
	if (! it->m_pos)
		it->m_pos = ptrElement = container->data->data;
	else if (++(TYPE *)it->m_pos - container->data->data >= container->data->m_size)
		it->m_pos = NULL;
	else
		ptrElement = (TYPE *)it->m_pos;


	if (element && ptrElement)
		*element = *ptrElement;

	return ptrElement;
}

CONTAINER_NAME CONCAT_2(creer_dynamicTab_, TYPE_LOWER)(void)
{
    CONTAINER_NAME ptrTableau = gosh_alloc(*ptrTableau);
    ptrTableau->data = gosh_alloc(*ptrTableau->data);
    struct IMPL_CONTAINER_NAME * Tableau = ptrTableau->data;
    Tableau->m_size = 0;
    Tableau->m_allocatedSize = 0;
    Tableau->m_data = NULL;

    ptrTableau->next = FUNC_NAME(next);
    ptrTableau->createIterateur = FUNC_NAME(createIterateur);
    ptrTableau->vide = FUNC_NAME(vide);
    ptrTableau->ajouter = FUNC_NAME(ajouter);
    ptrTableau->reserve = FUNC_NAME(reserve);
    //Tableau->appartient = FUNC_NAME(appartient);
    ptrTableau->supprimer_tete = FUNC_NAME(supprimer_tete);

    return ptrTableau;
}

void CONCAT_2(detruire_dynamicTab_, TYPE_LOWER)(CONTAINER_NAME tableau)
{
    gosh_free(tableau->data->m_data);
    gosh_free(tableau->data);
    gosh_free(tableau);
}

bool FUNC_NAME(vide)(CONTAINER_NAME tableau)
{
    return  ! tableau->data->m_data || ! tableau->data->size_t;
}

void FUNC_NAME(reserve)(CONTAINER_NAME ptrtableau, size_t size)
{
    struct IMPL_CONTAINER_NAME * tableau = ptrtableau->data;

    if (tableau->m_size < size)
        tableau->m_allocatedSize = tableau->m_size;
	else
        tableau->m_allocatedSize = size;

    if (! tableau->m_data)
        tableau->m_data = gosh_allocn(TYPE, tableau->m_allocatedSize);
	else
        tableau->m_data = gosh_reallocn(tableau->m_data, TYPE, tableau->m_allocatedSize);
}

void FUNC_NAME(ajouter)(CONTAINER_NAME ptrtableau, TYPE element)
{
    struct IMPL_CONTAINER_NAME * tableau = ptrTableau->data;
    if (tableau->m_size >= tableau->reservedSize)
        tableau->reserve(tableau, m_size + 1);
    tableau->m_data[tableau->m_size++] = element;
}

TYPE FUNC_NAME(supprimer_tete)(CONTAINER_NAME ptrTableau)
{
    struct IMPL_CONTAINER_NAME * tableau = ptrTableau;
    assert(tableau->m_size);
    TYPE element = tableau->m_data[--tableau->m_size];
	return pos;
}
/*

bool FUNC_NAME(appartient)(CONTAINER_NAME tableau, TYPE element) {
    struct NODE_NAME * noeud = tableau->tete;
    while ( noeud ) {
        if (noeud->element == element) {
            return true;
        }
        noeud = noeud->suivant;
    }
    return false;
}
*/

#endif

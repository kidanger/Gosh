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
	CONTAINER_NAME ptrEnsemble = gosh_alloc(*ptrEnsemble);
	ptrEnsemble->data = gosh_alloc(*ptrEnsemble->data);
	struct IMPL_CONTAINER_NAME * ensemble = ptrEnsemble->data;
	ensemble->m_size = 0;
	ensemble->m_allocatedSize = 0;
	ensemble->m_data = NULL;

	ptrEnsemble->next = FUNC_NAME(next);
	ptrEnsemble->createIterateur = FUNC_NAME(createIterateur);
	ptrEnsemble->vide = FUNC_NAME(vide);
	ptrEnsemble->ajouter = FUNC_NAME(ajouter);
	ptrEnsemble->reserve = FUNC_NAME(reserve);
	//ensemble->appartient = FUNC_NAME(appartient);
	ptrEnsemble->supprimer_tete = FUNC_NAME(supprimer_tete);

	return ptrEnsemble;
}

void CONCAT_2(detruire_dynamicTab_, TYPE_LOWER)(CONTAINER_NAME ensemble)
{
	gosh_free(ensemble->data->m_data);
	gosh_free(ensemble->data);
	gosh_free(ensemble);
}

bool FUNC_NAME(vide)(CONTAINER_NAME ensemble)
{
	return  ! ensemble->data->m_data || ! ensemble->data->size_t;
}

void FUNC_NAME(reserve)(CONTAINER_NAME ptrEnsemble, size_t size)
{
	struct IMPL_CONTAINER_NAME * ensemble = ptrEnsemble->data;

	if (ensemble->m_size < size)
		ensemble->m_allocatedSize = ensemble->m_size;
	else
		ensemble->m_allocatedSize = size;

	if (! ensemble->m_data)
		ensemble->m_data = gosh_allocn(TYPE, ensemble->m_allocatedSize);
	else
		ensemble->m_data = gosh_reallocn(ensemble->m_data, TYPE, ensemble->m_allocatedSize);
}

void FUNC_NAME(ajouter)(CONTAINER_NAME ptrEnsemble, TYPE element)
{
	struct IMPL_CONTAINER_NAME * ensemble = ptrEnsemble->data;
	if (ensemble->m_size >= ensemble->reservedSize)
		ensemble->reserve(ensemble, m_size + 1);
	ensemble->m_data[ensemble->m_size++] = element;
}

TYPE FUNC_NAME(supprimer_tete)(CONTAINER_NAME ptrEnsemble)
{
	struct IMPL_CONTAINER_NAME * ensemble = ptrEnsemble;
	assert(ensemble->m_size);
	TYPE element = ensemble->m_data[--ensemble->m_size];
	return pos;
}
/*

bool FUNC_NAME(appartient)(CONTAINER_NAME ensemble, TYPE element) {
    struct NODE_NAME * noeud = ensemble->tete;
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

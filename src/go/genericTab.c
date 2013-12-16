#ifdef TYPE

GoshIterateur FUNC_NAME(createIterateur) (void)
{
    GoshIterateur it = {NULL};
    return it;
}

TYPE * FUNC_NAME(next)(GoshIterateur * it, CONTAINER_NAME container, TYPE* element)
{
    TYPE * ptrElement = NULL;
    if( ! it->m_pos )
        it->m_pos = ptrElement = container->m_data;
    else if( ++(TYPE *)it->m_pos - container->m_data >= container->m_size )
            it->m_pos = NULL;
    else
        ptrElement = (TYPE *)it->m_pos;


    if( element && ptrElement )
        *element = *ptrElement;

    return ptrElement;
}

CONTAINER_NAME CONCAT_2(creer_dynamicTab_, TYPE_LOWER)(void)
{
    CONTAINER_NAME ensemble = gosh_alloc(*ensemble);
    ensemble->m_size = 0;
    ensemble->m_allocatedSize = 0;
    ensemble->m_data = NULL;

    ensemble->next = FUNC_NAME(next);
    ensemble->createIterateur = FUNC_NAME(createIterateur);
    ensemble->vide = FUNC_NAME(vide);
    ensemble->ajouter = FUNC_NAME(ajouter);
    ensemble->reserve = FUNC_NAME(reserve);
    //ensemble->appartient = FUNC_NAME(appartient);
    ensemble->supprimer_tete = FUNC_NAME(supprimer_tete);

    return ensemble;
}

void CONCAT_2(detruire_dynamicTab_, TYPE_LOWER) (CONTAINER_NAME ensemble)
{
    gosh_free(ensemble->m_data);
    gosh_free(ensemble);
}

bool FUNC_NAME(vide)(CONTAINER_NAME ensemble) {
    return  ! ensemble->m_data || ! ensemble->size_t;
}

void FUNC_NAME(reserve)(CONTAINER_NAME ensemble, size_t size)
{
    if( ensemble->m_size < size)
        ensemble->m_allocatedSize = ensemble->m_size;
    else
        ensemble->m_allocatedSize = size;

    if( ! ensemble->m_data )
        ensemble->m_data = gosh_allocn(TYPE, ensemble->m_allocatedSize);
    else
        ensemble->m_data = gosh_reallocn(ensemble->m_data, TYPE, ensemble->m_allocatedSize);
}

void FUNC_NAME(ajouter)(CONTAINER_NAME ensemble, TYPE element)
{
    if( ensemble->m_size >= ensemble->reservedSize )
        ensemble->reserve(ensemble, m_size + 1);
    ensemble->m_data[ensemble->m_size++] = element;
}

TYPE FUNC_NAME(supprimer_tete)(CONTAINER_NAME ensemble) {
    assert(ensemble->m_size );
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

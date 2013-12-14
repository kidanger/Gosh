#ifndef GENERICTAB_H
#define GENERICTAB_H

#include <stdio.h>
#include <stdbool.h>

typedef struct s_Gosh_Iterator
{
    void * m_container;
    void * m_pos;
    void * (*current)( struct s_Gosh_Iterator * it);
    void * (*next)( struct s_Gosh_Iterator * it);
} Gosh_Iterator;

/** @def DEF_DYNAMIC_TAB
  * @author Denis Migdal
  * @date 14/12/2013
  * @ingroup go
  * @brief declare a container for dynamic tabs.
  *
  * Not really usefull but provides an exemple for container which can be used
  * by gosh_foreach.
  * @todo separate declaration and definition (1).
  * @todo create the same for a generic list (2) ?
  * @todo add some stuffs like resize/getElement()/destroy()/setElement/end()/previous()/compareIterator()
  * @note we use void pointer to simplify prototypes.
  */
#define DEF_DYNAMIC_TAB(TYPE) \
    struct s_Gosh_Iterator ; \
    \
    typedef struct \
    { \
      struct s_Gosh_Iterator (*begin)(void * container); \
      size_t (*size)(void * container); \
      TYPE (* m_data);\
      size_t m_size; \
    } DynamicTab_ ## TYPE; \
    \
    void * gosh_next_dynamicTab_ ## TYPE ( Gosh_Iterator * it ) \
    { \
        DynamicTab_ ## TYPE * ptr = (DynamicTab_ ## TYPE *)it->m_container; \
        if( ! it->m_pos );\
            return it->m_pos = ptr->m_data; \
        TYPE * pos = it->m_pos; \
        if( ++pos - ptr->m_data >= ptr->m_size ) \
            pos = NULL; \
        it->m_pos = pos; \
        return (void *)pos; \
    } \
    \
    void * gosh_current_dynamicTab_ ## TYPE ( Gosh_Iterator * it ) \
    { \
        return it->m_pos;\
    } \
    \
    Gosh_Iterator gosh_begin_dynamicTab_ ## TYPE (void * container) \
    { \
        DynamicTab_ ## TYPE * ptr = (DynamicTab_ ## TYPE *)container;\
        Gosh_Iterator tmp = \
              { (void*)ptr, NULL, gosh_next_dynamicTab_ ## TYPE, gosh_current_dynamicTab_ ## TYPE}; \
        return tmp;\
    } \
    \
    size_t gosh_size_dynamicTab_ ## TYPE (void * container)\
    { \
        DynamicTab_ ## TYPE * ptr = (DynamicTab_ ## TYPE *)container;\
        return ptr->m_size; \
    } \
    \
    DynamicTab_ ## TYPE gosh_create_dynamicTab_ ## TYPE (void) \
    { \
        DynamicTab_ ## TYPE tmp= \
            { gosh_begin_dynamicTab_ ## TYPE, gosh_size_dynamicTab_ ## TYPE, NULL, 0 }; \
        return tmp; \
    }



#endif // GENERICTAB_H

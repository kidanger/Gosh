#ifndef GENERICTAB_H
#define GENERICTAB_H

#include <stdio.h>
#include <stdbool.h>

/** @def DEF_GENERIC_TAB
  * @author Denis Migdal
  * @date 14/12/2013
  * @ingroup go
  * @brief declare a generic vector container.
  *
  * Not really usefull but provides an exemple for container which can be used
  * by gosh_foreach.
  * @todo cut declaration and definitions.
  * @todo add some stuffs like resize/getElement()/destroy()/setElement/end()/previous()/compareIterator()
  * @todo create the same for a generic list ?
  */
#define DEF_GENERIC_TAB(SIZE) \
    struct s_Gosh_Iterator_GenericTab_ ## SIZE ## t; \
    \
    typedef struct s_GenericTab_ ## SIZE ## t \
    { \
      struct s_Gosh_Iterator_GenericTab_ ## SIZE ## t (*begin)(struct s_GenericTab_ ## SIZE ## t * ptr); \
      size_t (*size)(struct s_GenericTab_ ## SIZE ## t * ptr); \
      char (* m_data) [(SIZE)];\
      size_t m_size; \
    } GenericTab_ ## SIZE ## t; \
    \
    typedef struct s_Gosh_Iterator_GenericTab_ ## SIZE ## t \
    {\
        GenericTab_ ## SIZE ## t * m_container; \
        size_t m_pos; \
        bool (*next)( struct s_Gosh_Iterator_GenericTab_ ## SIZE ## t * ); \
        char * (*current)( struct s_Gosh_Iterator_GenericTab_ ## SIZE ## t * ); \
    } Gosh_Iterator_GenericTab_ ## SIZE ## t;\
    \
    bool gosh_next_genericTab_ ## SIZE ## t( Gosh_Iterator_GenericTab_ ## SIZE ## t * ptr ) \
    { \
        if( ptr->m_pos == (size_t)-1 );\
            return false; \
        if( ++(ptr->m_pos) >= ptr->m_container->m_size ) \
        { \
            ptr->m_pos = (size_t) -1; \
            return false; \
        } \
        return true; \
    } \
    \
    char * gosh_current_genericTab_ ## SIZE ## t ( Gosh_Iterator_GenericTab_ ## SIZE ## t * ptr ) \
    { \
        return ptr->m_pos == (size_t) -1 ? \
                    NULL: \
                    ptr->m_container->m_data[ptr->m_pos]; \
    } \
    \
    Gosh_Iterator_GenericTab_ ## SIZE ## t gosh_begin_genericTab_ ## SIZE ## t(GenericTab_ ## SIZE ## t * ptr) \
    { \
        Gosh_Iterator_GenericTab_ ## SIZE ## t tmp = \
              {ptr, 0, gosh_next_genericTab_ ## SIZE ## t, gosh_current_genericTab_ ## SIZE ## t}; \
        return tmp;\
    } \
    \
    size_t gosh_size_genericTab_ ## SIZE ## t(GenericTab_ ## SIZE ## t * ptr)\
    { \
        return ptr->m_size; \
    } \
    \
    GenericTab_ ## SIZE ## t gosh_create_genericTab_ ## SIZE ## t (void) \
    { \
        GenericTab_ ## SIZE ## t tmp= \
            { gosh_begin_genericTab_ ## SIZE ## t, gosh_size_genericTab_ ## SIZE ## t, NULL, 0 }; \
        return tmp; \
    }

#endif // GENERICTAB_H

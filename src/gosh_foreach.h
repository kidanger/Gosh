#ifndef GOSH_FOREACH_H
#define GOSH_FOREACH_H


/** @def gosh_foreach
  * @author Denis Migdal
  * @date 14/12/2013
  * @ingroup go
  * @brief generic foreach for Gosh containers.
  *	@example "gosh_foreach usage"
    @see gosh_foreach
    @code
    @endcode
  */
#define gosh_foreach(TYPE, ELEMENT_NAME, CONTAINER) \
    for( Gosh_Iterator it = (CONTAINER).begin( &(CONTAINER) ); \
         ((ELEMENT_NAME) = it.next( &it )) ; \
        )

#endif // GOSH_FOREACH_H

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
    for( Gosh_Iterator_ ## TYPE it = (CONTAINER).begin( &(CONTAINER) ) ; \
         it.next( &it ) ; \
         (ELEMENT_NAME) = (TYPE)it.current( &it ) )

#endif // GOSH_FOREACH_H

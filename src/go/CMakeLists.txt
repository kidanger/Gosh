project(go)

aux_source_directory(. src)
set( headers gosh_foreach.h ) # todo : utiliser find pour trouver les headers ?

add_library(go STATIC
	../alloc.c # todo : faire une bibliothèque "gosh_alloc" ?
	${src}
	${headers} # pour l'IDE
)

install(TARGETS go DESTINATION lib)


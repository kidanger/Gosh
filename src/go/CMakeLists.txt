project(go)

add_library(go STATIC
	../alloc.c
	plateau.c
	ensemble_colore.c
	ensemble_positions.c
	chaine.c
)

install(TARGETS go DESTINATION lib)


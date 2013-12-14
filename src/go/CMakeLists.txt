project(go)

aux_source_directory(. LIBGO_SOURCES)
add_library(go STATIC
	../alloc.c
	${LIBGO_SOURCES}
)

install(TARGETS go DESTINATION lib)


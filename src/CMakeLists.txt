ADD_DEFINITIONS("-std=c99")

file(GLOB_RECURSE headers ../include/*.h)

aux_source_directory(. COMMON_SOURCES)

add_library(gosh_common STATIC
	${COMMON_SOURCES}
	${headers}
)

add_subdirectory(go)
add_subdirectory(cli)

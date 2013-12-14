ADD_DEFINITIONS("-std=c99")

aux_source_directory(. COMMON_SOURCES)
add_library(gosh_common STATIC
	${COMMON_SOURCES}
)

add_subdirectory(go)
add_subdirectory(cli)

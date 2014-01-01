ADD_DEFINITIONS("-std=c99")

# traite les warnings comme des erreurs
IF(CMAKE_COMPILER_IS_GNUCC)
    SET(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Wall -Wextra -Werror")
ENDIF(CMAKE_COMPILER_IS_GNUCC)


file(GLOB_RECURSE headers ../include/*.h)

aux_source_directory(. COMMON_SOURCES)

add_library(gosh_common STATIC
	${COMMON_SOURCES}
	${headers}
)

add_subdirectory(go)
add_subdirectory(ordinateurs)
add_subdirectory(cli)
add_subdirectory(test)

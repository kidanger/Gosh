set(CMAKE_POSITION_INDEPENDENT_CODE ON) # -fPIC
ADD_DEFINITIONS("-std=c99")

ADD_DEFINITIONS(-DBUILD_PATH="${PROJECT_BINARY_DIR}")
ADD_DEFINITIONS(-DSOURCE_PATH="${PROJECT_SOURCE_DIR}")
ADD_DEFINITIONS(-DINSTALL_PATH="${CMAKE_INSTALL_PREFIX}")

# traite les warnings comme des erreurs
IF(CMAKE_COMPILER_IS_GNUCC)
    SET(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Wall -Wextra -Werror")
ENDIF(CMAKE_COMPILER_IS_GNUCC)

include_directories(../include)

aux_source_directory(. COMMON_SOURCES)

file(GLOB_RECURSE headers ../include/*.h) # add headers files in QtCreator

add_library(gosh_common STATIC
	${COMMON_SOURCES}
	${headers}
)

add_subdirectory(go)
add_subdirectory(ordinateurs)
add_subdirectory(cli)
add_subdirectory(sdl)
add_subdirectory(test)

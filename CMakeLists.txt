cmake_minimum_required(VERSION 2.8)
ADD_DEFINITIONS("-g")
ADD_DEFINITIONS("-DTEST_UNIQUEMENT=1")

project(Gosh)

include_directories(include)
include_directories(src)

add_subdirectory(src)

add_custom_target(run_cli COMMAND cli)
add_custom_target(run_sdl COMMAND sdl)
add_custom_target(astyle COMMAND
	astyle --indent=tab --indent-preprocessor --style=kr
	--pad-oper --pad-header --unpad-paren -S -n
	--recursive ${CMAKE_SOURCE_DIR}"/src/*.c" ${CMAKE_SOURCE_DIR}"/include/*.h"
)

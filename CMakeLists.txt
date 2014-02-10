cmake_minimum_required(VERSION 2.8)

project(Gosh)

include_directories(include)
include_directories(src)

add_subdirectory(src)
add_subdirectory(ressources)

add_custom_target(run_cli COMMAND src/cli/goshcli)
add_custom_target(run_sdl COMMAND src/sdl/goshsdl)
add_custom_target(astyle COMMAND
	astyle --indent=tab --indent-preprocessor --style=kr
	--pad-oper --pad-header --unpad-paren -S -n
	--recursive ${CMAKE_SOURCE_DIR}"/src/*.c" ${CMAKE_SOURCE_DIR}"/include/*.h"
)

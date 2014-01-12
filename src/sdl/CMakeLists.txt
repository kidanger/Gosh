set(OUT sdl)
if(EMSCRIPTEN)
	set(OUT sdl.js)
endif(EMSCRIPTEN)

aux_source_directory(. SDL_SOURCES)
add_executable(${OUT}
	${SDL_SOURCES}
)

target_link_libraries(${OUT} go)
target_link_libraries(${OUT} gosh_common)
if(NOT DEFINED EMSCRIPTEN)
	target_link_libraries(${OUT} SDL)
	target_link_libraries(${OUT} SDL_ttf)
else(NOT DEFINED EMSCRIPTEN)
	target_link_libraries(${OUT} random)
endif(NOT DEFINED EMSCRIPTEN)

install(TARGETS ${OUT} DESTINATION bin)

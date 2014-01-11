aux_source_directory(. SDL_SOURCES)
add_executable(sdl
	${SDL_SOURCES}
)

target_link_libraries(sdl go)
target_link_libraries(sdl gosh_common)
target_link_libraries(sdl SDL)
target_link_libraries(sdl SDL_ttf)

install(TARGETS sdl DESTINATION bin)

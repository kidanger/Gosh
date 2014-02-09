set(OUT goshsdl)
if(EMSCRIPTEN)
        set(OUT goshsdl.js)
endif(EMSCRIPTEN)

aux_source_directory(. SDL_SOURCES)
add_executable(${OUT}
	${SDL_SOURCES}
)

target_link_libraries(${OUT} go)
target_link_libraries(${OUT} gosh_common)

if(NOT DEFINED EMSCRIPTEN)
    find_package(SDL REQUIRED)
    find_package(SDL_ttf REQUIRED)
    target_link_libraries(${OUT} ${SDL_LIBRARY} ${SDL_TTF_LIBRARIES})
else()
	target_link_libraries(${OUT} random)
endif()

install(TARGETS ${OUT} DESTINATION bin)

aux_source_directory(. LIBGO_SOURCES)

add_library(go STATIC
	${LIBGO_SOURCES}
)

target_link_libraries(go gosh_common)

if(NOT DEFINED EMSCRIPTEN)
	target_link_libraries(go dl)
endif(NOT DEFINED EMSCRIPTEN)

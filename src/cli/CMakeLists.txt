project(cli)

aux_source_directory(. CLI_SOURCES)
add_executable(cli
	${CLI_SOURCES}
)

target_link_libraries(cli go)
target_link_libraries(cli gosh_common)

install(TARGETS cli DESTINATION bin)

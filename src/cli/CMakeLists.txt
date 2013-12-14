project(cli)

aux_source_directory(. CLI_SOURCES)
add_executable(cli ${CLI_SOURCES})
target_link_libraries(cli go)

install(TARGETS cli DESTINATION bin)

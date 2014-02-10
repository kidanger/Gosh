aux_source_directory(. CLI_SOURCES)

add_executable(goshcli
	${CLI_SOURCES}
)

target_link_libraries(goshcli go)
target_link_libraries(goshcli gosh_common)

install(TARGETS goshcli DESTINATION bin)

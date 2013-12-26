aux_source_directory(. TEST_SOURCES)
aux_source_directory(../cli CLI_SOURCES)
list(REMOVE_ITEM CLI_SOURCES ../cli/main.c)
add_executable(test
	${TEST_SOURCES}
	${CLI_SOURCES}
)

target_link_libraries(test go)
target_link_libraries(test gosh_common)

aux_source_directory(../cli CLI_SOURCES)
list(REMOVE_ITEM CLI_SOURCES ../cli/main.c)

add_executable(regles regles.c ${CLI_SOURCES})
target_link_libraries(regles go)
target_link_libraries(regles gosh_common)

add_executable(unittest unittest.c ${CLI_SOURCES})
target_link_libraries(unittest go)
target_link_libraries(unittest gosh_common)

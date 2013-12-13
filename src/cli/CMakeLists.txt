project(cli)

add_executable(cli main.c)
target_link_libraries(cli go)

install(TARGETS cli DESTINATION bin)

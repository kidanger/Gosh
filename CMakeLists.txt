cmake_minimum_required(VERSION 2.8)

project(Gosh)

include_directories(src)
add_subdirectory(src)

ADD_CUSTOM_TARGET(run_cli COMMAND cli)
ADD_CUSTOM_TARGET(run_sdl COMMAND sdl)

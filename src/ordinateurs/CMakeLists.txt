macro(AJOUTER_ORDINATEUR nom)
    aux_source_directory(${nom} ${nom}_SOURCES)
    add_library(${nom} SHARED ${${nom}_SOURCES})
    install(TARGETS ${nom} DESTINATION share/gosh)
endmacro(AJOUTER_ORDINATEUR)

AJOUTER_ORDINATEUR(random)
AJOUTER_ORDINATEUR(gnugo)
target_link_libraries(gnugo go)

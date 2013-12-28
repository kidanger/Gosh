macro(AJOUTER_ORDINATEUR nom)
    aux_source_directory(${nom} ${nom}_SOURCES)
    add_library(${nom} SHARED ${${nom}_SOURCES})
    #target_link_libraries(${nom} gosh_common)
endmacro(AJOUTER_ORDINATEUR)

AJOUTER_ORDINATEUR(random)
AJOUTER_ORDINATEUR(gnugo)

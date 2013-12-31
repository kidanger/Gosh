#ifndef SAUVEGARDE_H
#define SAUVEGARDE_H

#include<stdbool.h>
#include<stdio.h>

#include "go/plateau_type.h"

bool sauvegarder_plateau_fichier(const char * filename, Plateau);
bool sauvegarder_plateau(Plateau, FILE * file);


/** @bref place errno à ENOTSUP si le type de format n'est pas supporté */
Plateau charger_plateau_fichier(const char * filename);


Plateau charger_plateau(FILE * file);

#endif // SAUVEGARDE_H

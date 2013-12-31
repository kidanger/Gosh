#ifndef SAUVEGARDE_H
#define SAUVEGARDE_H

#include<stdbool.h>

#include "go/plateau_type.h"

bool sauvegarder_partie(const char * filename, Plateau);

bool charger_partie(const char * filename, Plateau);

#endif // SAUVEGARDE_H

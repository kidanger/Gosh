/* Copyright © 2013-2014 Jérémy Anger, Denis Migdal
   This file is part of Gosh.

   Gosh is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   Gosh is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with Gosh.  If not, see <http://www.gnu.org/licenses/>. */
#ifndef SAUVEGARDE_H
#define SAUVEGARDE_H

#include<stdbool.h>
#include<stdio.h>

#include "go/plateau_type.h"
#include "go/partie.h"

bool sauvegarder_partie_fichier(const char * filename, Partie);
bool sauvegarder_partie(Partie, FILE * file);

/** @bref place errno à ENOTSUP si le type de format n'est pas supporté */
Partie charger_partie_fichier(const char * filename);
Partie charger_partie(FILE * file);

bool sauvegarder_plateau_fichier(const char * filename, Plateau);
bool sauvegarder_plateau(Plateau, FILE * file);


/** @bref place errno à ENOTSUP si le type de format n'est pas supporté */
Plateau charger_plateau_fichier(const char * filename);


Plateau charger_plateau(FILE * file);

#endif // SAUVEGARDE_H

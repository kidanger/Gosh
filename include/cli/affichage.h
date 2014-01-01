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
#ifndef GOSH_CLI_AFFICHAGE
#define GOSH_CLI_AFFICHAGE

#include "go/plateau_type.h"

#define C_NORMAL "\033[m"
#define C_WHITE "\033[37m"
#define C_BLACK "\033[30m"
#define C_GREEN "\033[32m"
#define C_RED "\033[31m"
#define C_YELLOW "\033[33m"
#define C_GREY "\033[37m"
#define C_BLUE "\033[34m"
#define C_BOLD "\033[1m"
#define C_NOBOLD "\033[22m"

#define C_YELLOW_BG "\033[43m"

void cli_afficher_plateau(Plateau plateau);

#endif

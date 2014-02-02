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
#ifndef GOSH_CLI_SAISIE
#define GOSH_CLI_SAISIE

#include <stdbool.h>
#include <stdarg.h>

typedef struct {
	char code;
	const char* phrase;
} Option;

char cli_choisir_option(const char* prompt, char defaut, ...);

char cli_choisir_option2(const char *prompt, char defaut, const Option * option);
void cli_demander_string(const char* prompt, char* buffer, unsigned int taille);
int cli_demander_int(const char* prompt, bool* valide);

#endif

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
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#include <stdarg.h>

#include "cli/saisie.h"
#include "cli/affichage.h"

static void debut_prompt(void)
{
	printf(C_GREY);
	fflush(stdout);
}
static void debut_saisie(void)
{
	printf(C_GREEN);
	fflush(stdout);
}
static void fin(void)
{
	printf(C_NORMAL);
	fflush(stdout);
}

#define NUM_OPTIONS 16

char cli_demander_char(const char* prompt, char defaut, ...)
{
	// TODO: gérer defaut
	struct {
		char code;
		const char* phrase;
	} options[NUM_OPTIONS];

	va_list args;
	va_start(args, defaut);
	int num_options = 0;
	while (num_options < NUM_OPTIONS) {
		char option = va_arg(args, int);
		if (option == 0)
			break;
		const char* phrase = va_arg(args, const char *);
		options[num_options].code = option;
		options[num_options].phrase = phrase;
		num_options += 1;
	}
	va_end(args);

	char rep = 0;
	bool saisie_correcte = false;
	while (!saisie_correcte) {
		debut_prompt();
		printf("%s\n", prompt);
		for (int o = 0; o < num_options; o++) {
			printf(" - %c: %s\n", options[o].code, options[o].phrase);
		}
		printf("> ");
		debut_saisie();
		scanf("%c%*c", &rep);

		for (int o = 0; o < num_options; o++) {
			if (options[o].code == rep)
				saisie_correcte = true;
		}
	}
	return rep;
}

void cli_demander_string(const char* prompt, char* buffer, unsigned int taille)
{
	bool eof;
	do {
		debut_prompt();
		printf("%s : ", prompt);

		debut_saisie();
		eof = fgets(buffer, taille, stdin) == NULL;
		buffer[strlen(buffer) - 1] = 0; // suppression du \n
	} while (buffer[0] == 0 && !eof);
	fin();
	if (eof) {
		printf("EOF reçu, arrêt du programme.\n");
		exit(EXIT_FAILURE);
	}
}

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
#ifndef _WIN32
#include <sys/select.h>
#else
#include <Winsock2.h>
#endif
#include <unistd.h>

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

char cli_choisir_option2(const char *prompt, char defaut, const Option * options)
{
	char reponse = 0;
	bool saisie_correcte = false;

	while (!saisie_correcte && reponse != EOF) {
		// print menu
		debut_prompt();
		printf("%s\n", prompt);
		size_t i = 0;
		while (options[i].code) {
			printf(" - %s%c%s : %s\n",
					options[i].code == defaut ? C_YELLOW : C_NORMAL,
					options[i].code,
					C_GREY,
					options[i].phrase);
			++i;
		}
		printf("> ");
		debut_saisie();

		reponse = getchar();
		if (reponse != '\n') {
			int car;
			while ((car = fgetc(stdin)) != '\n' && car != EOF);
		}

		// verify
		if (reponse == '\n')
			reponse = defaut;

		i = 0;
		while (options[i].code) {
			if (options[i++].code == reponse)
				saisie_correcte = true;
		}
		fin();
	}
	if (reponse == EOF) {
		printf("EOF reçu, arrêt du programme.\n");
		exit(EXIT_FAILURE);
	}
	return reponse;
}

char cli_choisir_option(const char* prompt, char defaut, ...)
{
	Option options[NUM_OPTIONS + 1];
	//extracts options

	va_list args;
	va_start(args, defaut);
	int num_options = 0;
	while (num_options < NUM_OPTIONS) {
		char option = va_arg(args, int);
		if (! option)
			break;
		const char* phrase = va_arg(args, const char *);
		options[num_options].code = option;
		options[num_options].phrase = phrase;
		num_options++;
	}
	va_end(args);
	if (num_options >= NUM_OPTIONS) {
		fprintf(stderr, "too many options use cli_choisir_option2 instead.\n");
		return '\0';
	}
	options[num_options].code = 0;

	return cli_choisir_option2(prompt, defaut, options);
}

void cli_demander_string(const char* prompt, char* buffer, unsigned int taille)
{
	bool eof;
	do {
		debut_prompt();
		printf("%s : ", prompt);

		debut_saisie();
		eof = fgets(buffer, taille, stdin) == NULL;

		if (buffer[strlen(buffer) - 1] == '\n')
			buffer[strlen(buffer) - 1] = 0; // suppression du \n

	} while (buffer[0] == 0 && !eof);
	fin();
	if (eof) {
		printf("EOF reçu, arrêt du programme.\n");
		exit(EXIT_FAILURE);
	}
}

int cli_demander_int(const char* prompt, bool* valide)
{
	bool eof;
	char buffer[32];
	do {
		debut_prompt();
		printf("%s : ", prompt);

		debut_saisie();
		eof = fgets(buffer, sizeof(buffer), stdin) == NULL;
		if (buffer[strlen(buffer) - 1] == '\n')
			buffer[strlen(buffer) - 1] = 0; // suppression du \n
	} while (buffer[0] == 0 && !eof);
	fin();
	if (eof) {
		printf("EOF reçu, arrêt du programme.\n");
		exit(EXIT_FAILURE);
	}
	int num;
	*valide = sscanf(buffer, "%d", &num);
	return num;
}


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
#include <sys/select.h>
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

    while (!saisie_correcte) {

        // print menu
        flush_stdin();
        debut_prompt();
        printf("%s\n", prompt);
        size_t i = 0;
        while( options[i].code )
        {
            printf(" - %c: %s\n", options[i].code, options[i].phrase);
            ++i;
        }
        printf("> ");
        debut_saisie();

        reponse = getchar();

        // verify
        if( reponse == '\n' )
            reponse = defaut;

        i = 0;
        while( options[i].code )
        {
            if (options[i++].code == reponse)
                saisie_correcte = true;
        }
    }
    return reponse;
}

char cli_choisir_option(const char* prompt, char defaut, ...)
{
	// TODO: gérer defaut
    Option options[NUM_OPTIONS + 1];

    //extracts options
    va_list args;
    va_start(args, defaut);
    int num_options = 0;
    while (num_options < NUM_OPTIONS) {
        char option = va_arg(args, int);
        if ( ! option)
            break;
        const char* phrase = va_arg(args, const char *);
        options[num_options].code = option;
        options[num_options].phrase = phrase;
        num_options++;
    }
    va_end(args);

    if( num_options >= NUM_OPTIONS )
    {
        perror("too many options use cli_choisir_option2 instead.\n");
        return '\0';
    }
    options[num_options].code = 0;

    return cli_choisir_option2(prompt, defaut, options);
}

void cli_demander_string(const char* prompt, char* buffer, unsigned int taille)
{
	bool eof;
	do {
        flush_stdin();
		debut_prompt();
		printf("%s : ", prompt);

		debut_saisie();
		eof = fgets(buffer, taille, stdin) == NULL;
        buffer[strlen(buffer) - 1] = '\0'; // suppression du \n
    } while (buffer[0] == '\0' && !eof);
	fin();
	if (eof) {
		printf("EOF reçu, arrêt du programme.\n");
		exit(EXIT_FAILURE);
	}
}

void flush_stdin(void)
{
    char buffer[4096];
    fd_set rfds;
    FD_ZERO(&rfds);
    FD_SET(STDIN_FILENO, &rfds);

    while(   select(1, &rfds, NULL, NULL, NULL) > 0
          && fgets(buffer, sizeof(buffer) - 1, stdin) )
    {
        FD_SET(STDIN_FILENO, &rfds);
    }
}

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
#include "go/sauvegarde.h"
#include "go/ordinateur.h"
#include "go/plateau.h"
#include "errno.h"
#include "gosh_alloc.h"
#include <stdint.h>
#include <string.h>
#ifdef _WIN32
#include <windows.h>
#define ENOTSUP 4096
#else
#include <arpa/inet.h>
#endif
#include <assert.h>
#include <stdint.h>

#define SERIALIZE_VERSION 0
#define BINAIRE 'B'
#define TEXTE 'T'

bool sauvegarder_partie_fichier(const char * filename, Partie partie)
{
    FILE * file = fopen(filename, "w");
    if (! file)
        return false;
    bool retour = sauvegarder_partie(partie, file);
    fclose(file);
    return retour;
}

bool sauvegarder_partie(Partie partie, FILE * file)
{
    sauvegarder_plateau(partie->plateau, file);

    putc( (partie->initialisee) ? '1' : '0' , file);
    putc( (partie->finie) ? '1' : '0' , file);
    putc( partie->joueur_courant + '0', file);
    putc('\n', file);

    for(int i = 0; i < 2; ++i)
    {
        fprintf(file, "%d\n%s\n%s\n", partie->joueurs[i].type,
                                      partie->joueurs[i].nom,
                                      partie->joueurs[i].ordinateur ?
                                      partie->joueurs[i].ordinateur->file
                                          : "");
    }

    Plateau p;
    fprintf(file, "%d\n",
            partie->plateaux_joues->nombre_elements(partie->plateaux_joues) );
    gosh_foreach(p, partie->plateaux_joues )
    {
        sauvegarder_plateau(p, file);
    }

    fprintf(file, "%d\n",
            partie->plateaux_annules->nombre_elements(partie->plateaux_annules) );
    gosh_foreach(p, partie->plateaux_annules )
    {
        sauvegarder_plateau(p, file);
    }

    return true;
}

/** @bref place errno à ENOTSUP si le type de format n'est pas supporté */
Partie charger_partie_fichier(const char * filename)
{
    FILE * file = fopen(filename, "r");
    if (! file)
        return false;
    Partie partie = charger_partie(file);
    fclose(file);
    return partie;
}

Partie charger_partie(FILE * file)
{
    Partie p = creer_partie();
    p->plateau = charger_plateau(file);
    p->initialisee = fgetc(file) != '0';
    p->finie = fgetc(file) != '0';
    p->joueur_courant = fgetc(file) - '0';
    fgetc(file);

    for(int i = 0; i < 2; ++i)
    {
        char * nom = p->joueurs[i].nom;
        fgets(nom, TAILLE_NOM_JOUEUR - 1, file);
        if( nom[strlen(nom)-1] == '\n')
            nom[strlen(nom)-1] = '\0';
        else
            fgetc(file);
        char filename[4096];
        fgets(nom, sizeof(filename)-1, file);
        if( nom[strlen(nom)-1] == '\n')
            nom[strlen(nom)-1] = '\0';
        else
            fgetc(file);
        if(filename[0])
            p->joueurs[i].ordinateur = charger_ordinateur(filename);
        else
            p->joueurs[i].ordinateur = NULL;
    }

    char number_buffer[20];
    int number;
    fgets(number_buffer, sizeof(number_buffer) - 1, file);
    number_buffer[strlen(number_buffer)-1] = '\0';
    number = atoi(number_buffer);

    for(int i = 0; i < number; ++ i)
        p->plateaux_joues->ajouter( p->plateaux_joues,
                                    charger_plateau(file) );

    fgets(number_buffer, sizeof(number_buffer) - 1, file);
    number_buffer[strlen(number_buffer)-1] = '\0';
    number = atoi(number_buffer);

    for(int i = 0; i < number; ++ i)
        p->plateaux_annules->ajouter( p->plateaux_annules,
                                      charger_plateau(file) );

    return p;
}

bool sauvegarder_plateau_fichier(const char * filename, Plateau plateau)
{
    FILE * file = fopen(filename, "w");
	if (! file)
		return false;
	bool retour = sauvegarder_plateau(plateau, file);
	fclose(file);
	return retour;
}

bool sauvegarder_plateau(Plateau plateau, FILE * file)
{
	size_t longueur = plateau_get_taille(plateau);

	uint32_t version = htonl(SERIALIZE_VERSION);
	uint32_t taille = htonl(longueur);
	char format = BINAIRE;

	if (!(fwrite(&format, sizeof(format), 1, file)
	        &&  fwrite(&version, sizeof(version), 1, file)
	        &&  fwrite(&taille, sizeof(taille), 1, file)
	     )
	   ) {
		return false;
	}

    size_t nbElement = plateau_data_size(longueur) / sizeof(uint32_t);
	const uint32_t * data = plateau_data(plateau);

	for (size_t i = 0; i < nbElement; ++i) {
		uint32_t toWrite = htonl(data[i]);
		if (! fwrite(&toWrite, sizeof(toWrite), 1, file))
			return false; // error
    }

	return true;
}

Plateau charger_plateau_fichier(const char * filename)
{
	FILE * file = fopen(filename, "r");
	if (! file)
		return NULL;
	Plateau retour = charger_plateau(file);
	fclose(file);
	return retour;
}

Plateau charger_plateau_texte(FILE * file)
{
	int taille;
	fscanf(file, "%d\n", &taille);
	Plateau plateau = creer_plateau(taille);

	char c;
	for (int y = 0; y < taille; y++) {
		for (int x = 0; x < taille; x++) {
			do {
				fscanf(file, "%c", &c);
			} while (c == ' ');
			Couleur couleur = VIDE;
			if (c == 'N') {
				couleur = NOIR;
			} else if (c == 'B') {
				couleur = BLANC;
			} else if (c == '.') {
				couleur = VIDE;
			} else {
				fprintf(stderr, "Couleur invalide '%c' en %d,%d\n", c, x, y);
				errno = ENOTSUP;
				return NULL;
			}
			plateau_set(plateau, x, y, couleur);
		}
		do {
			fscanf(file, "%c", &c);
		} while (c != '\n');
	}

	return plateau;
}


Plateau charger_plateau_binaire(FILE * file)
{
	uint32_t version;
	if (! fread(&version, sizeof(version), 1, file))
		return NULL;
	version = ntohl(version);

	if (version > SERIALIZE_VERSION) {
		errno = ENOTSUP;
		return NULL;
	}


	// deserialisation version 0
	uint32_t taille;
	if (! fread(&taille, sizeof(taille), 1, file))
		return NULL;
	taille = ntohl(taille);

	Plateau plateau = creer_plateau(taille);

	size_t nbElement = plateau_data_size(taille) / sizeof(uint32_t);
	uint32_t * data = gosh_allocn(uint32_t, nbElement);
	if (! fread(data, nbElement, 1, file)) {
		free(data);
		return false;
	}

	for (size_t i = 0; i < nbElement; i++)
		data[i] = ntohl(data[i]);

	plateau_load_data(plateau, data);

	free(data);
	return plateau;
}

Plateau charger_plateau(FILE * file)
{
	char format;

	if (! fread(&format, sizeof(format), 1, file))
		return NULL;
	if (format == BINAIRE)
		return charger_plateau_binaire(file);
	else if (format == TEXTE)
		return charger_plateau_texte(file);
	else {
		errno = ENOTSUP;
		return NULL;
	}
}

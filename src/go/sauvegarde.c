#include "go/sauvegarde.h"
#include "go/plateau.h"
#include "errno.h"
#include <stdint.h>
#ifdef WINDOWS
    #include <Winsock2.h>
#else
    #include <arpa/inet.h>
#endif
#include <assert.h>

#define SERIALIZE_VERSION 0
#define BINAIRE 'B'
#define TEXTE 'T'

bool sauvegarder_plateau_fichier(const char * filename, Plateau plateau)
{
    FILE * file = fopen(filename, "w+");
    if( ! file )
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

    if( ! (     fwrite(&format, sizeof(format), 1, file)
            &&  fwrite(&version, sizeof(version), 1, file)
            &&  fwrite(&taille, sizeof(taille), 1, file)
          )
      )
    {
        return false;
    }

    longueur *= longueur;
    for(Position step = 0; step < longueur; step += 16) // 32 bits / 2 bits
    {
        uint32_t data = 0;

        Position p = step;
        int i = 0;
        int max = (step + 16 < longueur) ? 16 : longueur - step;
        while(i < max)
        {
            data <<= 2;
            Couleur couleur = plateau_get_at(plateau, p);
            data |= couleur;
            ++i;
            ++p;
        }

        data = htonl(data);
        if( ! fwrite(&data, sizeof(data), 1, file) )
            return false; // error

    }
    return true;
}

Plateau charger_plateau_fichier(const char * filename)
{
    FILE * file = fopen(filename, "r");
    if( ! file )
        return NULL;
    Plateau retour = charger_plateau(file);
    fclose(file);
    return retour;
}

Plateau charger_plateau_texte(FILE * file)
{
    assert(0);
}


Plateau charger_plateau_binaire(FILE * file)
{
    uint32_t version;
    if( ! fread(&version, sizeof(version), 1, file) )
        return NULL;
    version = ntohl(version);

    if(version > SERIALIZE_VERSION )
    {
        errno = ENOTSUP;
        return NULL;
    }


    // deserialisation version 0
    uint32_t taille;
    if( ! fread(&taille, sizeof(taille), 1, file) )
        return NULL;
    taille = ntohl(taille);

    Plateau plateau = creer_plateau(taille);

    size_t longueur = taille * taille;

    uint32_t data;
    for(Position step = 0; step < longueur; step += sizeof(data)/2) // taille couleur = 2 bits
    {
        if( ! fread(&data, sizeof(data), 1, file) )
            return false; // error
        data = ntohl(data);

        Position p = step;
        uint32_t mask = 0x11 << (sizeof(data)*8 - 2);
        int max = (step + sizeof(data)/2 < longueur) ? sizeof(data)/2 : longueur - step;
        int i = 0;

        while(i < max)
        {
            Couleur couleur = (data & mask) >> (sizeof(data)*8 - 2);
            data <<= 2;
            plateau_set_at(plateau, p, couleur);
            ++p;
            ++i;
        }
    }
    return plateau;
}

Plateau charger_plateau(FILE * file)
{
    char format;

    if( ! fread(&format, sizeof(format), 1, file) )
        return NULL;
    if( format == BINAIRE )
        return charger_plateau_binaire(file);
    else if( format == TEXTE )
        return charger_plateau_texte(file);
    else
    {
        errno = ENOTSUP;
        return NULL;
    }
}

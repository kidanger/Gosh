/* Copyright © 2013 Jérémy Anger, Denis Migdal
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
#ifndef GOSH_GO_POSITION
#define GOSH_GO_POSITION

#include <stdint.h>
#include <stdbool.h>
#include <stdio.h> //size_t

typedef struct
{
    union {
        struct {
            uint8_t x;
            uint8_t y;
            uint8_t coord_max;
            uint8_t zero;
        };
        uint32_t id;
    };
} Position;

#define POSITION_INVALIDE ((Position){-1,-1,0})

#define POSITION_VOISINS(position) { \
position_gauche(position), \
position_droite(position), \
position_haut(position), \
position_bas(position), \
}

Position position(size_t taille, size_t x, size_t y);

bool position_est_valide(Position);

Position position_gauche(Position);
Position position_droite(Position);
Position position_haut(Position);
Position position_bas(Position);

#endif


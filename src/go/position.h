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

typedef unsigned short Position;

#define POSITION(x, y) ((y) * 19 + (x))

#define POSITION_X(p) ((p) % 19)
#define POSITION_Y(p) ((p) / 19)
#define POSITION_EQ(p1, p2) ((p1) == (p2))

#define POSITION_INVALIDE POSITION(19, 19)
#define POSITION_EST_VALIDE(p) (!POSITION_EQ((p), POSITION_INVALIDE))

#define POSITION_GAUCHE(p, taille) \
        (POSITION_X((p)) > 0 ? \
        POSITION(POSITION_X((p)) - 1, POSITION_Y((p))) : \
         POSITION_INVALIDE)

#define POSITION_DROITE(p, taille) \
        (POSITION_X((p)) < (taille)-1 ? \
        POSITION(POSITION_X((p)) + 1, POSITION_Y((p))) : \
         POSITION_INVALIDE)

#define POSITION_HAUT(p, taille) \
        (POSITION_Y((p)) > 0 ? \
        POSITION(POSITION_X((p)), POSITION_Y((p)) - 1) : \
         POSITION_INVALIDE)

#define POSITION_BAS(p, taille) \
        (POSITION_Y((p)) < (taille)-1 ? \
        POSITION(POSITION_X((p)), POSITION_Y((p)) + 1) : \
         POSITION_INVALIDE)

#endif


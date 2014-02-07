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

/** @file coup.c
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup go
 */

#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#include "go/coup.h"
#include "gosh_macros.h"

s_Coup str2coup(const char* str, int taille, bool* valide)
{
	s_Coup coup;
	if (strcmp(str, "p") == 0) {
		// passe son tour
		coup.position = POSITION_INVALIDE;
		if (valide)
			*valide = true;
	} else {
		int lettre = tolower(str[0]) - 'a';
		int numero = atoi(str + 1) - 1;

		// 19, car on ne sait pas la taille du plateau
		if (lettre < 0 || lettre >= taille || numero < 0 || numero >= taille) {
			gosh_debug("coup invalide '%s' %d %d", str, lettre, numero);
			if (valide)
				*valide = false;
		} else {
			coup.position = position(lettre, numero, taille);
			if (valide)
				*valide = true;
		}
	}
	return coup;
}


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

#include "cli/affichage.h"
#include "cli/configurer_partie.h"
#include "cli/deroulement_partie.h"


int main(int argc, const char *argv[])
{
	(void) argc;
	(void) argv;

	Partie p = cli_creer_nouvelle_partie();
	cli_afficher_plateau(p->plateau);
	cli_jouer_partie(p);

	return EXIT_SUCCESS;
}


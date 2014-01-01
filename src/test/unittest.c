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
#include <stdbool.h>
#include <stdio.h>
#include <assert.h>
#include <time.h>

#include "gosh_macros.h"
#include "go/plateau.h"
#include "go/libertes.h"
#include "go/territoire.h"
#include "cli/affichage.h"

void afficher_plateau(Plateau plateau)
{
	int taille = plateau_get_taille(plateau);
	// pour tester les chaines
	Position position_chaine = position(taille / 2, taille / 2, taille);
	Chaine chaine = plateau_determiner_chaine(plateau, position_chaine);
	Libertes libertes = determiner_libertes(plateau, chaine);
	Territoire territoire = determiner_territoire(plateau, position(taille - 1, taille - 1, taille));

	const char* couleur_territoire;
	switch (ensemble_colore_couleur(territoire)) {
		case BLANC:
			couleur_territoire = C_YELLOW;
			break;
		case NOIR:
			couleur_territoire = C_BLUE;
			break;
		case VIDE:
			couleur_territoire = C_GREY;
			break;
	}

	for (int y = 0; y < taille; y++) {
		for (int x = 0; x < taille; x++) {
			Couleur couleur = plateau_get(plateau, x, y);

			// highlight de la chaine
			const char* ansi = C_NORMAL;
			if (chaine != NULL && gosh_appartient(chaine, position(x, y, taille)))
				ansi = C_RED;
			else if (libertes != NULL && gosh_appartient(libertes, position(x, y, taille)))
				ansi = C_GREEN;
			else if (territoire != NULL && gosh_appartient(territoire, position(x, y, taille)))
				ansi = couleur_territoire;

			printf("%s%d "C_NORMAL, ansi, couleur);
		}
		printf("\n");
	}
}

void test_get_set(void)
{
	Plateau p = creer_plateau(9);

	const uint32_t * data = plateau_data(p);

	puts("debut");
	for (size_t i = 0; i < plateau_data_size(9) / sizeof(uint32_t); ++i)
		printf("%x\n", data[i]);
	puts("fin");

	plateau_set(p, 0, 1, BLANC);
	printf("%d %d\n", plateau_get(p, 0, 1), BLANC);

	puts("debut");
	data = plateau_data(p);
	for (size_t i = 0; i < plateau_data_size(9) / sizeof(uint32_t); ++i)
		printf("%x\n", data[i]);
	puts("fin");
}

void test_position(void)
{
	assert(position_est_valide(position(0, 0, 19)));
	assert(! position_est_valide(POSITION_INVALIDE));

	int taille = 19;
	int max = taille - 1;
#define TEST(dir, x, y) position_est_valide(position_##dir( position(x, y, taille)))

	assert(!TEST(gauche, 0, 0));
	assert(TEST(droite, 0, 0));
	assert(!TEST(haut, 0, 0));
	assert(TEST(bas, 0, 0));

	assert(TEST(gauche, max, 0));
	assert(!TEST(droite, max, 0));
	assert(!TEST(haut, max, 0));
	assert(TEST(bas, max, 0));

	assert(TEST(gauche, max, max));
	assert(!TEST(droite, max, max));
	assert(TEST(haut, max, max));
	assert(!TEST(bas, max, max));

	assert(!TEST(gauche, 0, max));
	assert(TEST(droite, 0, max));
	assert(TEST(haut, 0, max));
	assert(!TEST(bas, 0, max));
#undef TEST
}

void test_ensemble_position(void)
{
#define NUM 100
	int taille = 19;
	Position positions[NUM];
	for (int i = 0; i < NUM; i++) {
		positions[i] = position(rand() % 19, rand() % 19, taille);
	}

	EnsemblePosition ensemble = creer_ensemble_position();

	for (int i = 0; i < NUM; i++) {
		gosh_ajouter(ensemble, positions[i]);
	}

	assert(gosh_nombre_elements(ensemble) == NUM);
	for (int i = 0; i < NUM; i++) {
		assert(gosh_appartient(ensemble, positions[i]));
	}

	detruire_ensemble_position(ensemble);
}

void test_plateau(void)
{
	int taille = 19;
	Plateau plateau = creer_plateau(taille);
	assert(plateau_get_taille(plateau) == taille);

	for (int y = 0; y < taille; y++) {
		for (int x = 0; x < taille; x++) {
			Couleur c = rand() % 3;
			plateau_set(plateau, x, y, c);
			assert(plateau_get(plateau, x, y) == c);
		}
	}

	afficher_plateau(plateau);
	detruire_plateau(plateau);
}

int main(void)
{
	long long seed = time(NULL);
	printf("(seed=%llu)\n", seed);
	srand(seed);

	test_get_set();
	test_position();
	test_ensemble_position();
	test_plateau();

	return EXIT_SUCCESS;
}

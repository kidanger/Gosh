#ifndef GOSH_GO_PLATEAU
#define GOSH_GO_PLATEAU

#include <stdlib.h> // size_t

#include "couleur.h"
#include "position.h"
#include "chaine.h"

typedef struct plateau* Plateau;

Plateau creer_plateau(size_t taille);
void detruire_plateau(Plateau plateau);

Couleur plateau_get(Plateau plateau, int i, int j);
void plateau_set(Plateau plateau, int i, int j, Couleur couleur);

size_t plateau_get_taille(Plateau plateau);

/** * @brief Produit la chaîne à laquelle appartient le pion à la position pos sur le plateau. S’il n’y a pas de pion sur cette case, alors le résultat retourné est NULL */
Chaine plateau_determiner_chaine(Plateau plateau, Position pos);

#endif


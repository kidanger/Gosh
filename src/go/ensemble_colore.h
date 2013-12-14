#ifndef GOSH_GO_ENSEMBLE_COLORE
#define GOSH_GO_ENSEMBLE_COLORE

#include "ensemble_positions.h"
#include "couleur.h"

typedef struct ensemble_colore* EnsembleColore;

EnsembleColore creer_ensemble_colore();
void detruire_ensemble_colore(EnsembleColore ensemble);

Couleur ensemble_colore_couleur(EnsembleColore ensemble);
EnsemblePositions ensemble_colore_positions(EnsembleColore ensemble);

#endif


#ifndef GOSH_GO_ENSEMBLE_POSITIONS
#define GOSH_GO_ENSEMBLE_POSITIONS

#include <stdbool.h>

#include "position.h"
#include "gosh_foreach.h"

typedef struct ensemble_positions* EnsemblePositions;

EnsemblePositions creer_ensemble_positions();
void detruire_ensemble_positions(EnsemblePositions ensemble);

bool ensemble_positions_vide(EnsemblePositions ensemble);
void ensemble_positions_ajouter(EnsemblePositions ensemble, Position position);
Position ensemble_positions_supprimer_tete(EnsemblePositions ensemble);
bool ensemble_positions_appartient(EnsemblePositions ensemble, Position position);

typedef struct iterateur_ensemble_positions* IterateurEnsemblePositions;

IterateurEnsemblePositions ensemble_positions_tete(EnsemblePositions);
bool ensemble_positions_suivant(IterateurEnsemblePositions);
Position ensemble_positions_courant(IterateurEnsemblePositions);
void ensemble_positions_detruire_iterateur(IterateurEnsemblePositions);

#endif


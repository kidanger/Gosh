#ifndef GOSH_GO_ENSEMBLE_POSITIONS
#define GOSH_GO_ENSEMBLE_POSITIONS

#include <stdbool.h>

#include "go/position.h"

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

#define FOREACH_POSITIONS(_ens, _pos, _do)\
	{ \
		IterateurEnsemblePositions _it = ensemble_positions_tete(_ens); \
		while (ensemble_positions_suivant(_it)) { \
			_pos = ensemble_positions_courant(_it); \
			_do \
		} \
		ensemble_positions_detruire_iterateur(_it); \
	}

#endif


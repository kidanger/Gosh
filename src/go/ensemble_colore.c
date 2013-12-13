#include <stdlib.h>

#include "alloc.h"
#include "go/ensemble_colore.h"

struct ensemble_colore {
	EnsemblePositions positions;
	Couleur couleur;
};

EnsembleColore creer_ensemble_colore(Couleur couleur) {
	EnsembleColore ensemble = gosh_alloc(*ensemble);
	ensemble->couleur = couleur;
	ensemble->positions = creer_ensemble_positions();
	return ensemble;
}

void detruire_ensemble_colore(EnsembleColore ensemble) {
	detruire_ensemble_positions(ensemble->positions);
	gosh_free(ensemble);
}

Couleur ensemble_colore_couleur(EnsembleColore ensemble) {
	return ensemble->couleur;
}
EnsemblePositions ensemble_colore_positions(EnsembleColore ensemble) {
	return ensemble->positions;
}

#include <stdlib.h>
#include <stdbool.h>

#include "alloc.h"
#include "go/ensemble_positions.h"

struct noeud_position {
	Position position;
	struct noeud_position* suivant;
};
struct ensemble_positions {
	struct noeud_position* tete;
};

EnsemblePositions creer_ensemble_positions() {
	EnsemblePositions ensemble = gosh_alloc(*ensemble);
	ensemble->tete = NULL;
	return ensemble;
}

void detruire_ensemble_positions(EnsemblePositions ensemble) {
	struct noeud_position* noeud = ensemble->tete;
	while (noeud != NULL) {
		struct noeud_position* suivant = noeud->suivant;
		gosh_free(noeud);
		noeud = suivant;
	}

	gosh_free(ensemble);
}

bool ensemble_positions_vide(EnsemblePositions ensemble) {
	return ensemble->tete == NULL;
}

void ensemble_positions_ajouter(EnsemblePositions ensemble, Position position) {
	struct noeud_position* nouveau = gosh_alloc(*nouveau);
	nouveau->position = position;
	nouveau->suivant = ensemble->tete;
	ensemble->tete = nouveau;
}

Position ensemble_positions_supprimer_tete(EnsemblePositions ensemble) {
	Position pos = ensemble->tete->position;
	ensemble->tete = ensemble->tete->suivant;
	return pos;
}

bool ensemble_positions_appartient(EnsemblePositions ensemble, Position position) {
	struct noeud_position* noeud = ensemble->tete;
	while (noeud != NULL) {
		if (POSITION_EQ(noeud->position, position)) {
			return true;
		}
		noeud = noeud->suivant;
	}
	return false;
}


struct iterateur_ensemble_positions {
	EnsemblePositions ensemble;
	struct noeud_position* courant;
	bool demarre;
};

IterateurEnsemblePositions ensemble_positions_tete(EnsemblePositions ensemble) {
	IterateurEnsemblePositions iterateur = gosh_alloc(*iterateur);
	iterateur->courant = NULL;
	iterateur->ensemble = ensemble;
	iterateur->demarre = false;
	return iterateur;
}
bool ensemble_positions_suivant(IterateurEnsemblePositions iterateur) {
	if (!iterateur->demarre) {
		iterateur->courant = iterateur->ensemble->tete;
		iterateur->demarre = true;
	} else {
		iterateur->courant = iterateur->courant->suivant;
	}
	return iterateur->courant;
}
Position ensemble_positions_courant(IterateurEnsemblePositions iterateur) {
	return iterateur->courant->position;
}
void ensemble_positions_detruire_iterateur(IterateurEnsemblePositions iterateur) {
	gosh_free(iterateur);
}

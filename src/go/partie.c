#include "gosh_alloc.h"
#include "go/partie.h"

Partie creer_partie(void) {
	Partie partie = gosh_alloc(*partie);
	partie->initialisee = false;
	return partie;
}

void detruire_partie(Partie partie) {
	gosh_free(partie);
}

void initialisation_partie(Partie partie, FonctionQuestions fonctionQuestions) {
	bool continuer = true;
	for (int i = 0; i < NOMBRE_QUESTIONS && continuer; i++) {
		continuer = continuer && fonctionQuestions(i, partie);
	}
	if (continuer) {
		partie->initialisee = true;
	}
}

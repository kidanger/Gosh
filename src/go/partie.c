#include "gosh_alloc.h"
#include "go/partie.h"
#include "go/plateau.h"
#include "go/position.h"

#define JOUEUR_SUIVANT(couleur) ((couleur) == JOUEUR_BLANC ? JOUEUR_NOIR : JOUEUR_BLANC)

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
	partie->joueur_courant = JOUEUR_NOIR;
}

bool partie_jouer_coup(Partie partie, s_Coup coup) {
	if (!POSITION_EST_VALIDE(coup.position)) {
		// le joueur passe son tour
		partie->joueur_courant = JOUEUR_SUIVANT(partie->joueur_courant);
		return true;
	} else {
		// placement d'un pion
		bool valide;
		s_Pion pion;
		pion.position = coup.position;
		pion.couleur = partie->joueur_courant == JOUEUR_BLANC ? BLANC : NOIR;
		Chaines capturees = plateau_capture_chaines(partie->plateau, pion, &valide);
		if (capturees)
			detruire_ensemble_chaine(capturees);
		partie->joueur_courant = JOUEUR_SUIVANT(partie->joueur_courant);
		return valide;
	}
}


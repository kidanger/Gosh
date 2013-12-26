#include "gosh_macros.h"
#include "go/libertes.h"
#include "go/libertes.h"

Libertes determiner_libertes(Plateau plateau, Chaine chaine) {
	if (! chaine)
		return NULL;

	int taille = plateau_get_taille(plateau);
	Libertes libertes = creer_ensemble_position();

	Position pos;
	gosh_foreach(pos, ensemble_colore_positions(chaine)) {
		const Position a_tester[] = {
			POSITION_GAUCHE(pos, taille),
			POSITION_DROITE(pos, taille),
			POSITION_HAUT(pos, taille),
			POSITION_BAS(pos, taille),
		};
		for (int i = 0; i < 4; i++) {
			Position p = a_tester[i];
			if (POSITION_EST_VALIDE(p) && plateau_get_at(plateau, p) == VIDE) {
				if (!ensemble_position_appartient(libertes, p)) {
					ensemble_position_ajouter(libertes, p);
				}
			}
		}
	}
	return libertes;
}

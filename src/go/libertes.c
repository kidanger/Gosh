#include "gosh_macros.h"
#include "go/libertes.h"
#include "go/libertes.h"

Libertes determiner_libertes(Plateau plateau, Chaine chaine) {
	if (! chaine)
		return NULL;

	Libertes libertes = creer_ensemble_position();

	Position pos;
	gosh_foreach(pos, ensemble_colore_positions(chaine)) {
		const Position a_tester[] = {
            position_gauche(pos),
            position_droite(pos),
            position_haut(pos),
            position_bas(pos),
		};
		for (int i = 0; i < 4; i++) {
			Position p = a_tester[i];
            if ( plateau_get_at(plateau, p) == VIDE) {
				if (!ensemble_position_appartient(libertes, p)) {
					ensemble_position_ajouter(libertes, p);
				}
			}
		}
	}
	return libertes;
}

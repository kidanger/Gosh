#include "go/territoire.h"
#include "go/plateau.h"


Territoire determiner_territoire(Plateau plateau, Position position) {
	Territoire territoire = creer_ensemble_colore(VIDE);
	EnsemblePosition territoire_positions = ensemble_colore_positions(territoire);

	EnsemblePosition possibles = creer_ensemble_position();
	Couleur couleur = -1;

	int taille = plateau_get_taille(plateau);
	ensemble_position_ajouter(possibles, position);

	/// @todo remplacer par une pile.
	while (!ensemble_position_vide(possibles)) {
		Position courante = ensemble_position_supprimer_tete(possibles);

		Couleur c = plateau_get_at(plateau, courante);
		if (c == VIDE) {
			if (!territoire_appartient(territoire, courante)) {
				ensemble_position_ajouter(territoire_positions, courante);

				const Position a_tester[] = {
					POSITION_GAUCHE(courante, taille),
					POSITION_DROITE(courante, taille),
					POSITION_HAUT(courante, taille),
					POSITION_BAS(courante, taille),
				};
				for (int p = 0; p < 4; p++) {
					if (POSITION_EST_VALIDE(a_tester[p]))
						ensemble_position_ajouter(possibles, a_tester[p]);
				}
			}
		} else {
			// si la case n'est pas vide, elle est à coté du territoire
			// on regarde sa couleur
			if (couleur == -1) // le territoire n'a pas encore de couleur défini
				couleur = c;
			else if (couleur != c) // le territoire est entouré par deux couleurs différentes
				couleur = VIDE;
		}

	}

	ensemble_colore_set_couleur(territoire, couleur);
	detruire_ensemble_position(possibles);
	return territoire;
}

bool territoire_appartient(Territoire territoire, Position position) {
	return gosh_appartient(ensemble_colore_positions(territoire),
	                       position);
}

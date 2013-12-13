#include <stdlib.h>

#include "go/chaine.h"

bool chaine_appartient(Chaine chaine, Position position) {
    return ensemble_positions_appartient(ensemble_colore_positions(chaine), position);
}


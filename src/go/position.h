#ifndef GOSH_GO_POSITION
#define GOSH_GO_POSITION

typedef unsigned short Position;

#define POSITION(x, y) ((y) * 19 + (x))

#define POSITION_X(p) ((p) % 19)
#define POSITION_Y(p) ((p) / 19)
#define POSITION_EQ(p1, p2) ((p1) == (p2))

#define POSITION_INVALIDE POSITION(19, 19)
#define POSITION_EST_VALIDE(p) (!POSITION_EQ((p), POSITION_INVALIDE))

#define POSITION_GAUCHE(p, taille) \
        (POSITION_X((p)) > 0 ? \
        POSITION(POSITION_X((p)) - 1, POSITION_Y((p))) : \
         POSITION_INVALIDE)

#define POSITION_DROITE(p, taille) \
        (POSITION_X((p)) < (taille)-1 ? \
        POSITION(POSITION_X((p)) + 1, POSITION_Y((p))) : \
         POSITION_INVALIDE)

#define POSITION_HAUT(p, taille) \
        (POSITION_Y((p)) > 0 ? \
        POSITION(POSITION_X((p)), POSITION_Y((p)) - 1) : \
         POSITION_INVALIDE)

#define POSITION_BAS(p, taille) \
        (POSITION_Y((p)) < (taille)-1 ? \
        POSITION(POSITION_X((p)), POSITION_Y((p)) + 1) : \
         POSITION_INVALIDE)

#endif


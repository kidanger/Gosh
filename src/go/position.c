#include "go/position.h"

Position POSITION_INVALIDE = {-1, -1, 0, 0};

Position position(size_t x, size_t y, size_t taille)
{
    if (x >= taille || y >= taille)
        return POSITION_INVALIDE;
    Position p = {x, y, taille,0};
    return p;
}

bool position_est_valide(Position pos)
{
    return pos.x < pos.coord_max && pos.y < pos.coord_max && ! pos.zero;
}

Position position_gauche(Position pos)
{
    if (! position_est_valide(pos) )
        return POSITION_INVALIDE;
    if (! pos.x)
        return POSITION_INVALIDE;
    pos.x--;
    return pos;
}

Position position_droite(Position pos)
{
    if( ! position_est_valide(pos) )
        return POSITION_INVALIDE;
    if( ++pos.x >= pos.coord_max)
        return POSITION_INVALIDE;
    return pos;
}

Position position_haut(Position pos)
{
    if( ! position_est_valide(pos) )
        return POSITION_INVALIDE;
    if( ! pos.y)
        return POSITION_INVALIDE;
    pos.y--;
    return pos;
}

Position position_bas(Position pos)
{
    if( ! position_est_valide(pos) )
        return POSITION_INVALIDE;
    if( ++pos.y >= pos.coord_max)
        return POSITION_INVALIDE;
    return pos;
}

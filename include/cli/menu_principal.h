#ifndef MENU_PRINCIPAL_H
#define MENU_PRINCIPAL_H

/** @file menu_principal.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup cli
 */


/** @ingroup cli
 *  @brief Affiche le menu principal.
 *
 *  Demande à l'utilisateur de faire un choix parmis les options proposées :
 *  * Créer une nouvelle partie
 *  * Charger une partie
 *  * Voir les crédits
 *  * Quitter
 *
 *  @warning ne retourne pas tant que l'utilisateur ne quitte pas le menu.
 */
void afficher_menu_principal(void);

#endif // MENU_PRINCIPAL_H

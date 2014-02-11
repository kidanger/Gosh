#ifndef __CONCAT_H
#define __CONCAT_H

/** @file concat.h
 *  @author Jéremy Anger
 *  @author Denis Migdal
 *  @date 08/02/2014
 *  @ingroup outils
 *  @brief Macros permettant de concaténer les arguments passés en paramètre.
 *  @see http://www.parashift.com/c++-faq/macros-with-token-pasting.html
 */


/** @def CONCAT_3(a,b,c)
 *  @ingroup outils
 *  @brief Concatène les trois arguments passés en paramètre.
 */
#define CONCAT_3(a,b,c) CONCAT_3_H(a,b,c)


/** @def CONCAT_3_H(a,b,c)
 *  @ingroup outils
 *  @brief Concatène les trois arguments passés en paramètre.
 *  @warning si a, b ou c sont des macros, ils ne seront pas remplacés par leur valeur,
 *  utilisez CONCAT_3 à la place.
 */
#define CONCAT_3_H(a,b,c) a ## b ## c


/** @def CONCAT_2(a,b)
 *  @ingroup outils
 *  @brief Concatène les deux arguments passés en paramètre.
 */
#define CONCAT_2(a,b) CONCAT_2_H(a,b)


/** @def CONCAT_2_H(a,b)
 *  @ingroup outils
 *  @brief Concatène les deux arguments passés en paramètre.
 *  @warning si a ou b sont des macros, ils ne seront pas remplacés par leur valeur,
 *  utilisez CONCAT_2 à la place.
 */
#define CONCAT_2_H(a,b) a ## b

#endif

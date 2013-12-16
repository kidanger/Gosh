/* from http://www.parashift.com/c++-faq/macros-with-token-pasting.html */
#define CONCAT_3(a,b,c) CONCAT_3_H(a,b,c)
#define CONCAT_3_H(a,b,c) a ## b ## c

#define CONCAT_2(a,b) CONCAT_2_H(a,b)
#define CONCAT_2_H(a,b) a ## b

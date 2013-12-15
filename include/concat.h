/* from http://www.parashift.com/c++-faq/macros-with-token-pasting.html */
#define C3(a,b,c) C3_H(a,b,c)
#define C3_H(a,b,c) a ## b ## c

#define C2(a,b) C2_H(a,b)
#define C2_H(a,b) a ## b

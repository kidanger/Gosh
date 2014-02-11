Gosh
====

Présentation
=======

Gosh est un projet de jeu de Go en C réalisé dans le cadre d'un projet de 1ère année informatique à l'ENSICAEN.
Vous pouvez tester le jeu sans le télécharger, à l'adresse suivante : [http://kidanger.github.io/Gosh/](http://kidanger.github.io/Gosh/)

Compiler
=======

Dépendances
------------

* gcc >= 4.8
* cmake >= 2.8
* SDL >= 1.2
* SDL_TTF >= 2.0
* gnugo (optionniel)

Sur GNU/Linux
------------

```
mkdir build
cd build
cmake ..
make
sudo make install
```

Sur Windows
------------

```
md build
cd build
cmake ..
make
make install
```

Exécuter
=======

Mode console
------------

Sous Linux, entrez la commande goshcli.\\
Goshcli utilise l'utf-8, vous pouvez donc rencontrer des problèmes d'encodages si votre console n'est pas configurée pour utiliser l'utf-8.

Sous Windows, recherchez l'exécutable goshcli.exe et doublez-cliquez dessus.


Mode graphique
--------------

Sous Linux, entrez la commande goshsdl.

Sous Windows, recherchez l'exécutable goshsdl.exe et doublez-cliquez dessus.

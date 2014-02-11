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
cmake -DCMAKE_BUILD_TYPE=Release ..
make
sudo make install
```

Sur Windows
------------

```
md build
cd build
cmake -DCMAKE_BUILD_TYPE=Release ..
make
make install
```

Générer la documentation
------------------------

Pour générer la documentation Doxygen, tapez les commandes suivantes et ouvrez *doc/html/index.html*.
```
cd doc
doxygen
```

Exécuter
=======

Mode console
------------

Sous Linux, entrez la commande *goshcli* ou *./build/src/cli/goshcli* si le programme n'est pas installé.

Goshcli utilise l'UTF-8, vous pouvez donc rencontrer des problèmes d'encodages si votre console n'est pas configurée pour utiliser l'UTF-8


Mode graphique
--------------

Sous Linux, entrez la commande *goshsdl* ou *./build/src/sdl/goshsdl* si le programme n'est pas installé.

Sous Windows, recherchez l'exécutable goshsdl.exe et doublez-cliquez dessus.


# Firmware (Sequence)

Une extension du projet initial [Arbalet Lava](https://github.com/arbalet-project/arbadoc/wiki). Ce projet vise à remplacer la paire (Arduino + Raspberry pi) par un ESP32, testé sur un ESP-32S (NodeMCU).

## Bibliothèque

Installez ces bibliothèque dans `$HOME/Arduino/libraries` ou $HOME/sketchbook/libraries
```
https://github.com/Makuna/NeoPixelBus
```

## Le but

Le but de ce firmware est d’implémenter plusieurs interactions sur la table Arbalet Lava (équipé d’un ESP32 au lieu de la combinaison Arduino + Raspberry pi) à partir d’un ordinateur connecté via le port série.

## Installation

En utilisant l’application Arduino IDE, télécharger la séquence.ino sur un ESP32, par le port USB et l’installer sur la table.

## Qu'est-ce qui fonctionne ?

USB Serial :
	- update : stable
	- handshake : pas testé

La réception des données par ESP32 sur le port Série est la suivante :
	- d'abord 4 lettres (ARBA ) qui permettent de vérifier que nous sommes au début de la trame
	- le numéro de version du logiciel
	- Une lettre capital, pour indiquer la commande à éffectuer
	- et une suite de nombres qui correspondent au R(0 à 255) G(0 à 255) B(0 à 255) de chaque pixel

example : {A,R,B,A,1,U,52,68,9,87,116,53,3,46,218,98,76,5,43,3,45,6,78,98,76,67,89,...,213}

CONVERSION TOOLS :
fadeOut() : stable
map() : à améliorer

fadeout() a été modifié pour s'adapter à la nouvelle bibliothèque ( NeoPixelBus ).
map() a été adapté pour introduire les variables cols et rows qui remplace les variables en brut.

EEPROM : pas testé

COLOR WHEEL : stable et adapté à la nouvelle bibliothèque.

Lineaire : stable et adapté à la nouvelle bibliothèque.

Bluetooth : pas testé et non adapté pour ESP32. Encore utilisé par Tetris

Tetris : à améliorer puisque l'affichage est défaillant.

Snake : à améliorer puisque l'affichage est défaillant.

## Problème

L’électricité sur la table d’essai a ralenti le projet et certaines fonctionnalités n’ont pu être testées et améliorées en conséquence.




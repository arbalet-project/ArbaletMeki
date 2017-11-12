# Architecture logicielle

Les caractéristiques de base de chaque animation seront précisées par une interface.

## Spécifités de l'interface

L'interface spécifise plusieurs méthodes ;

### Créer l'objet de l'animation

Un seul même objet est utilisé pour toutes les animations du même type ;

On utilise le constructeur :

	Animation(int x, int y)

### Début d'une animation

	int setup(int x, int y, int loops)

Paramètres :

int x - largeur du mur

int y - hauteur du mur

int loops - le nombre de tours de boucle conseillés

Retour :

int loops - le nombre de tours de boucle que vous souhaitez. Essayez de donner une valeur la plus proche possible de la valeur du paramètre loop. Le séquenceur essaiera de vous donner le nombre que vous retournez, mais il est possible que le séquenceur arrête l'animation en cours.

### Boucle

Il est interdit d'utiliser un appel de la fonction loop pour plusieurs itérations de l'animation. UN APPEL = UNE ITÉRATION.

	void loop()

# Comment utiliser GIT ?

Petit tutoriel rapide (et sans profondeur) pour ceux qui n'ont jamais utilisé GIT.

## Depuis le serveur

### Créer votre compte git (différent du compte github !)

	git config --global user.name "Votre pseudo"
	git config --global user.email "Votre@mail.com"

### Récupérer le projet

	git clone https://github.com/CLOVIS-AI/arbalet_v1.git

### Mettre à jour la version locale

	git pull

## Faire des mises à jour

Git fonctionne en deux étapes :
 1. Mettre à jour en local
 2. Envoyer les mises à jour au serveur

### Ajouter un nouveau fichier au projet

	git add CHEMIN_VERS_LE_FICHIER

### Mettre à jour un fichier déjà créé dans le projet

	git commit -m 'DESCRIPTION_DE_LA_MISE_A_JOUR'

### Mettre à jour tous les fichiers

	git commit -am 'DESCRIPTION_DE_LA_MISE_A_JOUR'

### Envoyer les mises à jour au serveur

Puisque le repo est stocké sur GitHub, vous aurez besoin d'un compte sur GitHub pour effectuer cette commande.

	git push

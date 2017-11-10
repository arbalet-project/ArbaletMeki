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

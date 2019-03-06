<h1 align="center">
  <br>
  <a href="http://www.arbalet-project.org/"><img src="icon.png" alt="Arbalet" width="200"></a>

  Arbalet Meki Live
  <br>
</h1>

<div align="center">

[![twitter](https://img.shields.io/twitter/follow/arbalet_project.svg?style=social)](https://twitter.com/arbalet_project)
</div>

<h4 align="center">Documentation développeur</h4>

<p align="center">
  <a href="#présentation">Présentation</a> •
  <a href="#schéma">Schéma</a> •
  <a href="#démarrage">Démarrage</a> •
  <a href="#questions">Questions</a> •
  <a href="#dépannages">Dépannages</a> •
  <a href="#support">Support</a>
</p>

<div align="center" >

![screenshot](arbalet.png)

</div>

# Présentation 
Cette documentation s'adresse aux développeurs

# Schéma 
<div align="center" >
<img src="schema.png" alt="schema" width="50%">
</div>
Explication 

# Démarrage

## Framework / librairies utilisées
### Application Ordinateur 

- [Blockly](https://developers.google.com/blockly/)
- [ElectronJS](https://electronjs.org/)
- [Express.js](https://expressjs.com/fr/)
- [WebSocket](https://socket.io/)
- [Johnny-Five](http://johnny-five.io/)
- [Node-pixel](https://github.com/ajfisher/node-pixel)
- [Serial port](https://developers.google.com/blockly/)
- [Jquery](https://jquery.com/)

### Application Mobile 
- [Ionic](https://ionicframework.com/docs/v3/)

### Hardware 
- [Arduino](https://www.arduino.cc/reference/en/)
- [ESP32](https://docs.zerynth.com/latest/official/board.zerynth.nodemcu_esp32/docs/index.html)

# Questions

## Création de blocs Blockly
La création de blocs se fait par l'intermédiaire de l'éditeur de programmation visuelle de Blockly. Il se trouve à cette [adresse](https://blockly-demo.appspot.com/static/demos/blockfactory/index.html) avec la documentation associé à l'éditeur
[Blockly Developer Tools](https://developers.google.com/blockly/guides/create-custom-blocks/blockly-developer-tools).

Les blocs créés sont stockés dans différents fichiers :
- Définition des blocs dans [`blockdefinition.js`](../desktop/public/blockly/blockdefinition.js)
- Déclaration des blocs dans [`generatorstub.js`](../desktop/public/blockly/generatorstub.js)
- Affichage des blocs dans [`index.html`](../desktop/public/index.html)

# Dépannages

# Support

- <img src="site.png" style="vertical-align:middle" width ="20px"> Website at [`arbaletproject.org`](http://www.arbalet-project.org/)

- <img src="twitter.svg" style="vertical-align:middle"  width ="22px">Twitter at [`@arbalet_project`](https://twitter.com/arbalet_project)

- <img src="linkedin.svg" style="vertical-align:middle" width ="20px"> Linkedin at [`arbalet`](https://www.linkedin.com/company/arbalet/)
- <img src="blog.png" style="vertical-align:middle" width ="20px"> Blog at [`arbalet-blog`](http://talk.arbalet-project.org/)
---
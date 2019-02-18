/*
Blockly.Blocks['color_pixel'] = {
    init: function() {
      this.appendValueInput("`${COLOR_PIXEL_TITLE}`")
          .setCheck(null)
          .appendField("Colorer le pixel");
      this.appendValueInput("column")
          .setCheck(null);
      this.appendValueInput("color")
          .setCheck(null)
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("en");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
   this.setTooltip("Ajouter une ligne et une colonne, puis la couleur");
   this.setHelpUrl("");
    }
};
*/


//Colorer le pixel %1 %2 en %3
  Blockly.defineBlocksWithJsonArray([{
    "type": "color_pixel",
    "message0": "Colorer le pixel %1 %2 en %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "row"
      },
      {
        "type": "input_value",
        "name": "column"
      },
      {
        "type": "input_value",
        "name": "color",
        "align": "RIGHT"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "Ajouter une ligne et une colonne, puis la couleur",
    "helpUrl": ""
  }]);

 Blockly.Blocks['color_all_pixels'] = {
  init: function() {
    this.appendValueInput("color")
        .setCheck(null)
        .appendField("Colorer tous les pixels en");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Choisir une couleur");
 this.setHelpUrl("");
  }
};

/*Blockly.Blocks['turn_off'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Tout éteindre");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
   this.setTooltip("Ajouter une ligne et une colonne");
   this.setHelpUrl("");
    }
  };
*/
Blockly.defineBlocksWithJsonArray([{
    "type": "turn_off",
    "message0": "%{BKY_TURN_OFF_TITLE}",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }]);

Blockly.Blocks['turn_off_the_pixel'] = {
    init: function() {
      this.appendValueInput("row")
          .setCheck(null)
          .appendField("Eteindre le pixel");
      this.appendValueInput("column")
          .setCheck(null);
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
   this.setTooltip("Eteindre tous les pixels");
   this.setHelpUrl("");
    }
  };

Blockly.Blocks['sleep'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Attendre")
          .appendField(new Blockly.FieldTextInput("0"), "time")
          .appendField(new Blockly.FieldDropdown([["s","'s'"], ["ms","'ms'"]]), "list");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
   this.setTooltip("Ajouter un temps, puis choisir une mesure de temps");
   this.setHelpUrl("");
    }
  };
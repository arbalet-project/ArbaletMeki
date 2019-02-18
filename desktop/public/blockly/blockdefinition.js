/*
Blockly.Blocks['color_pixel'] = {
    init: function() {
      this.appendValueInput("row")
          .setCheck("Number")
          .appendField("Colorer le pixel");
      this.appendValueInput("column")
          .setCheck("Number");
      this.appendValueInput("color")
          .setCheck('Colour')
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("en");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(0);
   this.setTooltip("");
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
        .setCheck("Colour")
        .appendField("Colorer tous les pixels en");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

/*Blockly.Blocks['turn_off'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Tout éteindre");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(0);
   this.setTooltip("");
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
          .setCheck("Number")
          .appendField("Eteindre le pixel");
      this.appendValueInput("column")
          .setCheck("Number");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(0);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };

  Blockly.Blocks['var_max_column'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("maxColonne");
      this.setInputsInline(true);
      this.setOutput(true, "Number");
      this.setColour(0);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };
  
  Blockly.Blocks['var_max_line'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("maxLigne");
      this.setOutput(true, "Number");
      this.setColour(0);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };
  
  Blockly.Blocks['pixel_color'] = {
    init: function() {
      this.appendValueInput("row")
          .setCheck("Number")
          .appendField("Couleur du pixel");
      this.appendValueInput("column")
          .setCheck("Number");
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setColour(20);
   this.setTooltip("");
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
      this.setColour(120);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };
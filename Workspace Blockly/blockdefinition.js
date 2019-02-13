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
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['randomly_color_pixel'] = {
  init: function() {
    this.appendValueInput("row")
        .setCheck("Number")
        .appendField("Colorer le pixel aléatoirement");
    this.appendValueInput("column")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['turn_off'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Tout éteindre");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };

Blockly.Blocks['color_pixel'] = {
  init: function() {
    this.appendValueInput("row")
        .setCheck("Number")
        .appendField("Colorer le pixel");
    this.appendValueInput("column")
        .setCheck("Number");
    this.appendValueInput("red")
        .setCheck("Number")
        .appendField("en rouge");
    this.appendValueInput("green")
        .setCheck("Number")
        .appendField("en vert");
    this.appendValueInput("blue")
        .setCheck("Number")
        .appendField("en bleu");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['sleep'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Attendre")
          .appendField(new Blockly.FieldTextInput("0"), "time")
          .appendField(new Blockly.FieldDropdown([["s","seconde"], ["ms","milliseconde"]]), "list");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };


Blockly.Blocks['color_pixel_select'] = {
    init: function() {
      this.appendValueInput("row")
          .setCheck("Number")
          .appendField("Colorer le pixel");
      this.appendValueInput("column")
          .setCheck("Number");
      this.appendDummyInput()
          .appendField("en")
          .appendField(new Blockly.FieldColour("#ff0000"), "couleur");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };
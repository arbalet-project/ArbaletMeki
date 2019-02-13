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
    this.appendValueInput("text")
        .setCheck("Number")
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
    this.appendValueInput("NAME")
        .setCheck(null)
        .appendField("Attendre")
        .appendField(new Blockly.FieldDropdown([["s","seconde"], ["ms","milliseconde"]]), "list");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
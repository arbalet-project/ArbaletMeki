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

Blockly.Blocks['turn_off'] = {
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
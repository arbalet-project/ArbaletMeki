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

Blockly.defineBlocksWithJsonArray([{
    "type": "color_pixel",
    "message0": "%{BKY_COLOR_PIXEL_TITLE}",
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
    "colour": 0,
    "tooltip": "%{BKY_COLOR_PIXEL_TOOLTIP}",
    "helpUrl": ""
  }]);
  
/*
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
};*/
Blockly.defineBlocksWithJsonArray([
{
  "type": "color_all_pixels",
  "message0": "%{BKY_COLOR_ALL_PIXELS_TITLE}",
  "args0": [
    {
      "type": "input_value",
      "name": "color",
      "check": "Colour"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 0,
  "tooltip": "%{BKY_COLOR_ALL_PIXELS_TOOLTIP}",
  "helpUrl": ""
}]);


/*
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
};*/

Blockly.defineBlocksWithJsonArray([
{
  "type": "turn_off_the_pixel",
  "message0": "%{BKY_TURN_OFF_THE_PIXEL_TITLE}",
  "args0": [
    {
      "type": "input_value",
      "name": "row",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "column",
      "check": "Number"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 0,
  "tooltip": "%{BKY_TURN_OFF_THE_PIXEL_TOOLTIP}",
  "helpUrl": ""
}]);

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
    "colour": 0,
    "tooltip": "%{BKY_TURN_OFF_TOOLTIP}",
    "helpUrl": ""
  }]);

/*
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
  };*/

  Blockly.defineBlocksWithJsonArray([
  {
    "type": "var_max_column",
    "message0": "%{BKY_VAR_MAX_COLUMN_TITLE}",
    "inputsInline": true,
    "output": "Number",
    "colour": 0,
    "tooltip": "%{BKY_VAR_MAX_COLUMN_TOOLTIP}",
    "helpUrl": ""
  }]);
  

  /*
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
  */
 Blockly.defineBlocksWithJsonArray([
 {
  "type": "var_max_line",
  "message0": "%{BKY_VAR_MAX_ROW_TITLE}",
  "output": "Number",
  "colour": 0,
  "tooltip": "%{BKY_VAR_MAX_ROW_TOOLTIP}",
  "helpUrl": ""
}]);

/*
  Blockly.Blocks['pixel_color'] = {
    init: function() {
      this.appendValueInput("row")
          .setCheck("Number")
          .appendField("Couleur du pixel");
      this.appendValueInput("column")
          .setCheck("Number");
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setColour(0);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };  
*/
Blockly.defineBlocksWithJsonArray([

{
  "type": "pixel_color",
  "message0": "%{BKY_PIXEL_COLOR_TITLE}",
  "args0": [
    {
      "type": "input_value",
      "name": "row",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "column",
      "check": "Number"
    }
  ],
  "inputsInline": true,
  "output": null,
  "colour": 20,
  "tooltip": "%{BKY_PIXEL_COLOR_TOOLTIP}",
  "helpUrl": ""
}]);

/*
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
  */
 Blockly.defineBlocksWithJsonArray([
 {
  "type": "sleep",
  "message0": "%{BKY_SLEEP_TITLE}",
  "args0": [
    {
      "type": "field_input",
      "name": "time",
      "text": "0"
    },
    {
      "type": "field_dropdown",
      "name": "list",
      "options": [
        [
          "s",
          "'s'"
        ],
        [
          "ms",
          "'ms'"
        ]
      ]
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "%{BKY_SLEEP_TOOLTIP}",
  "helpUrl": ""
}]);
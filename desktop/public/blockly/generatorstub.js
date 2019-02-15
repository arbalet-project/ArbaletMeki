Blockly.JavaScript['turn_off_the_pixel'] = function(block) {
  var value_row = Blockly.JavaScript.valueToCode(block, 'row', Blockly.JavaScript.ORDER_ATOMIC);
  var value_column = Blockly.JavaScript.valueToCode(block, 'column', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = `switchOffPixel(${value_row},${value_column});`;
  return code;
};

Blockly.JavaScript['randomly_color_pixel'] = function(block) {
  var value_row = Blockly.JavaScript.valueToCode(block, 'row', Blockly.JavaScript.ORDER_ATOMIC);
  var value_column = Blockly.JavaScript.valueToCode(block, 'column', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = `setRandomPixel(${value_row},${value_column});`;
  return code;
};


Blockly.JavaScript['turn_off'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'switchOffAllPixels();';
  return code;
};

Blockly.JavaScript['color_pixel'] = function(block) {
  var value_row = Blockly.JavaScript.valueToCode(block, 'row', Blockly.JavaScript.ORDER_ATOMIC);
  var value_column = Blockly.JavaScript.valueToCode(block, 'column', Blockly.JavaScript.ORDER_ATOMIC);
  var value_red = parseInt(Blockly.JavaScript.valueToCode(block, 'red', Blockly.JavaScript.ORDER_ATOMIC),10);
  var value_green = parseInt(Blockly.JavaScript.valueToCode(block, 'green', Blockly.JavaScript.ORDER_ATOMIC),10);
  var value_blue = parseInt(Blockly.JavaScript.valueToCode(block, 'blue', Blockly.JavaScript.ORDER_ATOMIC),10);
  // TODO: Assemble JavaScript into code variable.
  var code = `setPixel(${value_row},${value_column},{r:${value_red},g:${value_green},b:${value_blue}});`;
  return code;
};

Blockly.JavaScript['sleep'] = function(block) {
  var text_time = block.getFieldValue('time');
  var dropdown_list = block.getFieldValue('list');
  // TODO: Assemble JavaScript into code variable.
  var code = `sleep(${text_time},${dropdown_list});`;
  return code;
};

Blockly.JavaScript['color_pixel_select'] = function(block) {
  var value_row = Blockly.JavaScript.valueToCode(block, 'row', Blockly.JavaScript.ORDER_ATOMIC);
  var value_column = Blockly.JavaScript.valueToCode(block, 'column', Blockly.JavaScript.ORDER_ATOMIC);
  var colour_couleur = block.getFieldValue('couleur');
  // TODO: Assemble JavaScript into code variable.
  var code = `setPixel(${value_row},${value_column},'${colour_couleur}');`;
  return code;
};
Blockly.JavaScript['color_pixel'] = function(block) {
  var value_row = Blockly.JavaScript.valueToCode(block, 'row', Blockly.JavaScript.ORDER_ATOMIC);
  var value_column = Blockly.JavaScript.valueToCode(block, 'column', Blockly.JavaScript.ORDER_ATOMIC);
  var value_color = Blockly.JavaScript.valueToCode(block, 'color', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = `setPixel(${value_row},${value_column},${value_color});`;
  return code;
};

Blockly.JavaScript['color_all_pixels'] = function(block) {
  var value_color = Blockly.JavaScript.valueToCode(block, 'color', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = `setAllPixels(${value_color})`;
  return code;
};

Blockly.JavaScript['turn_off'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'switchOffAllPixels();';
  return code;
};


Blockly.JavaScript['turn_off_the_pixel'] = function(block) {
  var value_row = Blockly.JavaScript.valueToCode(block, 'row', Blockly.JavaScript.ORDER_ATOMIC);
  var value_column = Blockly.JavaScript.valueToCode(block, 'column', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = `switchOffPixel(${value_row},${value_column});`;
  return code;
};

Blockly.JavaScript['sleep'] = function(block) {
  var text_time = block.getFieldValue('time');
  var dropdown_list = block.getFieldValue('list');
  // TODO: Assemble JavaScript into code variable.
  var code = `sleep(${text_time},${dropdown_list});`;
  return code;
};

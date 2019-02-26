Blockly.JavaScript['color_pixel'] = function(block) {
  var value_row = Blockly.JavaScript.valueToCode(block, 'row', Blockly.JavaScript.ORDER_ATOMIC);
  var value_column = Blockly.JavaScript.valueToCode(block, 'column', Blockly.JavaScript.ORDER_ATOMIC);
  var value_color = Blockly.JavaScript.valueToCode(block, 'color', Blockly.JavaScript.ORDER_ATOMIC);

  var code = `setPixel(${value_row},${value_column},${value_color});`;
  return code;
};

Blockly.JavaScript['color_all_pixels'] = function(block) {
  var value_color = Blockly.JavaScript.valueToCode(block, 'color', Blockly.JavaScript.ORDER_ATOMIC);

  var code = `setAllPixels(${value_color});`;
  return code;
};

Blockly.JavaScript['turn_off'] = function(block) {

  var code = 'switchOffAllPixels();';
  return code;
};


Blockly.JavaScript['turn_off_the_pixel'] = function(block) {
  var value_row = Blockly.JavaScript.valueToCode(block, 'row', Blockly.JavaScript.ORDER_ATOMIC);
  var value_column = Blockly.JavaScript.valueToCode(block, 'column', Blockly.JavaScript.ORDER_ATOMIC);

  var code = `switchOffPixel(${value_row},${value_column});`;
  return code;
};

Blockly.JavaScript['var_max_column'] = function(block) {

  var code = 'nbColumns - 1';

  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['var_max_line'] = function(block) {
  var code = 'nbRows - 1';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['sleep'] = function(block) {
  var text_time = block.getFieldValue('time');
  var dropdown_list = block.getFieldValue('list');

  var code = `sleep(${text_time},${dropdown_list});`;
  return code;
};

Blockly.JavaScript['pixel_color'] = function(block) {
  var value_row = Blockly.JavaScript.valueToCode(block, 'row', Blockly.JavaScript.ORDER_ATOMIC);
  var value_column = Blockly.JavaScript.valueToCode(block, 'column', Blockly.JavaScript.ORDER_ATOMIC);

  var code = `getPixelColor(${value_row},${value_column})`;

  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['draw_letter'] = function(block) {
  var value_letter = Blockly.JavaScript.valueToCode(block, 'letter', Blockly.JavaScript.ORDER_ATOMIC);
  var value_row = Blockly.JavaScript.valueToCode(block, 'row', Blockly.JavaScript.ORDER_ATOMIC);
  var value_column = Blockly.JavaScript.valueToCode(block, 'column', Blockly.JavaScript.ORDER_ATOMIC);
  var value_color = Blockly.JavaScript.valueToCode(block, 'color', Blockly.JavaScript.ORDER_ATOMIC);

  var code = `drawLetter(${value_letter},${value_row},${value_column},${value_color});`;
  return code;
};

Blockly.JavaScript['main_script'] = function(block) {
  var statements_script = Blockly.JavaScript.statementToCode(block, 'script');
  return statements_script;
};

Blockly.JavaScript['event_key'] = function(block) {
  var dropdown_key = block.getFieldValue('key');
  var statements_event_code = Blockly.JavaScript.statementToCode(block, 'event_code');
  var code = statements_event_code;
  return code;
};
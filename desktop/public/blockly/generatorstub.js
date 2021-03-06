/**
 * @fileoverview This file contains functions used to generate JS code from our custom blocks
 */

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

  var code = `await sleep(${text_time},${dropdown_list});`;
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
  var dropdown_direction = block.getFieldValue('direction');

  var code = `drawLetter(${value_letter},${value_row},${value_column},${value_color},${dropdown_direction});`;
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

Blockly.JavaScript['colour_random'] = function(block) {
  return ['colourRandom()', Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['colour_rgb'] = function(block) {
  // Compose a colour from RGB components expressed as percentages.
  var red = Blockly.JavaScript.valueToCode(block, 'RED',
      Blockly.JavaScript.ORDER_COMMA) || 0;
  var green = Blockly.JavaScript.valueToCode(block, 'GREEN',
      Blockly.JavaScript.ORDER_COMMA) || 0;
  var blue = Blockly.JavaScript.valueToCode(block, 'BLUE',
      Blockly.JavaScript.ORDER_COMMA) || 0;
  var code = `colourRgb(${red},${green},${blue})`;
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['colour_blend'] = function(block) {
  // Blend two colours together.
  var c1 = Blockly.JavaScript.valueToCode(block, 'COLOUR1',
      Blockly.JavaScript.ORDER_COMMA) || '\'#000000\'';
  var c2 = Blockly.JavaScript.valueToCode(block, 'COLOUR2',
      Blockly.JavaScript.ORDER_COMMA) || '\'#000000\'';
  var ratio = Blockly.JavaScript.valueToCode(block, 'RATIO',
      Blockly.JavaScript.ORDER_COMMA) || 0.5;

  var code = `colourBlend(${c1},${c2},${ratio})`;
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['math_random_int'] = function(block) {
  // Random integer between [X] and [Y].
  var argument0 = Blockly.JavaScript.valueToCode(block, 'FROM',
      Blockly.JavaScript.ORDER_COMMA) || '0';
  var argument1 = Blockly.JavaScript.valueToCode(block, 'TO',
      Blockly.JavaScript.ORDER_COMMA) || '0';
  var code = `mathRandomInt(${argument0},${argument1})`;
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
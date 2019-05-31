/**
 * @fileoverview This file define our custom blocks
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
  },
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
  },
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
  },
  {
    "type": "turn_off",
    "message0": "%{BKY_TURN_OFF_TITLE}",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 0,
    "tooltip": "%{BKY_TURN_OFF_TOOLTIP}",
    "helpUrl": ""
  },
  {
    "type": "var_max_column",
    "message0": "%{BKY_VAR_MAX_COLUMN_TITLE}",
    "inputsInline": true,
    "output": "Number",
    "colour": 0,
    "tooltip": "%{BKY_VAR_MAX_COLUMN_TOOLTIP}",
    "helpUrl": ""
  },
  {
    "type": "var_max_line",
    "message0": "%{BKY_VAR_MAX_ROW_TITLE}",
    "output": "Number",
    "colour": 0,
    "tooltip": "%{BKY_VAR_MAX_ROW_TOOLTIP}",
    "helpUrl": ""
  },
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
  },
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
  },
  {
    "type": "draw_letter",
    "message0": "Dessiner la lettre %1 à %2 %3 en %4 %5",
    "args0": [
      {
        "type": "input_value",
        "name": "letter",
        "check": "String"
      },
      {
        "type": "input_value",
        "name": "row",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "column",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "color",
        "check": "Colour"
      },
      {
        "type": "field_dropdown",
        "name": "direction",
        "options": [
          [
            "↕",
            "0"
          ],
          [
            "↔",
            "1"
          ]
        ]
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 165,
    "tooltip": "Dessine la lettre écrite dans la couleur correspondante. Les coordonnées sont celles du coin en haut à gauche.",
    "helpUrl": ""
  },
  {
    "type": "event_key",
    "message0": "Touche %1 pressée %2 %3",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "key",
        "options": [
          [
            "↑",
            "up"
          ],
          [
            "→",
            "right"
          ],
          [
            "↓",
            "down"
          ],
          [
            "←",
            "left"
          ],
          [
            "espace",
            "space"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "event_code"
      }
    ],
    "inputsInline": false,
    "colour": 270,
    "tooltip": "Le code contenu dans ce bloc s'exécute lorsque la touche correspondante est pressée.",
    "helpUrl": ""
  },
  {
    "type": "main_script",
    "message0": "Programme %1 %2",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "script"
      }
    ],
    "colour": 270,
    "tooltip": "C'est ici que s'écrit le programme principal. Les blocs en dehors de celui-ci ne seront pas exécutés",
    "helpUrl": ""
  },
	{
    "type": "note_on_list",
    "message0": "Jouer %1 %2 %3 %4",
    "args0": [      
			{
        "type": "field_dropdown",
        "name": "CHANNEL",
        "options": [
          ["can 1", "1"],
          ["can 2", "2"],
          ["can 3", "3"],
					["can 4", "4"],
					["can 5", "5"],
					["can 6", "6"],
					["can 7", "7"],
					["can 8", "8"],
					["can 9", "9"],		
					["can 10", "10"],
					["can 11", "11"],
					["can 12", "12"],
					["can 13", "13"],
					["can14", "14"],
					["can 15", "15"],
					["can 16", "16"],
        ]
      },
			{
        "type": "field_dropdown",
        "name": "NOTE",
        "options": [
          ["do", "0"],
          ["do#/déb", "1"],
          ["ré", "2"],
					["ré#/mib", "3"],
					["mi", "4"],
					["fa", "5"],
					["fa#/solb", "6"],
					["sol", "7"],
					["sol#/lab", "8"],
					["la", "9"],
					["la#/sib", "10"],
					["si", "11"]
        ]
      },
		  {
				"type": "field_dropdown",
        "name": "OCTAVE",
				"options": [
					["3", "4"],										
					["-1", "0"],
					["0", "1"],
					["1", "2"],
					["2", "3"],
					["3", "4"],
					["4", "5"],
					["5", "6"],
					["6", "7"],
					["7", "8"],
					["8", "9"],					
        ]
			},
			 {
        "type": "input_value",
        "name": "VELOCITE",
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 50,
    "tooltip": "jouer une note",
    "helpUrl": ""
  },
	{
    "type": "note_off_list",
    "message0": "Arrêter %1 %2 %3",
    "args0": [      
			{
        "type": "field_dropdown",
        "name": "CHANNEL",
        "options": [
          ["can 1", "1"],
          ["can 2", "2"],
          ["can 3", "3"],
					["can 4", "4"],
					["can 5", "5"],
					["can 6", "6"],
					["can 7", "7"],
					["can 8", "8"],
					["can 9", "9"],		
					["can 10", "10"],
					["can 11", "11"],
					["can 12", "12"],
					["can 13", "13"],
					["can 14", "14"],
					["can 15", "15"],
					["can 16", "16"],
        ]
      },
			{
        "type": "field_dropdown",
        "name": "NOTE",
        "options": [
          ["do", "0"],
          ["do#/déb", "1"],
          ["ré", "2"],
					["ré#/mib", "3"],
					["mi", "4"],
					["fa", "5"],
					["fa#/solb", "6"],
					["sol", "7"],
					["sol#/lab", "8"],
					["la", "9"],
					["la#/sib", "10"],
					["si", "11"]
        ]
      },
		  {
				"type": "field_dropdown",
        "name": "OCTAVE",
				"options": [
					["3", "4"],
          ["-1", "0"],
          ["0", "1"],
          ["1", "2"],
					["2", "3"],
					["3", "4"],
					["4", "5"],
					["5", "6"],
					["6", "7"],
					["7", "8"],
					["8", "9"],					
        ]
			}			
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 50,
    "tooltip": "stopper une note",
    "helpUrl": ""
  },
	{
    "type": "prgm_change",
    "message0": "Intrument %1 %2",
    "args0": [      
			{
        "type": "field_dropdown",
        "name": "CHANNEL",
        "options": [
          ["can 1", "1"],
          ["can 2", "2"],
          ["can 3", "3"],
					["can 4", "4"],
					["can 5", "5"],
					["can 6", "6"],
					["can 7", "7"],
					["can 8", "8"],
					["can 9", "9"],		
					["can 10", "10"],
					["can 11", "11"],
					["can 12", "12"],
					["can 13", "13"],
					["can14", "14"],
					["can 15", "15"],
					["can 16", "16"],
        ]
      },
			{
        "type": "input_value",
        "name": "PRGM_CHANGE",
        "check": "Number"
			}
			],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 50,
    "tooltip": "Choisir l'instrument n°",
    "helpUrl": ""
  },
	{
    "type": "volume",
    "message0": "Volume %1 %2",
    "args0": [
			{
        "type": "field_dropdown",
        "name": "CHANNEL",
        "options": [
          ["can 1", "1"],
          ["can 2", "2"],
          ["can 3", "3"],
					["can 4", "4"],
					["can 5", "5"],
					["can 6", "6"],
					["can 7", "7"],
					["can 8", "8"],
					["can 9", "9"],		
					["can 10", "10"],
					["can 11", "11"],
					["can 12", "12"],
					["can 13", "13"],
					["can14", "14"],
					["can 15", "15"],
					["can 16", "16"],
        ]
      },
			{
        "type": "input_value",
        "name": "VOLUME",
        "check": "Number"
			}
			],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 50,
    "tooltip": "Mettre le volume sonore à",
    "helpUrl": ""
  }
]);
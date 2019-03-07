## Functions

<dl>
<dt><a href="#onmessage">onmessage()</a></dt>
<dd><p>Event listener for message reception, it handles 4 types of message:</p>
<ul>
<li>gridLength setting the number of rows and columns</li>
<li>sharedBuffer receiving the sharedBuffer used to communicate events from the main thread</li>
<li>scripts reveiving the different code to execute (5 max: 1 main script and 4 event scripts)</li>
<li>run executing the main script, the worker can&#39;t handle more messages after receiving this one</li>
</ul>
</dd>
<dt><a href="#setPixel">setPixel(rowX, columnY, color)</a></dt>
<dd><p>Set a specified pixel to the chosen color by sending a message to the main thread</p>
</dd>
<dt><a href="#switchOffPixel">switchOffPixel(rowX, columnY)</a></dt>
<dd><p>Set the specified pixel off (set the pixel color to black)</p>
</dd>
<dt><a href="#switchOffAllPixels">switchOffAllPixels()</a></dt>
<dd><p>Set all pixels off</p>
</dd>
<dt><a href="#setAllPixels">setAllPixels(color)</a></dt>
<dd><p>Set all pixels to the given color</p>
</dd>
<dt><a href="#getPixelColor">getPixelColor(row, column)</a> ⇒ <code>String</code></dt>
<dd><p>Return the current color of the specified pixel</p>
</dd>
<dt><a href="#drawLetter">drawLetter(inputLetter, rowX, columnY, color, direction)</a></dt>
<dd><p>Draw the specified letter to the given position and with the given direction</p>
</dd>
<dt><a href="#catchEvent">catchEvent()</a></dt>
<dd><p>Check if a &quot;key-pressed&quot; event has been sent and run the corresponding code</p>
</dd>
<dt><a href="#sleep">sleep(time, unit)</a></dt>
<dd><p>Sleep the program for the given time</p>
</dd>
<dt><a href="#colourRandom">colourRandom()</a> ⇒ <code>String</code></dt>
<dd><p>Generate a random hexadecimal color
This function is natively in Blockly but needs to be redefined in that use</p>
</dd>
<dt><a href="#colourRgb">colourRgb(red, green, blue)</a> ⇒ <code>String</code></dt>
<dd><p>Generate a color with the specified amount of red,green and blue
This function is natively in Blockly but needs to be redefined in that use</p>
</dd>
<dt><a href="#colourBlend">colourBlend(c1, c2, ratio)</a> ⇒ <code>String</code></dt>
<dd><p>Generate a color by blending two colors
This function is natively in Blockly but needs to be redefined in that use</p>
</dd>
</dl>

<a name="onmessage"></a>

## onmessage()
Event listener for message reception, it handles 4 types of message:
- gridLength setting the number of rows and columns
- sharedBuffer receiving the sharedBuffer used to communicate events from the main thread
- scripts reveiving the different code to execute (5 max: 1 main script and 4 event scripts)
- run executing the main script, the worker can't handle more messages after receiving this one

**Kind**: global function  
<a name="setPixel"></a>

## setPixel(rowX, columnY, color)
Set a specified pixel to the chosen color by sending a message to the main thread

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| rowX | <code>Number</code> | The pixel's row in the grid |
| columnY | <code>Number</code> | The pixel's column in the grid |
| color | <code>String</code> | The color to set to the pixel |

<a name="switchOffPixel"></a>

## switchOffPixel(rowX, columnY)
Set the specified pixel off (set the pixel color to black)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| rowX | <code>Number</code> | The pixel's row in the grid |
| columnY | <code>Number</code> | The pixel's column in the grid |

<a name="switchOffAllPixels"></a>

## switchOffAllPixels()
Set all pixels off

**Kind**: global function  
<a name="setAllPixels"></a>

## setAllPixels(color)
Set all pixels to the given color

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>String</code> | The color to set to the pixel |

<a name="getPixelColor"></a>

## getPixelColor(row, column) ⇒ <code>String</code>
Return the current color of the specified pixel

**Kind**: global function  

| Param | Type |
| --- | --- |
| row | <code>Number</code> | 
| column | <code>Number</code> | 

<a name="drawLetter"></a>

## drawLetter(inputLetter, rowX, columnY, color, direction)
Draw the specified letter to the given position and with the given direction

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| inputLetter | <code>String</code> | The letter to draw (only the first character of the string) |
| rowX | <code>Number</code> | The row number of the left-top pixel of the letter |
| columnY | <code>Number</code> | The column number of the left-top pixel of the letter |
| color | <code>String</code> | The color of the letter |
| direction | <code>Number</code> | The direction the letter has to be drawn (0 = vertical, 1 = horizontal) |

<a name="catchEvent"></a>

## catchEvent()
Check if a "key-pressed" event has been sent and run the corresponding code

**Kind**: global function  
<a name="sleep"></a>

## sleep(time, unit)
Sleep the program for the given time

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| time | <code>Number</code> | The quantity of time to sleep (in seconds or milliseconds) |
| unit | <code>String</code> | The unit of time to sleep (s or ms) |

<a name="colourRandom"></a>

## colourRandom() ⇒ <code>String</code>
Generate a random hexadecimal color
This function is natively in Blockly but needs to be redefined in that use

**Kind**: global function  
<a name="colourRgb"></a>

## colourRgb(red, green, blue) ⇒ <code>String</code>
Generate a color with the specified amount of red,green and blue
This function is natively in Blockly but needs to be redefined in that use

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| red | <code>Number</code> | The amount of red in the color |
| green | <code>Number</code> | The amount of green in the color |
| blue | <code>Number</code> | The amount of blue in the color |

<a name="colourBlend"></a>

## colourBlend(c1, c2, ratio) ⇒ <code>String</code>
Generate a color by blending two colors
This function is natively in Blockly but needs to be redefined in that use

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| c1 | <code>Number</code> | The first color to blend |
| c2 | <code>Number</code> | The second color to blend |
| ratio | <code>Number</code> | The ratio of "blending" of the two colors |


## Functions

<dl>
<dt><a href="#run">run()</a></dt>
<dd><p>Runs the blockly program and launch the grid autoupdate</p>
</dd>
<dt><a href="#stop">stop()</a></dt>
<dd><p>Stops the blockly program and the grid autoupdate</p>
</dd>
<dt><a href="#restart">restart()</a></dt>
<dd><p>Stop the current running program and restart it</p>
</dd>
<dt><a href="#save">save(name)</a></dt>
<dd><p>Save the current workspace on a downloadable file (.xml)</p>
</dd>
<dt><a href="#importWorkspace">importWorkspace()</a></dt>
<dd><p>Import and set the current workspace with a downloaded .xml file</p>
</dd>
<dt><a href="#updateArbalet">updateArbalet()</a></dt>
<dd><p>Update the material Arbalet pixel grid if granted</p>
</dd>
<dt><a href="#updatePixel">updatePixel(rowX, columnY, color)</a></dt>
<dd><p>Update a pixel on simulation and add it to the update queue</p>
</dd>
<dt><a href="#generateScripts">generateScripts()</a> ⇒ <code>Object</code></dt>
<dd><p>Translate workspace&#39;s blocks in Javascript (main program and events code)</p>
</dd>
<dt><a href="#generateFunctions">generateFunctions()</a> ⇒ <code>String</code></dt>
<dd><p>Translate functions&#39; blocks in JavaScript code</p>
</dd>
<dt><a href="#isChrome">isChrome()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if the browser is Google Chrome (or Chromium)</p>
</dd>
</dl>

<a name="run"></a>

## run()
Runs the blockly program and launch the grid autoupdate

**Kind**: global function  
<a name="stop"></a>

## stop()
Stops the blockly program and the grid autoupdate

**Kind**: global function  
<a name="restart"></a>

## restart()
Stop the current running program and restart it

**Kind**: global function  
<a name="save"></a>

## save(name)
Save the current workspace on a downloadable file (.xml)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | File name of the exported workspace |

<a name="importWorkspace"></a>

## importWorkspace()
Import and set the current workspace with a downloaded .xml file

**Kind**: global function  
<a name="updateArbalet"></a>

## updateArbalet()
Update the material Arbalet pixel grid if granted

**Kind**: global function  
<a name="updatePixel"></a>

## updatePixel(rowX, columnY, color)
Update a pixel on simulation and add it to the update queue

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| rowX | <code>Number</code> | The row of the pixel to update |
| columnY | <code>Number</code> | The column of the pixel to update |
| color | <code>String</code> | The color to set to the pixel |

<a name="generateScripts"></a>

## generateScripts() ⇒ <code>Object</code>
Translate workspace's blocks in Javascript (main program and events code)

**Kind**: global function  
**Returns**: <code>Object</code> - An associative array of the scripts (5 elements max)  
<a name="generateFunctions"></a>

## generateFunctions() ⇒ <code>String</code>
Translate functions' blocks in JavaScript code

**Kind**: global function  
**Returns**: <code>String</code> - JavaScript code corresponding to the blockly functions defined in the workspace  
<a name="isChrome"></a>

## isChrome() ⇒ <code>Boolean</code>
Test if the browser is Google Chrome (or Chromium)

**Kind**: global function  
**Returns**: <code>Boolean</code> - True if chrome, false else  

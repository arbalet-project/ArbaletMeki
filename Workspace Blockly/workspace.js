/* TODO: Change toolbox XML ID if necessary. Can export toolbox XML from Workspace Factory. */
var toolbox;

$.ajax({
	type: "GET",
	url: "toolbox.xml",
	context: document.body,
	success: function(xml) {
		var s = new XMLSerializer();
		var d = xml;
		var toolbox = s.serializeToString(d);
		createBlockly(toolbox)
	}
});

function createBlockly(toolbox){
	var options = { 
		toolbox : toolbox, 
		collapse : true, 
		comments : true, 
		disable : true, 
		maxBlocks : Infinity, 
		trashcan : true, 
		horizontalLayout : false, 
		toolboxPosition : 'start', 
		css : true, 
		media : 'https://blockly-demo.appspot.com/static/media/', 
		rtl : false, 
		scrollbars : true, 
		sounds : true, 
		oneBasedIndex : true, 
		grid : {
			spacing : 20, 
			length : 1, 
			colour : '#888', 
			snap : false
		}
	};
	
	/* Inject your workspace */ 
	var workspace = Blockly.inject('blocklyDiv', options);
	
	/* Load Workspace Blocks from XML to workspace. Remove all code below if no blocks to load */
	
	/* TODO: Change workspace blocks XML ID if necessary. Can export workspace blocks XML from Workspace Factory. */
	var workspaceBlocks = document.getElementById("workspaceBlocks"); 
	
	/* Load blocks to workspace. */
	Blockly.Xml.domToWorkspace(workspaceBlocks, workspace);

}

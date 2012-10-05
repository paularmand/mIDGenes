// *******************************************************************************************************************************
// LICENSE
// 
//    Copyright 2010 Paul-Armand Verhaegen
// 
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.IdEM - IDea Evaluation Metrics
// 
// *******************************************************************************************************************************

// Overwrite the console.log function causing firefox to break if the firebug console isn't open (and active)
if(!window.console) {
  window.console = new function() {
    this.log = function(str) {};
    this.dir = function(str) {};
  };
}

var st;                 // global variable for the tree
var grid;               // global variable as handler to the grid
var active_node = {};   // global variable for remembering the active node
var result_data = [];   // global variable for the result data
var global_tree_data = {};// global variable for the JSON tree

function midgenes_init(){

    // JQUERY Accordion (with cookie)
    init_jquery_ui_accordion();
    
    // Initialise the upload / save tree buttons (with cookie)
    init_tree_load_save();

    // Initialise the edit tree functionality
    init_edit_tree();

    // Initialise the space tree (and drawing)
    init_space_tree();

    // Build the measurements tab
    init_measures_tab(); // checkboxes for selecting measures
    init_axes_tab(); // checkboxes for enabling results for each participant and or level

    // Build the results tab functionality
    init_results_tab();

    // Resize the accordion to fit all contents in all tabs
    $('#accordion').accordion('resize');

    //    st.onClick(st.root);
}

function init_jquery_ui_accordion() {
  // JQUERY Accordion (with cookie)
  var cookieName = 'midgenes_ideas_space_sticky_accordion';
  $('#accordion').accordion( {
      //autoheight: false, //fillspace: true,
      collapsible: true,
      active: ( $.cookies.get( cookieName ) || 0 ),
      change: function( e, ui ) {$.cookies.set( cookieName, $( this ).find( 'h3' ).index ( ui.newHeader[0] ) );}
  } );
}

function init_measures_tab() {
    // This function builds the measurements tab checkboxes based on the user-defined functions in the array metric_function_order
    var measuresContainer = $('ul#measuresContainer');
    $.each(metric_function_order, function( iteration, item )
    {
	measuresContainer.append(
	    $(document.createElement("li"))
	    .append(
		    $(document.createElement("input")).attr({
			    type:  'checkbox'
			    ,id:    'measuresFilter-' + item
			    ,name:  'measuresCheckBoxes'
			    ,value: item
			    ,checked:true
		    })
		    .click( function( event )
		    {
			    var cbox = $(this)[0];
			    //alert( cbox.value );
		    } )
	    )
	    .append(
		    $(document.createElement('label')).attr({
			    'for':  'measuresFilter' + '-' + item
		    })
		    .text( item )
	    )
	)
    } );
}

function init_axes_tab() {
    // This function builds the axes tab checkboxes based on the user-defined functions in the array metric_function_order
    //var axes = ['X', 'Y', 'Z']
    $('#check_include_participants').button({
	create: function(event, ui) {
	    if (($.cookies.get('check_include_participants') == null) || ($.cookies.get('check_include_participants') == false)) {
		// cookie not set // Set off default
		$('label[for="check_include_participants"] span').html("Off");
		$('#check_include_participants').button("refresh");
		$.cookies.set('check_include_participants', false);	
	    }
	    else {
		// cookie set // Set on 
		$(this).click(); $('label[for="check_include_participants"] span').html("On");
		$('#check_include_participants').button("refresh");
		$.cookies.set('check_include_participants', true);	
	    }
	}
    }); 
    $('#check_include_levels').button({
	create: function(event, ui) {
	    if (($.cookies.get('check_include_levels') == null) || ($.cookies.get('check_include_levels') == false)) {
		// cookie not set // Set off default
		$('label[for="check_include_levels"] span').html("Off");
		$('#check_include_levels').button("refresh");
		$.cookies.set('check_include_levels', false);	
	    }
	    else {
		// cookie set // Set on 
		$(this).click(); $('label[for="check_include_levels"] span').html("On");
		$('#check_include_levels').button("refresh");
		$.cookies.set('check_include_levels', true);	
	    }
	}
    }); 

    // Toggle actions on buttons
    $('#check_include_participants').click(function(e){
	if($('#check_include_participants').is(':checked')) {
	    $('label[for="check_include_participants"] span').html("On");
	    $('#check_include_participants').button("refresh");
	    $.cookies.set('check_include_participants', true);
	}
	else
	{
	    $('label[for="check_include_participants"] span').html("Off");
	    $('#check_include_participants').button("refresh");
	    $.cookies.set('check_include_participants', false);
	}
    });

    $('#check_include_levels').click(function(e){
	if($('#check_include_levels').is(':checked')) {
	    $('label[for="check_include_levels"] span').html("On");
	    $('#check_include_participants').button("refresh");
	    $.cookies.set('check_include_levels', true);
	}
	else
	{
	    $('label[for="check_include_levels"] span').html("Off");
	    $('#check_include_participants').button("refresh");
	    $.cookies.set('check_include_levels', false);
	}
    });
}

// Display data about the selected node
function showNodeData(label, node) {

    // Open the correct accordion
    if ($('#accordion').accordion( "option" , "active") != 1 ) {
        $('#accordion').accordion( "option" , "active" , 1 );
    }

    // Display the node ID
    $('#selected_node_id').html(node.id);
//     $('#selected_node_name').html(node.name);
    
    // Display the node data table
    $("#node_data_table").empty();
    $("#node_data_table").append('<tr><td colspan="100%"><b>Internal Application Data</b></td></tr>');
    for (data_element in node.data.application) {
        if (data_element.charAt(0) == "$") {continue;} // if the variable name starts with a $ it's JavaScript InfoVis Toolkit internal use 
	$("#node_data_table")
            .append('<tr><td>'+data_element+'&nbsp;</td><td>:&nbsp;'+node.data.application[data_element]+'</td></tr>');
    }

/*    $("#node_data_table").append('<tr><td colspan="100%"><b>User Data</b></td></tr>');
    for (data_element in node.data.user) {
        if (data_element.charAt(0) == "$") {continue;} // if the variable name starts with a $ it's JavaScript InfoVis Toolkit internal use 
	$("#node_data_table")
            .append('<tr><td>'+data_element+'&nbsp;</td><td>:&nbsp;'+node.data.user[data_element]+'</td></tr>');
    }*/
    
    // Builds a slickgrid with the correct columns
    var options = {
	enableCellNavigation: true,
	enableColumnReorder: true,
	editable: true,
	asyncEditorLoading: false
    };

    // Make columns for all user data
    var columns = [];
    var column_name = '';
    var node_data = [];
    var d = (node_data[0] = {});

    for (data_element in node.data.user) {
        if (data_element.charAt(0) == "$") {continue;} // if the variable name starts with a $ it's JavaScript InfoVis Toolkit internal use 
	column_name = data_element;
	
	// test for integer
	var intRegex = /^\d+$/; 
	if(intRegex.test(node.data.user[data_element])) { // is integer
	  columns.push({id: column_name, name:column_name, field:column_name, editor: Slick.Editors.Integer});
	}
	else {
	  columns.push({id: column_name, name:column_name, field:column_name, editor: Slick.Editors.Text});
	}
	d[data_element]=node.data.user[data_element];
    }

    // If the grid already exists, reset the columns and data otherwise make the grid (with data and columns)
    if (typeof node_user_data_grid !== 'undefined') {
	node_user_data_grid.setColumns(columns);
	node_user_data_grid.setData(node_data);
	node_user_data_grid.setOptions(options);
    }
    else {
 	node_user_data_grid = new Slick.Grid($("#node_data_grid"), node_data, columns, options);
 	$("#node_data_grid").show();
    }
    
    // Saving of editing data
    $("#button_save_node_data").click(function() { 
      // force the editor to complete
      if (node_user_data_grid.getEditorLock().isActive()) {
	if (node_user_data_grid.getEditorLock().commitCurrentEdit()) {
	  // commit succeeded; proceed with submit
	}
	else {
	  console.log("Couldn't force the slickgrid editor to commit the last change");
	}
      }
      node.data.user = d;
      
      showNodeData(label, node);

      $(".midgenes_tree_label").change(); // trigger change effect on labels (defined at create time of labels)
//       load_json (st.toJSON(), false);
      st.onClick(node);
      //node global_tree_data showNodeData load_json(('./examples/' + file_to_load), true);
    });
          
//     node_user_data_grid.onCellChange.subscribe(function (e, args) {
//       if (typeof(args.item.id)=='undefined')
// // 	$.post("/mygrid/data/insert", args.item);
// 	console.log('Error: Did you try to insert a cell in the node data grid?');
//       else
// // 	$.post("/mygrid/data/update", args.item);
// 	console.log('Cell changed');

//       for (var prop in args.item) {
// 	console.log("Updated node data "+ prop +" to value "+ args.item[prop]);
// 	node.data.user[prop] = args.item[prop];
// 	$(".button_calc_results").trigger('click');
//       }
//       console.log(args.item[0]);
//     });
// 49	             
// 50	            // Handle new row
// 51	             
// 52	            grid.onAddNewRow.subscribe(function(e, args) {
// 53	                var item = args.item;
// 54	                var column = args.column;
// 55	                grid.invalidateRow(data.length);
// 56	                data.push(item);
// 57	                grid.updateRowCount();
// 58	                grid.render();
//     });
    
    $('#accordion').accordion('resize');

    // Select the correct node and center the tree
    st.onClick(node.id);
}

//   Init the tree loading functionality
function init_tree_load_save() {

    // **************** UPLOAD TREE BUTTON ***********
    function handleFileSelect(evt) {
      var files = evt.target.files; // FileList object

      // Do not allow multiple files
      if (files.length > 1) {
	  document.getElementById('list').innerHTML = '<br />Currently only supporting 1 file (do not select multiple files). Please try again';
	  return;
      }
      else {
	  document.getElementById('list').innerHTML = '';
	  f = files[0];
      }

      // Make new reader object, set the handler to load_json after reading it
      var reader = new FileReader();
      reader.onload = (function(theFile) {
	  return function(e) {
	      load_json (reader.result);
	  };
      })(f);

      // Read the file
      reader.readAsText(f);
    }

    // handle a click on the button with id files (jquery style)
    $('#files').bind('change', handleFileSelect);
    // **************** END UPLOAD TREE BUTTON ***********

    // **************** EXAMPLE BUTTON AND AUTOLOADING PREVIOUS LOADED EXAMPLE ***********
    $(".selectupdate").button();
    $(".selectupdate").bind("click",
            function() {
                    var cookieName = 'midgenes_ideas_space_json_example';
                    var file_to_load = '';
                    if($("#.opts option:selected").text() == '...') {
                        file_to_load = $.cookies.get(cookieName);
                        $(".opts").val($.cookies.get(cookieName));
                    }
                    else {
                        file_to_load = $("#.opts option:selected").text()
                    }
                    load_json(('./examples/' + file_to_load), true);
                    $.cookies.set(cookieName, file_to_load);
    });
    $(".selectupdate").click();
    // **************** END EXAMPLE BUTTON ***********

    // **************** DOWNLOAD JSON BUTTON (uses flash downloadify library) ***********
                Downloadify.create('downloadify',{
                filename: function(){
                        return;
                },
                data: function(){
                        if (st != null) {var tree_json_textified = JSON.stringify(st.toJSON("tree"))}
                        return tree_json_textified;
                },
                onComplete: function(){ alert('Your File Has Been Saved!'); },
                onCancel: function(){ alert('You have cancelled the saving of this file.'); },
                onError: function(){ alert('You must put something in the File Contents or there will be nothing to save!'); },
                swf: './libs/jquery/dcneiner-Downloadify-f96cbe7/media/downloadify.swf',
                downloadImage: './libs/jquery/dcneiner-Downloadify-f96cbe7/images/download.png',
                width: 100,
                height: 30,
                transparent: true,
                append: false
            });
    // **************** END DOWNLOAD JSON BUTTON ***********
}

    // Load json
    function load_json (input_json, server) {
        console.log(input_json);
        if (server === true) {
            //console.log('loading from server:'+input_json);
            $.ajax({
                url: input_json,
                dataType: 'text',
                data: {},
                success: json_load_handler
            });
        }
        else {
            // convert text to json before calling json handler
            json_load_handler(input_json);
        }
    }

    // Load json in space tree
    // @param input_json is json text or object (javascript literal)
    function json_load_handler (input_json) {
        if(typeof(input_json) != 'object') {
            eval('input_json = ' + input_json); // parse it to JSON
        }
         st.loadJSON(input_json);
    //    //compute node positions and layout
         st.compute();
    //    //optional: make a translation of the tree
         st.geom.translate(new $jit.Complex(-200, 0), "current");
    //    //emulate a click on the root node.
         st.onClick(st.root);
	 global_tree_data = input_json;
    }

//   Edit tree functionality
function init_edit_tree() {
    $('#button_save_node_data').button();
    $('#button_del_node').button();
    $("#button_del_node").click(function() { 
        st.removeSubtree(active_node.id, true, 'animate', {onComplete: function() {
            // update the json and recalculate
            global_tree_data = st.toJSON("tree");
            st.loadJSON(global_tree_data);
            st.compute();
            st.geom.translate(new $jit.Complex(-200, 0), "current");
            st.onClick(st.root);
        }})});
    $('#button_add_node').button();
    $("#button_add_node").click(function() {
        if (active_node.id == undefined) {alert('Please select a node first'); return;}
        if (!($('#new_node_id').val().length >= 1)) {alert('Please enter an id'); return;}
        if (!($('#new_node_name').val().length >= 1)) {alert('Please enter a name'); return;}
        var add_json_child = {id : active_node.id, children : [{id: $('#new_node_id').val(),
          name: $('#new_node_name').val(),
          data: {}}]};
        st.addSubtree(add_json_child, "animate");
        global_tree_data = st.toJSON("tree");
//                console.log(JSON.stringify(global_tree_data));
        st.loadJSON(eval("{}")); // gives an error but the side effect is what we want
        st.loadJSON(global_tree_data);
        st.compute();
        st.geom.translate(new $jit.Complex(-200, 0), "current");
        st.onClick(st.root);
    });
}

//   init the space tree
function init_space_tree() {

st = new $jit.ST({  // Creating a spacetree instance
        //id of viz container element
        injectInto: 'infovis',
	//constrained: false,
	levelsToShow:3,
	// Orientation
        orientation: "left",  // override default left orientation
        levelDistance: 40,   //set distance between node and its children
	background: {}, // don't know why but this enable the rings in the background
        // animation
	duration: 200,
        transition: $jit.Trans.Quart.easeInOut,

        //enable panning
        Navigation: {
          enable:true,
          panning:true
        },

        //set node and edge styles
        //set overridable=true for styling individual
        //nodes or edges
        Node: {
            height: 20,
            width: 60,
            type: 'rectangle',
            color: '#aaa',
            overridable: true
        },

        Edge: {
            type: 'bezier',
            overridable: true,
            color: '#666',
        },

        onBeforeCompute: function(node){
            $('#log').html('loading ' + node.name);
        },

        onComplete: function(){
            $('#log').html('done'); //Log.write("done");
        },

        //This method is called on DOM label creation.
        //Use this method to add event handlers and styles to
        //your node.
        onCreateLabel: function(label, node){
            label.id = node.id;
            // Show how many are the subgraph (incl. node) contains
            var count = 0;
	    node.eachSubgraph(function(node) {
	      count = count + retrieve_user_data(node, "nr_ideas"); 
	    });
            label.innerHTML = retrieve_user_data(node,"name") + '['+retrieve_user_data(node,"nr_ideas")+'/' + count + ']';
	    label.setAttribute("class", "midgenes_tree_label");
	    
            label.onclick = function(){
            	showNodeData(label, node);
                active_node = node; // sets this node as global variable
            };

	    label.onchange = function(){
	      // Show how many are the subgraph (incl. node) contains
	      var count = 0;
	      node.eachSubgraph(function(node) {
		count = count + retrieve_user_data(node, "nr_ideas"); 
	      });

	      label.innerHTML = retrieve_user_data(node,"name") + '['+retrieve_user_data(node,"nr_ideas")+'/' + count + ']';
            };
	    
            //set label styles
            var style = label.style;
            style.width = 60 + 'px';
            style.height = 17 + 'px';
            style.cursor = 'pointer';
            style.color = '#333';
            style.fontSize = '0.8em';
            style.textAlign= 'center';
            style.paddingTop = '3px';
        },

        //This method is called right before plotting
        //a node. It's useful for changing an individual node
        //style properties before plotting it.
        //The data properties prefixed with a dollar
        //sign will override the global node style properties.
        onBeforePlotNode: function(node){
            //add some color to the nodes in the path between the
            //root node and the selected node.
            if (node.selected) {
                node.data.$color = "#ff7";
            }
            else {
                delete node.data.$color;
                //if the node belongs to the last plotted level
               // if(!node.anySubnode("exist")) {
                    //count children number
                    var count = 0;
                    node.eachSubnode(function(n) { count++; });
                    ////assign a node color based on
                    //how many children it has
                    node.data.$color = ['#aaa', '#baa', '#caa', '#daa', '#eaa', '#faa'][count];
               // }
            }
        },

        //This method is called right before plotting
        //an edge. It's useful for changing an individual edge
        //style properties before plotting it.
        //Edge data proprties prefixed with a dollar sign will
        //override the Edge global style properties.
        onBeforePlotLine: function(adj){
            if (adj.nodeFrom.selected && adj.nodeTo.selected) {
                adj.data.$color = "#777";
                adj.data.$lineWidth = 3;
            }
            else {
                delete adj.data.$color;
                delete adj.data.$lineWidth;
            }
        }
    });
}

//   Init the functionality on the results tab
function init_results_tab() {
    $(".button_calc_results").button();
    $(".button_calc_results").click(function() { calc_all(); build_and_show_grid(result_data); });

    // Allow downloads using flash and js library "downloadify" (https://github.com/dcneiner/Downloadify/)
    Downloadify.create('downloadify_results',{
        filename: function(){
                return;
        },
        data: function(){
                //if (data == null) {return false;}
                return JSON.stringify(result_data);
        },
        onComplete: function(){ alert('Your File Has Been Saved!'); },
        onCancel: function(){ alert('You have cancelled the saving of this file.'); },
        onError: function(){ alert('You must put something in the File Contents or there will be nothing to save!'); },
        swf: './libs/jquery/dcneiner-Downloadify-f96cbe7/media/downloadify.swf',
        downloadImage: './libs/jquery/dcneiner-Downloadify-f96cbe7/images/download.png',
        width: 100,
        height: 30,
        transparent: true,
        append: false
    });
}

// Calculates every requested metric
function calc_all() {
    result_data = []; // clear results

    // Set the correct levels for the complete tree
    st.graph.computeLevels(st.root);
    var nr_levels = [];
    $jit.Graph.Util.eachLevel(st.graph.getNode(st.root), 0, 5, function(n) {nr_levels.push(n._depth);});
    nr_levels.max();

    // make the JSON data
    var data_row = '';
    var participant = '"me"';

    // Check if we need to loop over all levels
    var level = nr_levels.max();
    if(!($('#check_include_levels').is(':checked'))) { // Set to level 0 (root) if we don't need to run over all levels
	level = 0;
    }
    // TODO: Loop over all participants
    // for each (participants) {
	for (; level >= 0; level--){ // Do at least 1 loop (level 0), or over all levels if needed
	    participant = 0; // TODO: remove this when implementing the lines above
	    data_row = {};
	    data_row.level = level;
	    data_row.participant = participant;
	    for (i=0; i< metric_function_order.length; i++) {  // Calculate the results for every checked metric
		if ($("#measuresFilter-"+metric_function_order[i]).is(':checked')) {
                    console.log(metric_function + '-' + metric_function_order[i]);
		    var calling_string = metric_function[metric_function_order[i]] +
			    '('
			    + 'st.graph.getNode(st.root)' + ',' 	// root node
			    + '{}' + ',' 				// active_node (currently unused)
			    + '{}' + ',' 				// active_node (currently unused)
			    + 'level' + ',' 				// level
			    + '"participant"' + ')' ;                   // participant
                    //console.log(calling_string);
                    data_row[metric_function_order[i]] = eval(calling_string);
		}
	    }
	    result_data.push(data_row);
	}
    // }
    // END: Loop over all participants
    return;
}

// Loads data in the grid
function build_and_show_grid() {
    // Builds a slickgrid with the correct columns
    var options = {
	enableCellNavigation: true,
	enableColumnReorder: true,
	//editable: true,
	asyncEditorLoading: false
    };

    // Make columns for participants, levels and for the selected metrics
    var columns = [];
    var column_name = '';
    if($('#check_include_participants').is(':checked')) {
	column_name = 'participant';
	columns.push({id: column_name, name:column_name, field:column_name});
    }
    if($('#check_include_levels').is(':checked')) {
	column_name = 'level';
	columns.push({id: column_name, name:column_name, field:column_name});
    }
    $("input:checkbox[name=measuresCheckBoxes]:checked").each(function()     // Make columns for the selected metrics
    {
	column_name = $(this).val();
	columns.push({id: column_name, name:column_name, field:column_name});
    });

    // If the grid already exists, reset the columns and data otherwise make the grid (with data and columns)
    if (grid) {
	grid.setOptions(options);
	grid.setData(result_data);
	grid.setColumns(columns);
    }
    else {
 	grid = new Slick.Grid($("#myGrid"), result_data, columns, options);
 	$("#myGrid").show();
    }
    
    $('#accordion').accordion('resize');
}
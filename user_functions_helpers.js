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

/*
* Computes the number of nodes in the subgraph of node (excluding the node itself)
*/
// function compute_concepts_below (node) {
//     var count = 0;
//     node.getSubnodes(
//         function(n){
//             if (n.getSubnodes(1).length == 0) {count++;}
//         }
//     )
//     return count;
// }

    /*
    * Returns true is the node is a leaf node (no children) else returns true
    *
    */
function isLeafNode(node) {
//      console.log(node);
    return (node.getSubnodes(1).length == 0) ? true : false;
}

    /*
    * Calculates the log of my_value with user-defined base my_base
    *
    */
function math_log_base(my_value, my_base) {
    return Math.log(my_value)/Math.log(my_base)
}

    /*
    * Add the sum function to the Array object
    *
    */
Array.prototype.sum = function() {
    for (var i = 0, L = this.length, sum = 0; i < L; sum += this[i++]);
    return sum;
}

    /*
    * Add the log function to the Array object
    *
    */
Array.prototype.logarithm = function(my_base) {
    for (var i = 0, L = this.length, arr_log = new Array(L); i < L; i++) {arr_log[i] = math_log_base(this[i], my_base)};
    return arr_log;
}

    /*
    * Add the max function to the Array object
    *
    */
Array.prototype.max = function(){
    return Math.max.apply( Math, this );
}

    /*
    * Add a property and value to the application (interal use) field of a node object
    *
    */

function store_appl_data(node, my_property, my_value) {
    if (node.data.application==undefined) {
      node.data.application = {}; // do not set this to an empty array -> the prototype of the array is changed !!
    };
    node.data.application[my_property] = my_value; 
}

    /*
    * Retrieve a property value of the application (interal use) field of a node object
    *
    */

function retrieve_appl_data(node, my_property) {
    if (node.data==undefined || node.data.application==undefined) {
      console.log("Error! Trying to retrieve the value of undefined 'data.application' field of node object");
      return 0;
    };
    return node.data.application[my_property];
}

    /*
    * Retrieve a property value of the user (input) field of a node object
    *
    */

function retrieve_user_data(node, my_property) {
    if (node.data==undefined || node.data.user==undefined) {
      console.log("Error! Trying to retrieve the value of undefined 'data.user' field of node object");
      console.log(node);
      return 0;
    };
    return node.data.user[my_property];
}

    /*
    * Returns the number of ideas in the subgraph of node (incl. ideas in the node itself)
    *	
    */
function calc_ideas_in_subgraph (node) {
  var count = 0;
  node.eachSubgraph(function(node) {
    count = count + retrieve_user_data(node, "nr_ideas"); 
  });	
  return count; 
}

    /*
    * Returns the number of ideas on a certain level of the graph
    *	
    */
function calc_ideas_on_level (root_node, level) {
  var count = 0;
  // for each node at a certain level sum the number of ideas
   root_node.eachLevel(level, level, function(node) {
     count += retrieve_user_data(node, "nr_ideas"); 
   });
  return count; 
}

    /*
    * Returns the number of nodes on a certain level of the graph
    *	
    */
function calc_nodes_on_level (root_node, level) {
  var count = 0;
  // for each node at a certain level sum the number of ideas
   root_node.eachLevel(level, level, function(node) {
     count++; 
   });
  return count; 
}

    /*
    * Returns the number of ideas on a certain level and below that level of the graph
    *	
    */
function calc_ideas_on_and_below_level (root_node, level) {
  var count = 0;
  all_nodes = root_node.getSubnodes(level);
  all_nodes.forEach(function(node) {
    count += retrieve_user_data(node, "nr_ideas"); 
  });
  return count; 
}


    /*
    * Computes and stores the number of ideas in the node and number of ideas in the subgraph in each node
    * Each node will contain a node.data.application.nr_ideas_in_node and a node.data.application.nr_ideas_in_subgraph property containing these values
    *	
    */
function compute_ideas_for_tree (node) {
    // recursively store the number of ideas in each node of the tree
    if (isLeafNode(node)) { // If the node is a leaf, then number of ideas in node equal what the user gave as input
	store_appl_data(node, "nr_ideas_in_subgraph", 0);
	store_appl_data(node, "nr_ideas_in_node", retrieve_user_data(node,"nr_ideas")); //used to be 1
    }
    else {	// If node has children then store the sum of the 'compute_ideas_for_tree ( )' of the children
	store_appl_data(node, "nr_ideas_in_node", retrieve_user_data(node,"nr_ideas")); //used to be 0
	// find the number of ideas in the children (recursive)
	store_appl_data(node, "nr_ideas_in_subgraph", 0);
	var arr_child_nodes = node.getSubnodes([1,1]); // only gets direct children (no grand children)
	for (var my_iter_i = 0; my_iter_i < arr_child_nodes.length ; my_iter_i++) {
	  store_appl_data(node, "nr_ideas_in_subgraph", 
			  retrieve_appl_data(node,"nr_ideas_in_subgraph") + compute_ideas_for_tree(arr_child_nodes[my_iter_i])); 
	}
    }
    // Sum the number of ideas in node with the number of ideas in subgraph and return
    store_appl_data(node,"nr_ideas_in_subgraph",
		    retrieve_appl_data(node,"nr_ideas_in_subgraph") + retrieve_appl_data(node,"nr_ideas_in_node"));
    console.log(retrieve_user_data(node, "name") + " returning number: " + retrieve_appl_data(node,"nr_ideas_in_subgraph"));
    return retrieve_appl_data(node,"nr_ideas_in_subgraph");     
}
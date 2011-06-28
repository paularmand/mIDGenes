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
*	Pre-defined and user-defined functions for the metrics
*
*	First thing to do is create your javascript metric function accepting (root_node, label, node, level, participant) as arguments
*	then overwrite or add entries in the array metric_function, and metric_function_order
*	Each function will be execute in order of appearance in the metric_function_order (if checked in the metrics tab)
*	Parameters:
*	label: is currently unused
*	node: is the node you'll be calculating the metric for
*	level: is the level you'll be calculating the metric for (starts at 0 for the root node)
*	participant: is the participant you're calculating the metric for (default is empty, and assumes all participants)
* 
*
*/

/*
*	Overwrite these arrays in order to execute your own functions as metrics
*/
var metric_function_order = [
    'var_shah_simplified',
    'var_nelson_w_10_5_2_1',
    'var_nelson_w_10_6_3_1',
    'var_nelson_norm_w_10_5_2_1',
    'var_nelson_norm_w_10_6_3_1'];  // Change the order and add a function

var metric_function = {
    'var_nelson_norm_w_10_5_2_1': 'variety_nelson_normalized_weights_10_5_2_1',
    'var_nelson_norm_w_10_6_3_1': 'variety_nelson_normalized_weights_10_6_3_1',
    'var_nelson_w_10_5_2_1': 'variety_nelson_weights_10_5_2_1',
    'var_nelson_w_10_6_3_1': 'variety_nelson_weights_10_6_3_1',
    'var_shah_simplified': 'variety_shah_simplified' 
//     'var_pave': 'variety_pave'
    // to add af function: add the following:   ,'description_of_you_function': 'name_of_your_function'
}

function variety_shah_simplified (root_node, label, node, level, participant) {
    // Shah notation in formulas:
    // level_weights[level] as "Sk"
    // total_number_of_nodes_at_level[level] = "bk"

    var level_weights = [10, 6, 3, 1];
    var variety = 0;

    // only defined for "root" level (well actually 1 below root level)
    if (level != 0) {return '-';}

    // Get the variety for level 1
    var total_nr_of_concepts = compute_ideas_for_tree(root_node); // stores the number of ideas on each node
    var total_number_of_nodes_at_level = [];
    // for each level calculate the number of nodes
    for (var iter_level = 1; iter_level <= level_weights.length; iter_level++) {
        total_number_of_nodes_at_level[iter_level-1] = 0;
        root_node.eachLevel(iter_level, iter_level, function(child_node) {
            total_number_of_nodes_at_level[iter_level-1]++;
        });
        variety += total_number_of_nodes_at_level[iter_level-1] * level_weights[iter_level-1] / total_nr_of_concepts;
    }
    return variety;
}

function variety_nelson_normalized_weights_10_5_2_1 (root_node, label, node, level, participant) {
    // only defined for "root" level (well actually 1 below root level)
    if (level != 0) {return '-';}
    var level_weights = [10, 5, 2, 1];
    return variety_nelson_base (root_node, label, node, level, participant, level_weights) / 
        (compute_ideas_for_tree (root_node) - 1);
}

function variety_nelson_normalized_weights_10_6_3_1 (root_node, label, node, level, participant) {
    // only defined for "root" level (well actually 1 below root level)
    if (level != 0) {return '-';}
    var level_weights = [10, 6, 3, 1];
    return variety_nelson_base (root_node, label, node, level, participant, level_weights) /
        (compute_ideas_for_tree (root_node) - 1);
}

function variety_nelson_weights_10_6_3_1 (root_node, label, node, level, participant) {
    // only defined for "root" level (well actually 1 below root level)
    if (level != 0) {return '-';}
    var level_weights = [10, 6, 3, 1];
    return variety_nelson_base (root_node, label, node, level, participant, level_weights);
}

function variety_nelson_weights_10_5_2_1 (root_node, label, node, level, participant) {
    // only defined for "root" level (well actually 1 below root level)
    if (level != 0) {return '-';}
    var level_weights = [10, 5, 2, 1];
    return variety_nelson_base (root_node, label, node, level, participant, level_weights);
}

function variety_nelson_base (root_node, label, node, level, participant, level_weights) {

    var variety = 0;

    // Calculate S1(b1 - 1)
    b1 = compute_nodes_on_level(root_node, 1);
    variety += level_weights[0]*(b1-1);
    //console.log('variety at level 1 = ' + variety);

    // Calculate other part of formula
    // for each level (2 to 4)
    for (var iter_level = 2; iter_level <= level_weights.length; iter_level++) {
        // loop over all subnodes adding the number of differentiation (branches of child -1)
        var differentiations_on_level = 0;
        root_node.eachLevel(iter_level - 1, iter_level - 1, function(child_node) { // level above
            //console.log('node ' + child_node.id + ' has nr_children = ' + compute_nodes_on_level(child_node, 1));
            if (compute_nodes_on_level(child_node, 1) > 0) { // points are given only when branches differentiate
                differentiations_on_level += compute_nodes_on_level(child_node, 1) - 1; // equals dl in Nelson's formula
            }
            //console.log('total diffs = ' + differentiations_on_level);
        });
        variety += (differentiations_on_level * level_weights[iter_level-1]);
        //console.log('variety = ' + variety);
    }
    return variety;
}

    /*
    * Computes the number of nodes on a level (relative to the node in argument)
    *
    */
function compute_nodes_on_level (node, level) {
    // calculate the number of nodes on level (relative to node)
    var sum_nr_nodes_on_level = 0;
    node.eachLevel(level, level, function(iter_node) {
	sum_nr_nodes_on_level++;
    });
    //console.log('compute_nodes_on_level = ' + sum_nr_nodes_on_level);
    return sum_nr_nodes_on_level;
}

    /*
    * Computes the number of ideas on a level (relative to the node in argument)
    *	
    */
function compute_ideas_on_a_level (node, level) {
    // calculate the number of ideas for each subnode 
    var sum_nr_ideas_on_level = 0;
    node.eachLevel(level, level, function(iter_node) {
	sum_nr_ideas_on_level += compute_ideas_for_tree(iter_node);
    });
    return sum_nr_ideas_on_level;     
}

    /*
    * Computes and stores the number of ideas in the node and number of ideas in the subgraph in each node
    * Each node will contain a node.data.ise_nr_ideas_in_node and a node.data.ise_nr_ideas_in_subgraph property containing these values
    *	
    */
function compute_ideas_for_tree (node) {
    // recursively store the number of ideas in each node of the tree
    if (isLeafNode(node)) { // If the node is a leaf, then number of ideas in node = 1
	node.data.ise_nr_ideas_in_subgraph = 0; 
	node.data.ise_nr_ideas_in_node = 1;
    }
    else {	// If node has children then store the sum of the 'compute_ideas_for_tree ( )' of the children
	node.data.ise_nr_ideas_in_node = 0;
	// find the number of ideas in the children (recursive)
	node.data.ise_nr_ideas_in_subgraph = 0;
	var arr_child_nodes = node.getSubnodes([1,1]); // only gets direct children (no grand children)
	for (var my_iter_i = 0; my_iter_i < arr_child_nodes.length ; my_iter_i++) {
	    node.data.ise_nr_ideas_in_subgraph = node.data.ise_nr_ideas_in_subgraph + compute_ideas_for_tree(arr_child_nodes[my_iter_i]); 
	}
    }
    // Sum the number of ideas in node with the number of ideas in subgraph and return
    node.data.ise_nr_ideas_in_subgraph = node.data.ise_nr_ideas_in_subgraph + node.data.ise_nr_ideas_in_node;
    return node.data.ise_nr_ideas_in_subgraph;     
}
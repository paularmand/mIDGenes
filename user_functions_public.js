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
    'var_nelson_norm_w_10_6_3_1',
    'var_pave_herfindahl'];  // Change the order and add a function

var metric_function = {
    'var_nelson_norm_w_10_5_2_1': 'variety_nelson_normalized_weights_10_5_2_1',
    'var_nelson_norm_w_10_6_3_1': 'variety_nelson_normalized_weights_10_6_3_1',
    'var_nelson_w_10_5_2_1': 'variety_nelson_weights_10_5_2_1',
    'var_nelson_w_10_6_3_1': 'variety_nelson_weights_10_6_3_1',
    'var_shah_simplified': 'variety_shah_simplified', 
    'var_pave_herfindahl': 'variety_pave_herfindahl'
    // to add a function: add the following:   ,'description_of_you_function': 'name_of_your_function'
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
    var total_nr_of_concepts = calc_ideas_in_subgraph (root_node); // stores the number of ideas on each node
    var total_number_of_nodes_at_level = [];
    
    // for each level calculate the number of nodes
    for (var iter_level = 1; iter_level <= level_weights.length; iter_level++) {
        total_number_of_nodes_at_level[iter_level-1] = 0;
        root_node.eachLevel(iter_level, iter_level, function(child_node) {
	  total_number_of_nodes_at_level[iter_level-1]++;
        });
	console.log('*'+total_number_of_nodes_at_level);
	variety += total_number_of_nodes_at_level[iter_level-1] * level_weights[iter_level-1] / total_nr_of_concepts;
	console.log('***'+variety);
    }
    return variety;		

}

function variety_nelson_normalized_weights_10_5_2_1 (root_node, label, node, level, participant) {
    // only defined for "root" level (well actually 1 below root level)
    if (level != 0) {return '-';}
    var level_weights = [10, 5, 2, 1];
//     console.log('** number_of_differentiations_in_subgraph: *'+ number_of_differentiations_in_subgraph (root_node));
    return variety_nelson_base (root_node, label, node, level, participant, level_weights) / 
        (max_number_of_differentiations_in_subgraph (root_node));
}

function variety_nelson_normalized_weights_10_6_3_1 (root_node, label, node, level, participant) {
    // only defined for "root" level (well actually 1 below root level)
    if (level != 0) {return '-';}
    var level_weights = [10, 6, 3, 1];
    return variety_nelson_base (root_node, label, node, level, participant, level_weights) /
        (max_number_of_differentiations_in_subgraph (root_node));
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
 * Returns the number of differentiations (according to Nelson et al.), e.g. (number of childnodes - 1 ) = # of differentiations to a node.
 * 
 */
function max_number_of_differentiations_in_subgraph (node) {
  // Also equals the number of ideas minus one, which is better as expressed by Nelson 
  // as being the maximum number of differentiations
  return calc_ideas_in_subgraph(node) - 1;
}
    /*
    * Computes the number of nodes on a level in the subgraph of node (level is relative to node in argument)
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

/* Computes the variety according to Paul-Armand Verhaegen's proposal in Design Studies
 * i.e. by multiplying with the inverse Herfindahl to account for the distribution of ideas over nodes
 * 
 * 
 */
function variety_pave_herfindahl (root_node, label, node, level, participant) {
    // Shah notation in formulas:
    // level_weights[level] as "Sk"
    // total_number_of_nodes_at_level[level] = "bk"

    // only defined for "root" level (well actually 1 below root level)
    if (level == 0) {return '-';}

    // Calculate the Herfindahl for that level
    herfindahl = 0;
    
    // herfindahl terms for the existing nodes
    root_node.eachLevel(level, level, function(iter_node) {
      probability_of_node = calc_ideas_in_subgraph(iter_node)/calc_ideas_in_subgraph(root_node);
//       console.log("prob was" + probability_of_node);
      herfindahl += (probability_of_node * probability_of_node);
    });
    console.log("explicit herfindahl at level " + level + " : " + herfindahl);
    
    // Herfindahl terms for the non-existing implicit nodes (only higher level ones), see explanation in article Design Studies
    for(iter_level = level - 1; iter_level > 0; iter_level--) {
      root_node.eachLevel(iter_level, iter_level, function(iter_node) {
	// a node should have a lower level implicit node (with nr_ideas ideas) if it has nr_ideas not equal to zero
	ideas_in_implicit_node = retrieve_user_data(iter_node, "nr_ideas");
	if (ideas_in_implicit_node > 0) {
	  probability_of_node = ideas_in_implicit_node/calc_ideas_in_subgraph(root_node);
	  console.log("prob was" + probability_of_node);
	  herfindahl += (probability_of_node * probability_of_node);
	};
      });    
    };
    console.log("herfindahl at level " + level + " : " + herfindahl);    
    
    // Calculate the Variety
    variety = 10 / (calc_ideas_in_subgraph(root_node) * herfindahl);
    console.log("herfindahl variety at level " + level + " : " + variety);
    return variety;
}

/* 
 * previous proposal: entropy (problem is that it's not always monotonically increasing from lower to higher levels
 * 
*/
function variety_pave_entropy (root_node, label, node, level, participant) {
    // NOT defined for "root" level
    if (level == 0) {return '-';}

    var arr_child_nr_of_nodes = [];
    var arr_child_probability = [];

    // Get the probability for each node on the specified level
        // store the ideas on the nodes
        compute_ideas_for_tree(root_node);
        // Calculate the total number of concepts on and below this level
        var total_number_of_ideas_at_level = compute_ideas_on_a_level(root_node, level);
        console.log('bkmax (' + level + ') equals ' + total_number_of_ideas_at_level);
        root_node.eachLevel(level, level, function(child_node) {
            var temp_compute_ideas_for_tree = compute_ideas_for_tree(child_node);
            arr_child_probability.push(temp_compute_ideas_for_tree/total_number_of_ideas_at_level);
            console.log('child ' + child_node.id + ' has ' + temp_compute_ideas_for_tree + ' concepts below , pi = ' + temp_compute_ideas_for_tree/total_number_of_ideas_at_level)
        });

    // Calculate the entropy from the probability
        // Transforming to vector (which work with sylvester's math library
        console.log('entropy (level ' + level + '), log with base = ' + arr_child_probability.length);
        var vec_child_probability = $V(arr_child_probability);
        // Calculate the entropy
        var vec_child_probability_log = $V(arr_child_probability.logarithm(arr_child_probability.length));	// log of the probability vector
        var entropy = - (vec_child_probability.dot(vec_child_probability_log));	// calculate the variety as the sum of products

    // Calculate the pave_variety
        var bk_divided_by_bkmax = arr_child_probability.length / total_number_of_ideas_at_level;
        var variety = 10 * (bk_divided_by_bkmax * entropy);

    //root_node.data.variety = variety;
    return variety;
}

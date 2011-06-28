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
* Computes the number of leaf ideas (concepts) below the node
*/
function compute_concepts_below (node) {
    var count = 0;
    node.eachSubgraph(
        function(n){
            if (n.getSubnodes(1).length == 0) {count++;}
        }
    )
    return count;
}

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
    * Add the log function to the Array object
    *
    */
Array.prototype.max = function(){
    return Math.max.apply( Math, this );
}
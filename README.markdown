
#mIDGenes stands for IDea Evaluation Metrics, an online tool to developed and test metrics to evaluate generated idea and idea spaces

##Description
mIDGenes stands for Measuring IDea GENeration EffectivenesS, an online tool to developed and test metrics to evaluate generated idea and idea spaces 

The tool currently allows to calculate the different variety metrics (Shah, Nelson, Chakrabarti, our own, ...) based on a tree representation of the idea space of a idea generation exercise (e.g. Brainstorming, TRIZ, ...).

This software is completely in Javascript and no data is stored on the server (allows researchers to easily test metrics without uploading them to a community), basically all a user needs to do, is go to the URL and start using it (URL to free version will be added soon here) .

The idea behind the software is that our idea generation effectiveness metrics (variety, novelty, ...) need to be validated on a number of examples. The software allows everyone to test, check and compare new metrics against uploaded versions of the existing metrics and uploaded example idea trees (even from real-life idea generation studies). 

 ###Current features are:
  + Tree representation
    - The software makes a visual representation of the loaded tree
    - The tree can be folded, unfolded, nodes can be selected, the label in a node show the node id and the number of ideas in the subtree
  + Loading saving of idea trees
    - load example trees (in JSON format)
    - load trees from user disk (in JSON format)
    - save trees to user disk (in JSON format) (also after editing, see below)
  + Online editing the idea trees
    - Checking data contents of nodes (how many ideas here and in children)
    - Adding a node
    - Deleting a node (incl. children)
  + Metrics
    - Current metrics include 5 variety metrics from Shah and Nelson, and 1 of our own
    - Metrics can be checked and unchecked to include in the calculation (or exclude)
    - Metrics are automatically added to the front-end when specified in the client-side Javascript
    - A new metric can be easily added be writing a single javascript function (front-end and results will automatically include this)
  + The results
    - Results are output in a grid (excel alike)
    - Results can be saved in JSON format

 ###Features to be added:
  + Online editing the idea trees
    - change the stored data in a leaf node (specify which participants this idea relates)
  + Filtering of the ideas in a tree
     -the tree can contain a number of different nodes (for which function, for which participant, for which group, for which date, etc...), a filter needs to be added to filter the ideas, retaining only the ones that are used in the calculation of the metrics
  + Metrics
    - Allow client-side specification of the javascript file (on user disk) for new metrics and overriding of known metrics
    - Add a function for the Srinivasan & Chakrabarti variety metrics

##LICENSE
### mIDGenes
The Apache License, Version 2.0 applies to the mIDGenes software, also see below. 

*******************************************************************************************************************************
LICENSE

   Copyright 2010 Paul-Armand Verhaegen

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.IdEM - IDea Evaluation Metrics

*******************************************************************************************************************************

### Included libs
The included libraries are in the libs folder. The included software or libs are under their own license, so check that out first.



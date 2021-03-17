import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App";
import * as d3 from 'd3';
import './css/gallery.css';
import AceEditor from "react-ace";
import { split as SplitEditor } from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import Beautify from 'ace-builds/src-noconflict/ext-beautify';
import $ from 'jquery';
import Split from 'react-split';
import e from 'cors';

import { VscRunAll } from 'react-icons/vsc';
import { AiOutlineShareAlt } from 'react-icons/ai';
import { ImEmbed2 } from 'react-icons/im';


import * as codec from 'json-url'

class OverallApp extends React.Component {
    constructor(props) {
        super(props);
        
        this.wait = false;
        this.state = {
             classes: [{
                       class: 'countries',
                       elements:['.france', '.germany', '.uk']
                  },{
                       class: 'hand',
                       elements:['.handRight']
                  },{
                       class: 'countries-alliance-1',
                       elements:['.france', '.germany']
                  },{
                       class: 'countries-alliance-2',
                       elements:['.uk', '.russia']
             }],
             layout: [{
                name: 'smallLayout',
                panels: [[0,1,2], [3,4,[5,6]]]
             }],
                  
                  // width: [['250px', '250px', '250px'], ['250px', '250px', '250px']]
             
             variables: [
                  {'name': 'movementSpeed', 'value': 0 },
                  {'name': 'movementVelocity', 'value': 0 },
                  {'name': 'totalMovement', 'value': 0, 'what': ['(', 'movementSpeed', '+', 'movementVelocity', ')','*10']}
             ],
             panels:[
                  {
                       id:0, 
                       url:'cow_1.svg'
                       
                  },
                  {id:1, url:'Slider.svg', sliders: [
                            {id:'slider_movementSpeed', variable:'movementSpeed'},
                            {id:'slider_movementVelocity', variable:'movementVelocity'}
                       ]},
                  {id:2, url:'handR.svg'},
                  {id:3, url:'handL.svg'},
                  {id:4, url:'handL.svg'},
                  {id:5, url:'handL.svg'},
                  {id:6, url:'handL.svg'},
                  {id:7, url:'small.svg'},
                  {id:8, url:'small.svg'},
                  {id:9, url:'handL.svg'},
                  {id:10, url:'handL.svg'},
                  {id:11, url:'small.svg'},
                  {id:12, url:'small.svg'},
                  {id:13, url:'small.svg'},
                  {id:14, url:'small.svg'},
                  {id:15, url:'small.svg'}
             ],
             operations: [
                  // { 
                  //      type: 'replace', 
                  //      action: { from: [3], to: [[11, 12], [13, 14]]},
                  //      event: 'click',
                  //      on: 2,
                  //      backForth: false
                  // },
                  // { 
                  //      type: 'append', 
                  //      action: { from: [2], to: [9, 10]},
                  //      event: 'click',
                  //      on: 1,
                  //      backForth: false,
                  //      flexwrap: false
                  // },
                  // { 
                  //           type: 'replace', 
                  //           action: { from: [3], to: [[11, 12], [13, 14]]},
                  //           event: 'click',
                  //           on: 2,
                  //           backForth: false
                  // },
                  // { 
                  //      trigger: 'onclick',
                  //      element: 'panel_1',
                  //      operation: 'replace',
                  //      replacepanel: [0],
                  //      newpanels: [1,2], 
                  //      flexwrap: false
                  // },
                  // { 
                  //      trigger: 'click',
                  //      element: 'handRight',
                  //      operation: 'replace',
                  //      after: 'panel_1',
                  //      newpanels: ['panel_9','panel_10'], 
                  //      flexwrap: false
                  // }, 
                  // { 
                  //      trigger: 'click',
                  //      element: 'panel_1',
                  //      operation: 'append',
                  //      after: 'panel_1',
                  //      newpanels: ['panel_9','panel_10'], 
                  //      flexwrap: true
                  // },
                  { 
                       trigger: 'click',
                       element: 'panel_0',
                       operation: 'append',
                       after: 'panel_3',
                       newpanels: [['panel_11','panel_12'],['panel_13','panel_14']], 
                       flexwrap: true
                  },
                  { 
                       trigger: 'click',
                       element: 'panel_4',
                       operation: 'replace',
                       after: 'panel_4',
                       newpanels: ['panel_12', 'panel_15'], 
                       flexwrap: false
                  },
                  {		
                       trigger: 'mouseover', 
                       element: 'hand',
                       operation: 'highlight', // highlights same element across all other panels 
                       after: {style: {'fill': 'red', 'transform': 'scale(1.5)'}, attr:[]},
                       what: 'handNew'
                  },
                  {
                       type: 'isotype', 
                       variable:'totalMovement',
                       to: 'isotypePlaceHolder',
                       icon: 'images/fog.png',
                       attr: {'widthIcon': 20}
                  },
                  { 
                       trigger: 'click',
                       element: 'panel_3',
                       operation: 'append',
                       after: 'panel_5',
                       newpanels: ['panel_15'], 
                       flexwrap: false
                  },
                  {
                       trigger: 'condition',
                       condition: ["totalMovement", " > 60"],
                       operation: 'append',
                       after: 'panel_3',
                       newpanels: [['panel_11','panel_12'],['panel_13','panel_14']]
                  },
                  {
                       trigger: 'condition',
                       condition: ["totalMovement", " < 60"],
                       operation: 'remove',
                       panel: [['panel_11','panel_12'],['panel_13','panel_14']],
                  }
                  // ,size: '10%', color: '#f00', 
                  // { 
                  //      trigger: 'over',
                  //      element: 'panel_0',
                  //      operation: 'append',
                  //      after: 'panel_2',
                  //      newpanels: ['panel_11','panel_12'], 
                  //      flexwrap: false
                  // },
                  // { 
                  //      trigger: 'click',
                  //      element: 'panel_1',
                  //      operation: 'append',
                  //      after: 'panel_2',
                  //      newpanels: ['panel_11','panel_12'], 
                  //      flexwrap: false
                  // },

                  //
                  // {
                  //      type: 'isotype', 
                  //      // from:'slider_movementSpeed',
                  //      variable:'movementSpeed',
                  //      to: 'isotypePlaceHolder2',
                  //      on: 0,
                  //      icon: 'images/bull.png'
                  // }
                  // { 
                  //      type: 'remove', 
                  //      action: { from: [0, 1, 3]},
                  //      event: 'click',
                  //      on: 2,
                  //      backForth: true
                  // }
                       
             ]
        }
        this.state9 = {
            "classes": [
             {
              "class": "countries",
              "elements": [
               ".france",
               ".germany",
               ".uk"
              ]
             },
             {
              "class": "hand",
              "elements": [
               ".handRight"
              ]
             },
             {
              "class": "countries-alliance-1",
              "elements": [
               ".france",
               ".germany"
              ]
             },
             {
              "class": "countries-alliance-2",
              "elements": [
               ".uk",
               ".russia"
              ]
             }
            ],
            currentLayout: 'initialLayout',
            layout: [{
              name: 'initialLayout',
              panels: [
                
                  [17, 18],
                  [5,6,7]
              ]
            }, {
                name: 'smallLayout',
                panels: [
                  // [2]
                    [12, [14, 15]],
                    [ 0,[1,2],[3, 13]],
                    [4]
                    
                  ]
              },{
                  name: 'secondLayout',
                  panels: [ 
                  
                    4, [2],[3], [13, [14, 15]]
                  ]
            }],
            
            "variables": [
             {
              "name": "movementSpeed",
              "value": 0
             },
             {
              "name": "movementVelocity",
              "value": 0
             },
             {
              "name": "totalMovement",
              "value": 0,
              "what": [
               "(",
               "movementSpeed",
               "+",
               "movementVelocity",
               ")",
               "*10"
              ]
             }
            ],
            "panels": [
             {
              "id": 0,
              "url": "/CO2Footprint/inputPanel.svg",
              "sliders": [
                  {
                    "id": "slider_movementSpeed",
                    "variable": "movementSpeed"
                  },
                  {
                    "id": "slider_movementVelocity",
                    "variable": "movementVelocity"
                  }
               ]
             },
             {
              "id": 1,
              "url": "/CO2Footprint/totalKm.svg"
              
             },
             {
              "id": 2,
              "url": "/CO2Footprint/around2.svg"
             },
             {
              "id": 3,
              "url": "/CO2Footprint/CO2inTons.svg"
             }
             ,
             {
              "id": 4,
              "url": "/CO2Footprint/speechBubble.svg"
             },
             {
              "id": 5,
              "url": "/CO2Footprint/human_panel.svg"
             },
             {
              "id": 6,
              "url": "/CO2Footprint/tree_panel.svg"
             },
             {
              "id": 7,
              "url": "/CO2Footprint/cow_panel.svg"
             },
             {
              "id": 8,
              "url": "/CO2Footprint/averageCO2_panels.svg"
             },
             {
              "id": 9,
              "url": "/CO2Footprint/ParisTarget_panel.svg"
             },
             {
              "id": 10,
              "url": "/CO2Footprint/if1TonLower1.svg"
             },
             {
              "id": 11,
              "url": "/CO2Footprint/if1TonHigher1.svg"
             },
             {
              "id": 12,
              "url": "/CO2Footprint/layout.svg"
             },
             
             {
              "id": 13,
              "url": "/CO2Footprint/isotypes.svg"
             },
             
             {
              "id": 14,
              "url": "/CO2Footprint/nysub.svg",
              "type": 'map',
              "attr": {'width': '400px', 'height': '200px'}
             },
             {
                "id": 15,
                "url": "/CO2Footprint/nysub2.svg",
                "type": 'map',
                "attr": {'width': '400px', 'height': '200px'}
               },
               {
                "id": 16,
                "url": "/CO2Footprint/nysub3.svg",
                "type": 'map',
                "attr": {'width': '500px', 'height': '400px'}
               },{
                "id": 17,
                "url": "/CO2Footprint/layout.svg"
               },
               
               {
                "id": 18,
                "url": "/CO2Footprint/isotypes.svg"
               },
            ],
            "operations": [
                {
                    
                    "trigger": "click",
                    "element": "panel_5",
                    "operation": "append",
                    "after": "panel_7",
                    "newpanels": [ "panel_8", ["panel_9"],["panel_10"]]
                },

               
                 {
                    operation: 'isotype', 
                    variable:'movementSpeed',
                    to: 'isotypePlaceHolder2',
                    attr: {widthIcon: 35},
                    icon: 'images/bull.png'
                },
                {
                    "operation": 'zoom', 
                    "trigger": "zoom",
                    'element': "panel_14",
                    'linked': ['panel_15']
                   
                },
                { 
                    trigger: 'click',
                    element: 'panel_4',
                    operation: 'replace',
                    after: 'panel_4',
                    newpanels: ['panel_8', 'panel_9'], 
                    flexwrap: false
               },
               { 
                'trigger': "click",
                'operation': 'loadLayout',
                'element': "Layout2",
                'layout': "secondLayout",
                "after": "panel_18",
                "group": "group2"
             },
               { 
                'trigger': "click",
                'operation': 'loadLayout',
                'element': "Layout1",
                'layout': "smallLayout",
                "after": "panel_18",
                "group": "group2"
             }
              // group: group1
              // after: null | group-name
            
              //  "[operations]{ 
              //   trigger: ""click"",
              //   operation: loadLayout,
              //   element: button2,
              //   loadLayout: mediumLayout
              //   group: group1
              //   after: null | group-name
              // }"

                // ,
                // {
                //     "operation": 'zoom', 
                //     "trigger": "zoom",
                //     'element': "panel_6",
                //     'linked': ['isotypePlaceHolder2']
                   
                // }

            
            ]
           }

           this.state8 = {
               "classes": [],
               "currentLayout": "iniLayout",
               "layout": [
                 {
                   "name": "iniLayout",
                   "panels": [
                     [
                       1,
                       [
                         2,
                         0
                       ],
                       3
                     ],
                     [
                       4
                     ],
                     [
                       5,
                       6,
                       7,
                       8
                     ],
                     [10],
                     [17, 18]
                   ]
                 }
               ],
               "variables": [
                 {
                   "name": "movementSpeed",
                   "value": 0
                 },
                 {
                   "name": "movementVelocity",
                   "value": 0
                 },
                 {
                   "name": "totalMovement",
                   "value": 0,
                   "what": [
                     "(",
                     "movementSpeed",
                     "+",
                     "movementVelocity",
                     ")",
                     "*1"
                   ]
                 },
                 {
                   "name": "totalkm",
                   "value": 0,
                   "what": [
                     
                     "movementSpeed", "*2000", "+", "movementVelocity", "*8000"
                   ]
                 },
                 {
                   "name": "earthTimes",
                   "value": 0,
                   "what": [
                     
                     "totalkm", "/","40000"
                   ]
                 },
                 {
                   "name": "totalTons",
                   "value": 0,
                   "what": [
                     
                     "totalkm", "/","1000"
                   ]
                 },
                 {
                   "name": "tonsMoreThanEarthEverage",
                   "value": 0,
                   "what": [
                     
                     "totalTons", "-","5"
                   ]
                 },
                 {
                   "name": "moreThanParisGoal",
                   "value": 0,
                   "what": [
                     
                     "totalTons", "-","1"
                   ]
                 },
                 {
                   "name": "numTrees",
                   "value": 0,
                   "what": [
                     
                     "totalTons", "*", "45"
                   ]
                 },
                 {
                   "name": "treeIcon",
                   "value": 0,
                   "what": [
                     
                     "numTrees", "/","10"
                   ]
                 },
                 {
                   "name": "numCows",
                   "value": 0,
                   "what": [
                     
                    "totalTons"
                   ]
                 }
               ],
               "panels": [
                 {
                   "id": 0,
                   "url": "/CO2Footprint/inputPanel.svg",
                   "sliders": [
                     {
                       "id": "slider_movementSpeed",
                       "variable": "movementSpeed"
                     },
                     {
                       "id": "slider_movementVelocity",
                       "variable": "movementVelocity"
                     }
                   ]
                 },
                 {
                   "id": 1,
                   "url": "graphies.jpg"
                 },
                 {
                   "id": 2,
                  //  "url": "https://drive.google.com/uc?id=0BwnYnOTc-UeCTVZabHRBeXZtT1U"
                    "url": 'https://svgshare.com/i/UiD.svg'
                 },
                 {
                   "id": 3,
                   "url": "https://drive.google.com/uc?id=1biySw-DtngD4TBRNW8RpE_WCIC9le4eu"
                 },
                 {
                   "id": 4,
                   "url": "https://raw.githubusercontent.com/visualinteractivedata/visualinteractivedata.github.io/master/comicsvgs/test-panel1.svg"
                 },
                 {
                   "id": 5,
                   "url": "/CO2Footprint/humanClicked_panel.svg"
                 },
                 {
                   "id": 6,
                   "url": "/CO2Footprint/tree_panel.svg"
                 },
                 {
                   "id": 7,
                   "url": "/CO2Footprint/cow_panel.svg"
                 },
                 {
                   "id": 8,
                   "url": "/CO2Footprint/averageCO2_panels.svg"
                 },
                 {
                   "id": 9,
                   "url": "/CO2Footprint/compareWithYouMore.svg"
                 },
                 {
                   "id": 10,
                   "url": "/CO2Footprint/parisHigher1ton.svg"
                 },
                 {
                   "id": 11,
                   "url": "/CO2Footprint/tree2Panels.svg"
                 },
                 {
                   "id": 12,
                   "url": "/CO2Footprint/human_panel.svg"
                 },
                 {
                   "id": 13,
                   "url": "/CO2Footprint/human_panel.svg"
                 },
                 {
                  "id": 14,
                  "url": "/CO2Footprint/tree2Panels.svg"
                },
                {
                  "id": 15,
                  "url": "/CO2Footprint/human_panel.svg"
                },
                {
                  "id": 16,
                  "url": "/CO2Footprint/human_panel.svg"
                },
                {
                  "id": 17,
                  "url": "/CO2Footprint/human_panel.svg"
                },
                {
                  "id": 18,
                  "url": "tree.png"
                }
               ],
               "operations": [
             
                //    { 
                //    "trigger": "click",
                //    "element": "panel_6",
                //    "operation": "replace",
                //    "after": "panel_7",
                //    "newpanels": ["panel_11"]
                //  },
                { 
                  'trigger': "click",
                  'operation': 'loadLayout',
                  'element': "panel_5",
                  'layout': [[12], 14],
                  "after": "panel_7",
                  "group": "group1"
               },
               { 
                'trigger': "click",
                'operation': 'loadLayout',
                'element': "panel_6",
                'layout': [[13], [15], 11],
                "after": "panel_7",
                "group": "group1"
             },
             { 
              'trigger': "click",
              'operation': 'loadLayout',
              'element': "panel_7",
              'layout': [[16]],
              "after": "panel_7",
              "group": "group1"
           },
                 {
                   "operation": "isotype",
                   "variable": "totalMovement",
                   "to": "planePlaceHolder",
                   "attr": {
                      "widthIcon": 35
                   },
                   "icon": "images/CO2Footprint/plane.svg"
                  }
                  ,
                 {
                   "operation": "isotype",
                   "variable": "earthTimes",
                   "to": "earthPlaceHolder",
                   "attr": {
                    "widthIcon": 80
                   },
                   "icon": "images/CO2Footprint/earth.svg"
                  },
                 {
                   "operation": "isotype",
                   "variable": "totalTons",
                   "to": "fogPlaceHolder",
                   "attr": {
                    "widthIcon": 22
                   },
                   "icon": "images/CO2Footprint/fog.svg"
                  },
                 {
                   "operation": "isotype",
                   "variable": "tonsMoreThanEarthEverage",
                   "to": "MoreThanEarthPlaceHolder",
                   "attr": {
                    "widthIcon": 9
                   },
                   "icon": "images/CO2Footprint/smallFog.svg"
                  },
                 {
                   "operation": "isotype",
                   "variable": "moreThanParisGoal",
                   "to": "moreThanParisPlaceHolder",
                   "attr": {
                    "widthIcon": 38
                   },
                   "icon": "images/CO2Footprint/tonX.svg"
                  },
                 {
                   "operation": "isotype",
                   "variable": "treeIcon",
                   "to": "TreesPlaceHolder",
                   "attr": {
                    "widthIcon": 4.5
                   },
                   "icon": "images/CO2Footprint/treeIcon.svg"
                  },
                 {
                   "operation": "isotype",
                   "variable": "numCows",
                   "to": "cowsPlaceHolder",
                   "attr": {
                    "widthIcon": 15
                   },
                   "icon": "images/CO2Footprint/cowIcon.svg"
                  },
                  { 
                    operation: 'hyperlink',
                    trigger: "click",
                    element: 'panel_2',
                    link: "panel_3"
                  } 
               ]
             }


             this.state = {
              "currentLayout": "iniLayout",
              "layouts": [
               {
                "name": "iniLayout",
                "panels": [
                 [
                  0,
                  [
                   1,
                   2
                  ],
                  3
                 ],
                 [
                  4
                 ],
                 [
                  5
                  // ,
                  // 6,
                  // 7
                 ]
                ]
               }
              ],
              "classes": [],
              "variables": [
               {
                "name": "movementSpeed",
                "value": 0
               },
               {
                "name": "movementVelocity",
                "value": 0
               },
               {
                "name": "totalMovement",
                "value": 0,
                "what": [
                 "(",
                 "movementSpeed",
                 "+",
                 "movementVelocity",
                 ")",
                 "*1"
                ]
               },
               {
                "name": "totalkm",
                "value": 0,
                "what": [
                 "movementSpeed",
                 "*2000",
                 "+",
                 "movementVelocity",
                 "*8000"
                ]
               },
               {
                "name": "earthTimes",
                "value": 0,
                "what": [
                 "totalkm",
                 "/",
                 "40000"
                ]
               },
               {
                "name": "totalTons",
                "value": 0,
                "what": [
                 "totalkm",
                 "/",
                 "1000"
                ]
               },
               {
                "name": "tonsMoreThanEarthEverage",
                "value": 0,
                "what": [
                 "totalTons",
                 "-",
                 "5"
                ]
               },
               {
                "name": "tonsLessThanEarthEverage",
                "value": 0,
                "what": [
                  "5",
                  "-",
                  "totalTons"
                ]
               },
               {
                "name": "moreThanParisGoal",
                "value": 0,
                "what": [
                 "totalTons",
                 "-",
                 "1"
                ]
               },
               {
                "name": "numTrees",
                "value": 0,
                "what": [
                 "totalTons",
                 "*",
                 "45"
                ]
               },
               {
                "name": "treeIcon",
                "value": 0,
                "what": [
                 "numTrees",
                 "/",
                 "90"
                ]
               },
               {
                "name": "numCows",
                "value": 0,
                "what": [
                 "totalTons"
                ]
               }
              ],
              "panels": [
               {
                "id": 0,
                "url": "/CO2Footprint/inputPanel.svg",
                "sliders": [
                 {
                  "id": "slider_movementSpeed",
                  "variable": "movementSpeed"
                 },
                 {
                  "id": "slider_movementVelocity",
                  "variable": "movementVelocity"
                 }
                ]
               },
               {
                "id": 1,
                "url": "/CO2Footprint/totalKm.svg"
               },
               {
                "id": 2,
                "url": "/CO2Footprint/totalGlobe.svg"
               },
               {
                "id": 3,
                "url": "/CO2Footprint/CO2inTons.svg"
               },
               {
                "id": 4,
                "url": "/CO2Footprint/speechBubble.svg"
               },
               {
                "id": 5,
                "url": "/CO2Footprint/human_panel.svg"
               },
               {
                "id": 6,
                "url": "/CO2Footprint/tree_panel.svg"
               },
               {
                "id": 7,
                "url": "/CO2Footprint/cow_panel.svg"
               },
               {
                "id": 8,
                "url": "/CO2Footprint/averageCO2_panels.svg"
               },
               {
                "id": 9,
                "url": "/CO2Footprint/compareWithYouMore.svg"
               },
               {
                "id": 10,
                "url": "/CO2Footprint/parisHigher1ton.svg"
               },
               {
                "id": 11,
                "url": "/CO2Footprint/tree2Panels.svg"
               },
               {
                "id": 12,
                "url": "/CO2Footprint/humanClicked_panel.svg"
               },
               {
                "id": 13,
                "url": "/CO2Footprint/cows2Panels.svg"
               },
               {
                "id": 14,
                "url": "/CO2Footprint/averageCO2Less_panels.svg"
               },
               {
                "id": 15,
                "url": "/CO2Footprint/treeClicked_panel.svg"
               },
               {
                "id": 16,
                "url": "/CO2Footprint/cowClicked_panel.svg"
               }
              ],
              "operations": [
               {
                "trigger": "click",
                "condition": [
                 "totalTons",
                 " < 5"
                ],
                "operation": "loadLayout",
                "element": "panel_5",
                "layout": [
                 14,
                 [
                  10
                 ]
                ],
                "after": "panel_7",
                "group": "group1"
               },
               {
                "trigger": "click",
                "condition": [
                 "totalTons",
                 "> 5"
                ],
                "operation": "loadLayout",
                "element": "panel_5",
                "layout": [
                 8,
                 [
                  10
                 ]
                ],
                "after": "panel_7",
                "group": "group1"
               },
               {
                "trigger": "click",
                "operation": "loadLayout",
                "element": "panel_6",
                "layout": [
                 11,
                 [
                  10
                 ]
                ],
                "after": "panel_7",
                "group": "group1"
               },
               {
                "trigger": "click",
                "operation": "loadLayout",
                "element": "panel_7",
                "layout": [
                 13,
                 [
                  10
                 ]
                ],
                "after": "panel_7",
                "group": "group1"
               },

               {
                "trigger": "click",
                "operation": "loadLayout",
                "element": "panel_7",
                "layout": [
                 13,
                 [
                  10
                 ]
                ],
                "after": "panel_7",
                "group": "group1"
               },

               { 
                trigger: 'click',
                element: 'panel_5',
                operation: 'replace',
                replace: 'panel_5',
                newpanels: ['panel_15'], 
                flexwrap: false
           },
               {
                "operation": "isotype",
                "variable": "totalMovement",
                "to": "planePlaceHolder",
                "attr": {
                 "widthIcon": 35
                },
                "icon": "images/CO2Footprint/plane.svg"
               },
               {
                "operation": "isotype",
                "variable": "earthTimes",
                "to": "earthPlaceHolder",
                "attr": {
                 "widthIcon": 80
                },
                "icon": "images/CO2Footprint/earth.svg"
               },
               {
                "operation": "isotype",
                "variable": "totalTons",
                "to": "fogPlaceHolder",
                "on": 0,
                "attr": {
                 "widthIcon": 22
                },
                "icon": "images/CO2Footprint/fog.svg"
               },
               {
                "operation": "isotype",
                "variable": "tonsMoreThanEarthEverage",
                "to": "MoreThanEarthPlaceHolder",
                "on": 0,
                "attr": {
                 "widthIcon": 9
                },
                "icon": "images/CO2Footprint/smallFog.svg"
               },
               {
                "operation": "isotype",
                "variable": "moreThanParisGoal",
                "to": "moreThanParisPlaceHolder",
                "on": 0,
                "attr": {
                 "widthIcon": 38
                },
                "icon": "images/CO2Footprint/tonX.svg"
               },
               {
                "operation": "isotype",
                "variable": "treeIcon",
                "to": "TreesPlaceHolder",
                "on": 0,
                "attr": {
                 "widthIcon": 40
                },
                "icon": "images/CO2Footprint/9trees.svg"
               },
               {
                "operation": "isotype",
                "variable": "numCows",
                "to": "cowsPlaceHolder",
                "on": 0,
                "attr": {
                 "widthIcon": 15
                },
                "icon": "images/CO2Footprint/cowIcon.svg"
               }
              ]
             }
             
          var url_string = window.location.href;
          var url = new URL(url_string);
          var c = url.searchParams.get("JSON");
          // console.log(c)
          if (c != null) {
            codec('lzma').decompress(c).then(json => { console.log(json); this.wait = true; this.setState(json);})
            
          }
          else if (this.props.json != undefined) {
            this.state = this.props.json;
            this.wait = true
          }


          if (c!=null) {
            this.state.coding = url.searchParams.get("coding");
          }
    }
    componentDidMount(){
      // console.log(this.state.codin)
     
    //  console.log(codec)
    //  console.log($('#editor').css('width'))
    //  $('#buttons').css('left', 'calc(30% - 34px)');
    }
    componentDidUpdate(){
      console.log(this.state.coding)
      if (this.state.coding == 'false'){
        $('#editor').css('display', 'none');
        $('#editor').css('width', '0px');
        $('#container').css('width', '100%');
        
  
        // 
       }
    }
    share = () => {
      // var URLCombined = "https://hugoromat.github.io/interactiveComics/library/dist/index.html?JSON=";
      

      
      codec('lzma').compress(this.state).then(result => {

        var URLCombined = "https://hugoromat.github.io/interactiveComics/library/dist/index.html?JSON=";
        // var URLCombined = "http://127.0.0.1:8080?JSON=";
        // URLCombined += JSON.stringify(this.state);
        URLCombined += result
        URLCombined += "&coding=true"
        this.textToClipboard(URLCombined);
        $('#copied').fadeIn(200).delay(0).fadeOut(200)
      });

      
    }

    embedComic= () => {

      // http://127.0.0.1:8080/alliances.html
      console.log(window.location.href)
      // var url_string = "http://www.example.com/t.html?JSON=m2-m3-m4-m5"; //window.location.href
      // var url = new URL(url_string);
      // var c = url.searchParams.get("JSON");
      // console.log(c);
      // var URLCombined = "https://hugoromat.github.io/interactiveComics/library/dist/index.html?JSON=";

      codec('lzma').compress(this.state).then(result => {
        // var URLCombined = "http://127.0.0.1:8080?JSON=";
        var URLCombined = "https://hugoromat.github.io/interactiveComics/library/dist/index.html?JSON=";

        URLCombined += result
        URLCombined += "&coding=false"

          var iFrame = `
          <iframe id="InteractiveComics"
            title="InteractiveComics"
            width="300"
            height="200"
            src='`+URLCombined+`'>
          </iframe>
        `;

        console.log(iFrame);
        this.textToClipboard(iFrame);
        $('#copied').fadeIn(200).delay(0).fadeOut(200)
      })
    }
    textToClipboard (text) {
      var dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = text;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
  }
    renderComic= () => {
        for (var key in this.state){
            this.setState({[key]: []})
        }
        setTimeout(() => {
            // console.log(JSON.parse(this.refs.aceEditor.editor.getValue()))
            this.setState(JSON.parse(this.refs.aceEditor.editor.getValue())); 

            // this.refs.aceEditor.editor.commands.addCommand({
            //   name: 'save',
            //   bindKey: {win: "Ctrl-S", "mac": "Cmd-S"},
            //   exec: function(editor) {
            //       console.log("saving", editor.session.getValue())
            //   }
            // })

        }, 1000)

        // setTimeout(() =>{
        //      this.createClasses();

        //      // console.log('GOOOOO')
        //      // this.events.setVariables(this, this.state);
        //      // this.sliders.setVariables(this, this.state);
        //      this.events = new EventsPanels(this, this.state);
        //      this.sliders = new Slider(this, this.state);

        //      this.events.init();
        //      this.sliders.init();
             
        // }, 1000)

        
        // this.forceUpdate();
        //

   }
    render() {
     
      // console.log(this.state.coding)
      // var size = (this.state.coding == 'false') ? [0,100] : [0, 100]

      // console.log(size)
          return(
               <div>
                    
                    {this.wait == true ?

                      <Split sizes={[30, 70]} style={{display: 'flex'}}>

                          <div id="editor">
                            <div id="buttons">
                                <button id="go" className="boutton" onMouseDown={this.renderComic}> <VscRunAll size={28}/> </button>
                                <button id="embed" className="boutton" onMouseDown={this.embedComic}> <ImEmbed2 size={28}/></button>
                                <button id="share" className="boutton" onMouseDown={this.share}> <AiOutlineShareAlt size={28}/></button>

                                <div id="copied" >Copied in clipboard</div>

                            </div>
                                
                                <AceEditor
                                    onLoad={editorInstance => {
                                          editorInstance.container.style.resize = "both";
                                          // mouseup = css resize end
                                          document.addEventListener("mouseup", e => (
                                          editorInstance.resize()
                                        ));
                                    }}
                                    onInput={d => {
                                        // this.renderComic();
                                    }}
                                    onKeyDown={e => {
                                      console.log(e)
                                    }}

                                    ref="aceEditor"
                                    mode="java"
                                    theme="monokai"
                                    wrapEnabled={true}
                                    // onChange={onChange}
                                    fontSize={12}
                                    defaultValue={JSON.stringify(this.state, 1, 1)}
                                    name="hello"
                                    // editorProps={{ $blockScrolling: false }}
                                    
                                    // commands={Beautify.commands}
                                    style={{width:'100%', height:window.innerHeight+'px'}}
                                />
                          </div>
                          <div id="container">
                              {this.state.panels.length > 0  ? (<App json={this.state}/>) : ( null)}


                              
                          </div>
                      </Split> : null }
               </div>
          );
    }
}

export function start(JSONfile){
  ReactDOM.render( <OverallApp json={JSONfile} />, document.getElementById('root') );
}



// 
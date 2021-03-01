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


class OverallApp extends React.Component {
    constructor(props) {
        super(props);
        

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
        this.state = {
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
            currentLayout: 'smallLayout',
            layout: [{
                name: 'smallLayout',
                panels: [
                    [12, [14, 15]],
                    
                    [ 0,[1,2],[3, 13]],
                    [4],
                    [5,6,7]
                   ]
            },{
                name: 'secondLayout',
                panels: [
                    [12],
                    [1, 2, 3]
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
               }
            ],
            "operations": [
                {
                    
                    "trigger": "click",
                    "element": "panel_5",
                    "operation": "append",
                    "after": "panel_7",
                    "newpanels": [ ["panel_8", "panel_9"],[["panel_10"]]]
                },

                { 
                    'trigger': "click",
                    'operation': 'loadLayout',
                    'element': "Layout2",
                    'layout': "secondLayout"
                 }
                 ,
                { 
                    'trigger': "click",
                    'operation': 'loadLayout',
                    'element': "Layout1",
                    'layout': "smallLayout"
                 },
                 {
                    operation: 'isotype', 
                    variable:'movementSpeed',
                    to: 'isotypePlaceHolder2',
                    on: 0,
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
               }
                // ,
                // {
                //     "operation": 'zoom', 
                //     "trigger": "zoom",
                //     'element': "panel_6",
                //     'linked': ['isotypePlaceHolder2']
                   
                // }

            
            ]
           }

           this.state = {
               "classes": [],
               "currentLayout": "iniLayout",
               "layout": [
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
                       5,
                       6,
                       7,
                       8
                     ],
                     [10]
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
                   "url": "/CO2Footprint/cows2Panels.svg"
                 }
               ],
               "operations": [
             
                   { 
                   "trigger": "click",
                   "element": "panel_6",
                   "operation": "replace",
                   "after": "panel_7",
                   "newpanels": ["panel_11"]
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
                    "widthIcon": 4.5
                   },
                   "icon": "images/CO2Footprint/treeIcon.svg"
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
    }
    componentDidMount(){
        
    }
    renderComic= () => {
        for (var key in this.state){
            this.setState({[key]: []})
        }
        setTimeout(() => {
            // console.log(JSON.parse(this.refs.aceEditor.editor.getValue()))
            this.setState(JSON.parse(this.refs.aceEditor.editor.getValue())); 
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
          return(
               <div>
                    
                    <Split sizes={[30,70]} style={{display: 'flex'}}>

                        <div>
                              <button id="go" onMouseDown={this.renderComic}> GO</button>
                              <AceEditor
                                   onLoad={editorInstance => {
                                        editorInstance.container.style.resize = "both";
                                        // mouseup = css resize end
                                        document.addEventListener("mouseup", e => (
                                        editorInstance.resize()
                                        ));
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
                            {this.state.panels.length > 0 ? (<App json={this.state}/>) : ( null)}


                             
                        </div>
                    </Split>
               </div>
          );
    }
}





ReactDOM.render( <OverallApp/>, document.getElementById('root') );
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
             layout: {
                  arrangment: [[0,1,2], [3,4,[5,6]]]
                  // width: [['250px', '250px', '250px'], ['250px', '250px', '250px']]
             },
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
            "layout": {
             "arrangment": [
              [0,[1,2],3],
              [4],
              [5,6,7]
             ]
            },
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
              "url": "/CO2Footprint/around.svg"
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
             }
            ],
            "operations": [
                {
                    "condition": ['movementVelocity', '>5'],
                    "trigger": "click",
                    "element": "panel_5",
                    "operation": "append",
                    "after": "panel_7",
                    "newpanels": [ [["panel_8", "panel_9"],"panel_10"], ["panel_11"]]
                },
                {
                    "condition": ['movementVelocity', '<5'],
                    "trigger": "click",
                    "element": "panel_5",
                    "operation": "append",
                    "after": "panel_7",
                    "newpanels": [[[ "panel_8", "panel_9","panel_10"]]]
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
                        <div className="container">
                            {this.state.panels.length > 0 ? (<App json={this.state}/>) : ( null)}


                             
                        </div>
                    </Split>
               </div>
          );
    }
}





ReactDOM.render( <OverallApp/>, document.getElementById('root') );
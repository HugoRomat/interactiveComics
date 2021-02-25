import { geoEqualEarth } from 'd3';
import React from 'react';
import Cell from './Cell.js'

import * as d3 from 'd3';
import _ from 'underscore'
import AceEditor from "react-ace";
import { split as SplitEditor } from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import Beautify from 'ace-builds/src-noconflict/ext-beautify';
import $ from 'jquery';
import Split from 'react-split';
import { EventsPanels } from "./events";
import { Slider } from './slider.js';
// import operator from 'operator';

class App extends React.Component {
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
          this.events = new EventsPanels(this, this.state);
          this.sliders = new Slider(this, this.state);
     }
     // Change id to class
     createClasses(){
          this.state.classes.forEach((item)=>{
               // console.log(item)
               item.elements.forEach((id)=>{
                    $(id).addClass(item.class);
                    // d3.select(id).attr('class', item.class)
                    // console.log(id)
               })

          })
     }
     updateIsotype(){
          var isotypes = this.state.operations.filter((d)=> d.type == 'isotype');
          
          for (var i in isotypes){
               var isotype = isotypes[i];
               
               // var clockTime = time > 12 ? 'PM' : 'AM' ;
               var variableValue = this.state.variables.find((d) => d.name ==isotype['variable'] )['value']

               // console.log(variableValue, isotype['variable'])
               // console.log()
               var elementsSelected = $('.' + isotype.to).get();
               $('.imagesIsotope').remove()
               for (var k in elementsSelected){
                    var elementSelected = elementsSelected[k]
                    var BBox = $(elementSelected).get()[0].getBBox()

                    // console.log($(elementSelected).get()[0])
                    // var widthContainer = isotype.attr['widthContainer'] != undefined ? isotype.attr['widthContainer'] : BBox.width;
                    var width = isotype.attr['widthIcon']
                    var parentNode = $(elementSelected).parent().get()[0]//.select(this.parentNode)
                    
                    var parent = d3.select(parentNode).append('g').attr('class', 'imagesIsotope')
                         .attr('transform', 'translate('+ BBox.x + ',' + BBox.y + ')')

                    var fO = parent.append('foreignObject')
                                   .attr('width', BBox.width)
                                   .attr('height', BBox.height)

                    var bodyForeign = fO.append("xhtml:body")
                    for (var k =0; k < variableValue; k++){
                         $(bodyForeign.node()).append('<img width="'+width+'" src="'+isotype.icon+'"  />')
                    }
               }
              
               
          }

          
     }

     // For mathematical operations
     // When moving the sliders or updating things
     updateVariable = (variableName, value, isFinal) => {

          var myIndex = this.state.variables.findIndex(x => x.name ==variableName);
          this.state.variables[myIndex]['value'] = value;
          

          for (var i in this.state.variables){
               var variable = this.state.variables[i];
               if (variable.what != undefined){
                    var keys = Object.keys(variable)
                    var mathematicalFunction = "";
                    for (var j in variable.what){
                         var item = variable.what[j];
                         var myIndex = this.state.variables.findIndex(x => x.name == item);
                         // console.log(item, this.state.variables[item], this.state.variables)
                         if (myIndex == -1){
                              mathematicalFunction += item
                         } else {
                              mathematicalFunction += this.state.variables[myIndex]['value'];
                         }
                    }
                    variable.value = eval(mathematicalFunction)
                    
               }
               // update all panels name
               d3.selectAll('.'+variable.name).text(variable.value)
          }
          if (isFinal) {
               // console.log('END')
               this.setState({variables:this.state.variables})
          }
          // console.log('GOO')
          this.updateIsotype();
          this.events.setCondition();
          
     }
     changeLayout = (event, from, to, width) => {
          console.log(event, from, to, width)
          var indexes = []
          var arrayArrangement = this.state.layout.arrangment;
          for (var k in from){
               var d = from[k]
               for (var i= 0; i <  arrayArrangement.length; i++){
                    for (var j= 0; j <  arrayArrangement[i].length; j++){
                         // console.log(arrayArrangement[i][j],d)
                         if (arrayArrangement[i][j] == d){indexes.push([i,j])}
                    } 
               }
          }
          
          console.log(indexes)
          // if (event == "replace"){
          //      //TO REMOVE
          //      arrayArrangement[indexes[0][0]].splice(indexes[0][1], 1);
          //      this.state.layout.width[indexes[0][0]].splice(indexes[0][1], 1);

          //      // console.log()
          //      arrayArrangement[indexes[0][0]].splice(indexes[0][1], 0, ...to);
          //      this.state.layout.width[indexes[0][0]].splice(indexes[0][1], 0, ...width);
          // }
          if (event == 'append'){
               arrayArrangement[indexes[0][0]].splice(indexes[0][1]+1, 0, ...to);
               // this.state.layout.width[indexes[0][0]].splice(indexes[0][1]+1, 0, ...width);
          }
          if (event == 'remove'){
               //REMOVE EVERYTHING
               for (var i = indexes.length -1; i >= 0; i--){
                    arrayArrangement[indexes[i][0]].splice(indexes[i][1], 1);
                    // this.state.layout.width[indexes[i][0]].splice(indexes[i][1], 1);
               }
          }
          
          console.log(this.state.layout)
          this.setState({layout: this.state.layout})
     }
     // shouldComponentUpdate(nextProps, nextState) {
     //      if (this.state.variables != nextState.variables){
     //           return false;
     //      }
     //      return this.state.value != nextState.value;
     // }
     addCell = ( copy) => {
          
          this.setState({panels: [ ...this.state.panels, JSON.parse(JSON.stringify(copy))]})
          // console.log(this.state.panels)
     }
     componentDidMount(){
          // when images will be loaded
          setTimeout(() =>{
               this.createClasses();
               this.events.init();
               this.sliders.init();
               
          }, 1000)
          // this.handleClass();
     }
     // addColumn = () => {
     //      var lengthCell = this.state.cells.length;
     //      this.setState({cells: [...this.state.cells,{id:'cell'+lengthCell, type: 'column', text: 'how', w: 300, h: 100, objects:[]}]})
     // }
     renderComic= () => {
          // console.log('GO')
          var that = this;
          this.setState({layout: []})
          setTimeout(function(){ that.setState(JSON.parse(that.refs.aceEditor.editor.getValue())); }, 100)
          
          // this.forceUpdate();
          //

     }
     render() {
          var comicRendering = null;
          // console.log(this.state.panels, this.state.layout.arrangment)
          if (this.state.layout.length != 0){
               comicRendering = this.state.layout.arrangment.map((line, index) => ( 
                    <div className="line" key={index}>
                         {
                              line.map((cell, indexCell) => {
                                   // console.log(cell);
                                   var cellData = [];
                                   if (cell.length != undefined) cell.forEach((d)=> cellData.push(this.state.panels.find(x => x.id == d)))
                                   else cellData = this.state.panels.find(x => x.id == cell)
                                   // console.log(cellData)
                                   // for (var i =0; i < )
                                   return ( 
                                        <Cell  
                                             // h="100"
                                             // w={this.state.layout.width[index][indexCell]} 
                                             // w="100"
                                             // w={'auto'}
                                             cell={cell} 
                                             cellData={cellData}
                                             key={cell}
                                             // event={event}
                                             changeLayout={this.changeLayout}
                                             updateVariable={this.updateVariable}
                                             variables={this.state.variables}
                                        /> 
                                   )
                              })
                         }
     
                    </div>
               ))
          }
          

          // if (this.state.rendering == false) comicRendering = null; 
          return(
               <div className="app">
                    {/* <UIToolbar /> */}

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
                                   fontSize={15}
                                   defaultValue={JSON.stringify(this.state, 1, 1)}
                                   name="hello"
                                   // editorProps={{ $blockScrolling: false }}
                                   
                                   // commands={Beautify.commands}
                                   style={{width:'100%', height:window.innerHeight+'px'}}
                              />
                         </div>

                         <div className="container">
                              {comicRendering}
                             
                         </div>
                         
                         
                    </Split>
                    
                    
                    
               </div>
               
          );
     }
}
export default App;

import { geoEqualEarth } from 'd3';
import React from 'react';
import Cell from './Cell.js'
import UIToolbar from './UIToolbar.js'
import _ from 'underscore'
import AceEditor from "react-ace";
import { split as SplitEditor } from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import Beautify from 'ace-builds/src-noconflict/ext-beautify';
import $ from 'jquery';
import Split from 'react-split';
// import operator from 'operator';

class App extends React.Component {
     constructor(props) {
          super(props);

          this.state = {
               layout: {
                    arrangment: [[0,1,3], [2,4,[5,6]]],
                    width: [['250px', '250px', '250px'], ['250px', '250px', '250px']]
               },
               variables: [
                    {'name': 'movementSpeed', 'value': 0 },
                    {'name': 'movementVelocity', 'value': 0 },
                    {'name': 'totalMovement', 'value': 0, 'what': ['movementSpeed', '+', 'movementVelocity']}
               ],
               panels:[
                    {
                         id:0, 
                         url:'handL.svg',
                         sliders: [
                              {id:'slider_movementSpeed', variable:'movementSpeed', top:'100px', w:'70%'}, 
                              {id:'slider_movementVelocity', variable:'movementVelocity',  w:'70%', top:'200px'}
                         ]
                    },
                    {id:1, url:'handL.svg'},
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
                    {id:13, url:'handL.svg'},
                    {id:14, url:'handL.svg'}
               ],
               operations: [
                    { 
                         type: 'replace', 
                         action: { from: [3], to: [[11, 12], [13, 14]], width: ['250px', '30px']},
                         event: 'click',
                         on: 2,
                         backForth: true
                    },
                    { 
                         type: 'append', 
                         action: { from: [2], to: [9], width: ['120px']},
                         event: 'click',
                         on: 1,
                         backForth: true
                    },
                    {
                         type: 'isotype', 
                         // from:'slider_movementSpeed',
                         variable:'totalMovement',
                         to: 'isotypePlaceHolder',
                         on: 0,
                         icon: 'images/fog.png'
                    },
                    {
                         type: 'isotype', 
                         // from:'slider_movementSpeed',
                         variable:'movementSpeed',
                         to: 'isotypePlaceHolder2',
                         on: 0,
                         icon: 'images/bull.png'
                    }
                    // { 
                    //      type: 'remove', 
                    //      action: { from: [0, 1, 3]},
                    //      event: 'click',
                    //      on: 2,
                    //      backForth: true
                    // }
                         
               ]
          }
     }
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
          }
          if (isFinal) {
               this.setState({variables:this.state.variables})
          }
          
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
               this.state.layout.width[indexes[0][0]].splice(indexes[0][1]+1, 0, ...width);
          }
          if (event == 'remove'){
               //REMOVE EVERYTHING
               for (var i = indexes.length -1; i >= 0; i--){
                    arrayArrangement[indexes[i][0]].splice(indexes[i][1], 1);
                    this.state.layout.width[indexes[i][0]].splice(indexes[i][1], 1);
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
     addCell = () => {
          // var lengthCell = this.state.cells.length;
          // this.setState({cells: [ ...this.state.cells,{id:'cell'+lengthCell, text: 'how', w: 300, h: 100, objects:[]}]})
     }
     componentDidMount(){
          // this.refs.aceEditor.resize();
          // $("#hello").css('height', window.innerHeight)
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
          // console.log(this.state.layout)
          if (this.state.layout.length != 0){
               comicRendering = this.state.layout.arrangment.map((line, index) => ( 
                    <div className="line" key={index}>
                         {
                              line.map((cell, indexCell) => {
                                   // console.log(cell.length);
                                   var cellData = [];
                                   if (cell.length != undefined) cell.forEach((d)=> cellData.push(this.state.panels[d]))
                                   else cellData= this.state.panels[cell];
     
                                   let event = this.state.operations.filter(x => x.on == cell);
                                   // var event = this.state.operations.find(x => x.on == cell)
                                   // console.log(event)
                                   // for (var i =0; i < )
                                   return ( 
                                        <Cell  
                                             h="100"
                                             w={this.state.layout.width[index][indexCell]} 
                                             // w={'auto'}
                                             cell={cell} 
                                             cellData={cellData}
                                             key={cell}
                                             event={event}
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

                         <div className="panel">
                              {comicRendering}
                             
                         </div>
                         
                         
                    </Split>
                    
                    
                    
               </div>
               
          );
     }
}
export default App;

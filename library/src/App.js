import { geoEqualEarth } from 'd3';
import React from 'react';
import Cell from './Cell.js'
import Hello from './Hello.js'
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
import { uuidv4 } from './helper.js';

// import operator from 'operator';

class App extends React.Component {
     constructor(props) {
          super(props);
          
          this.mountedComponents = []
          this.state = this.props.json;
          this.events = new EventsPanels(this, this.state);
          this.sliders = new Slider(this, this.state);


          this.isMounted_ = false;
         



          // this.state.panels = this.state.panels.map(obj=> ({ ...obj, idTemp : uuidv4() }))
          // this.state.panels.forEach((item)=>{
          //      item.idTemp = uuidv4();

          // })

          // console.log(this.state.panels)

          this.panels = JSON.parse(JSON.stringify(this.state.panels));


     }
     // Change id to class
     createClasses(){
          console.log(this.state)
          if (this.state.classes != undefined){
               this.state.classes.forEach((item)=>{
                    // console.log(item)
                    item.elements.forEach((id)=>{

                         
                         $('.' + id).addClass(item.class);
                         // d3.select(id).attr('class', item.class)
                         // console.log(id, item.class, $('.' + id).get())
                    })
     
               })
          }

          // create unique ID

         
         
     }
     updateIsotype(){
          var isotypes = this.state.operations.filter((d)=> d.operation == 'isotype');
          // console.log(isotypes)
          
          for (var i in isotypes){
               var isotype = isotypes[i];
               // console.log(isotype)
               
               // var clockTime = time > 12 ? 'PM' : 'AM' ;
               var variableValue = this.state.variables.find((d) => d.name ==isotype['variable'] )['value']
               // $('.imagesIsotope'+variableValue).remove();
               // console.log(variableValue, isotype['variable'])
               // console.log()
               var elementsSelected = $('.' + isotype.to).get();
               // console.log(elementsSelected)
               
               for (var k in elementsSelected){
                    
                    var fO = null;
                    var width = isotype.attr['widthIcon']
                    // IF isotype does not exist
                    if (!$(".imagesIsotope"+ isotype['variable'] + "_"+i+"_"+k).length){
                         var elementSelected = elementsSelected[k]
                         var BBox = $(elementSelected).get()[0].getBBox()

                    
                         
                         var parentNode = $(elementSelected).parent().get()[0]//.select(this.parentNode)
                         var parent = d3.select(parentNode).append('g').attr('class', 'imagesIsotope'+ isotype['variable'] + "_"+i+"_"+k)
                         .attr('transform', 'translate('+ BBox.x + ',' + BBox.y + ')')

                         fO = parent.append('foreignObject')
                                        .attr('width', BBox.width)
                                        .attr('height', BBox.height)
                    }
                     else {
                         fO = d3.select(".imagesIsotope"+ isotype['variable'] + "_"+i+"_"+k).select('foreignObject')
                         $(".imagesIsotope"+ isotype['variable'] + "_"+i+"_"+k+" > foreignObject").empty()
                    }
                    
                    var bodyForeign = fO.append("xhtml:body")
                    for (var k =0; k < variableValue; k++){

                         var e = document.createElement("img");
                         e.src = isotype.icon;
                         e.width = width;
                         bodyForeign.node().appendChild(e);
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
               // $("."+variable.name +"> text").remove();
               // $("."+variable.name +"> text").html('<text> hello </text>')
               // d3.selectAll('.'+variable.name).text(variable.value)
               // d3.selectAll('.'+variable.name).text(variable.value)
               var elementsSelected = $('.' + variable.name).get();
               $('.variables'+variable.name).remove()
               for (var k in elementsSelected){
                    var elementSelected = elementsSelected[k]
                    var BBox = $(elementSelected).get()[0].getBBox()

                    var parentNode = $(elementSelected).parent().get()[0]//.select(this.parentNode)
                    
                    var parent = d3.select(parentNode).append('g').attr('class', 'variables'+variable.name)
                         .attr('transform', 'translate('+ BBox.x + ',' + (BBox.y + 15) + ')')

                    var fO = parent.append('text').attr('fill', 'black').text(variable.value)

                    
               }

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
          var arrayArrangement = this.state.layouts.arrangment;
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
          
          console.log(this.state.layouts)
          this.setState({layouts: this.state.layouts})
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
          


          
          // setTimeout(()=>{

          //      var layout = this.state.layout.find(x => x.name == this.state.currentLayout);
          //      layout.panels[0][0] = 2
          //      // layout.panels[0].splice(0, 1, 16);
          //      // layout.panels[0].splice(0, 1)//, 16);
          //      this.setState({layout: this.state.layout})
          //      // console.log
        
          // }, 3000)
          // this.handleClass();
          
     }
     isMounted = (cellId, isIt) => {
          var layout = this.state.layouts.find(x => x.name == this.state.currentLayout);
          
          this.mountedComponents.push(cellId);
          // console.log(this.mountedComponents.length == layout.panels.flat(10).length, this.isMounted_ == false)

          // console.log(this.mountedComponents.length, layout.panels.flat(10).length)
          
          if (this.mountedComponents.length == layout.panels.flat(10).length && this.isMounted_ == false){
               
               setTimeout(() =>{
                    console.log('GOOOOOOOOOOOOOOOOOOOOOOOOOOO')
                    this.createClasses();
                    this.events.init();
                    this.sliders.init();

                    this.sliders.update()
                    this.isMounted_ = true;

                    if (this.state.gutter != undefined) {
                         var style = $(`<style>
                         
                              .panel { margin: `+ this.state.gutter+`px; }
                              .line {margin: `+(this.state.gutter)+`px; }
                         
                         }</style>`);
                         $('html > head').append(style);
                    }
                    if (this.state.scale != undefined) {
                         $('.app').css('transform', 'scale('+this.state.scale+')')
                    }
               
               }, 500)
               
          }
          // console.log(this.mountedComponents.length, layout.panels.flat(10).length)
     }
     reloadEvents(){

          // setTimeout(() =>{
          //      this.createClasses();

          //      this.events = new EventsPanels(this, this.state);
          //      this.sliders = new Slider(this, this.state);
          
          //      this.events.init();
          //      this.sliders.init();
               
          // }, 1000)
          
     }
     // addColumn = () => {
     //      var lengthCell = this.state.cells.length;
     //      this.setState({cells: [...this.state.cells,{id:'cell'+lengthCell, type: 'column', text: 'how', w: 300, h: 100, objects:[]}]})
     // }
     
     render() {
          
          var comicRendering = null;
          console.log(this.state.layouts)
          if (this.state.layouts.length != 0){
               var layout = this.state.layouts.find(x => x.name == this.state.currentLayout)
               console.log('=====================', layout.panels)
               comicRendering = layout.panels.map((line, index) => (
                    // <div className="line" key={'b'}>line.flat(5)[0]
                     <div className="line" key={index}> 
                         {
                              line.map((cell, indexCell) => {
                                   // console.log(cell);
                                   var cellData = [];
                                   if (Array.isArray(cell)) cell.forEach((d)=> cellData.push(this.panels.find(x => x.id == d)))
                                   else cellData = this.panels.find(x => x.id == cell)
                                   // console.log(cellData, cell)
                                   // console.log(this.panels)\\

                                   cellData = JSON.parse(JSON.stringify(cellData))
                                   
                                   var isDuplicate = layout.panels.flat(2).filter(x => x == cell)
                                   console.log(isDuplicate)
                                   // var id = (Array.isArray(cell)) ? cellData.map((d=> d.idTemp)).join() : cellData.idTemp;
                                   var id = (Array.isArray(cell)) ? cell.join() : cell;

                                   if (isDuplicate.length > 1 && !(Array.isArray(cell))) id = indexCell
                                   console.log(id)
                                   return ( 
                                        <Cell  
                                             // h="100"
                                             // w={this.state.layout.width[index][indexCell]} 
                                             // w="100"
                                             // w={'auto'}
                                             cell={cell} 
                                             cellData={cellData}
                                             key={id}
                                             debug={this.state.debug}
                                             showInteraction={this.state.showInteraction}
                                             // event={event}
                                             changeLayout={this.changeLayout}
                                             updateVariable={this.updateVariable}
                                             variables={this.state.variables}
                                             isMounted={this.isMounted}
                                        /> 
                                   )
                              })
                         }
                    </div>
               ))
               // comicRendering = layout.panels.map((line, index) => (
               //      <div className="line" key={index}>
               //      {
               //           line.map((cell, indexCell) => {
               //                return <Hello name={cell} key={cell}/>
               //           })
               //      }
               //      </div>

               // ))
          }
          

          // if (this.state.rendering == false) comicRendering = null; 
          return(
               <div className="app">
                    <div className="container">
                         {comicRendering}   
                    </div>
               </div>
               
          );
     }
}
export default App;

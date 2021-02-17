import React from 'react';
import './css/gallery.css';
import * as d3 from 'd3';
import SingleObject from './SingleObject';
import { Resizable } from "re-resizable";
import { Range } from 'react-range';
import $ from 'jquery';

class Cell extends React.Component {
    constructor(props) {
        super(props);

        this.state = { values: [50], sliders: null, isotype: []  };
        this.slidersPosition = []
    }
    componentDidMount(){
        var that = this;
        
        
        if (that.props.cellData.url != undefined){
            this.loadingImage().then(()=> {
                if (that.props.cellData['sliders'] != undefined){
                    that.props.cellData['sliders'].forEach((d,i) => {
                        var id = d.id;
                        var variable = d.variable;
                        this.state[variable] = [10]         
                    });
                    this.setState({sliders: true})
                }
                
           
        
            if (that.props.event != undefined ){

                
                // var event = that.props.event;
                

                console.log( that.props.event)
                for (var i in that.props.event){
                    var event =  that.props.event[i];
                    var events = that.props.event;

                    console.log(event)
                    d3.select('#cell_'+ event.on).attr('open', false);
                

                    if (event.type == 'remove'){
                        d3.select('#cell_'+ event.on).on(event.event, function(){
                            if (d3.select(this).attr('open') == 'false'){
                                that.props.changeLayout('remove', event.action.from, event.action.to, event.action.width);
                                d3.select(this).attr('open', true)
                            }
                        })
                    }
                    
                    if (event.type == 'append'){
                        
                        d3.select('#cell_'+ event.on).on(event.event, function(){
                            if (event.backForth == true){
                                if (d3.select(this).attr('open') == 'false'){
                                    that.props.changeLayout('append', event.action.from, event.action.to, event.action.width);
                                    d3.select(this).attr('open', true)
                                } else {
                                    that.props.changeLayout('remove', event.action.to, event.action.from, event.action.width);
                                    d3.select(this).attr('open', false)
                                }
                            } else{
                                if (d3.select(this).attr('open') == 'false'){
                                    that.props.changeLayout(event.type, event.action.from, event.action.to, event.action.width);
                                    d3.select(this).attr('open', true)
                                }
                            }
                        })
                    }
                    if (event.type == 'replace'){
                        
                        d3.select('#cell_'+ event.on).attr('eventiteration', i).on(event.event, function(){
                            console.log('======', event)
                            var k = parseInt(d3.select(this).attr('eventiteration'));
                            if (events[k].backForth == true){
                                if (d3.select(this).attr('open') == 'false'){
                                    that.props.changeLayout('append', events[k].action.from, events[k].action.to, events[k].action.width);
                                    that.props.changeLayout('remove', events[k].action.from, [], []);
                                    d3.select(this).attr('open', true)
                                } else {
                                    that.props.changeLayout('append', events[k].action.to, events[k].action.from, events[k].action.width);
                                    that.props.changeLayout('remove', events[k].action.to, [], []);
                                    d3.select(this).attr('open', false)
                                }
                            } else{
                                if (d3.select(this).attr('open') == 'false'){
                                    that.props.changeLayout('append', events[k].action.from, events[k].action.to, events[k].action.width);
                                    that.props.changeLayout('remove', events[k].action.from, [], []);
                                    d3.select(this).attr('open', true)
                                }
                            }
                        })
                    }
                    // console.log(event)
                    
                    if (event.type == 'isotype'){
                        console.log('HELLO', event);
                        // that.setState({})
                        // that.setState({isotype: event})
                        that.state.isotype.push(event);
                        this.setState({isotype: that.state.isotype})


                        setTimeout(function(){
                            // console.log('=====================')
                            for (var d in that.state.isotype){
                                var isotype = that.state.isotype[d];

                                var node = d3.select('.foreignClass_'+isotype.to).node()
                                // console.log(node)
                                // if (that.props.cellData.id == event.from){
                                if ( node == null ) {
                                    console.log('EHHH')
                                    d3.select('#'+isotype.to).append('foreignObject').attr('class', 'foreignClass_'+isotype.to)
                                        .attr('width', '100%')
                                        .attr('height', '100%')
                                        .attr("x", 0).attr("y", 0)
                                }
                            }

             
                        }, 1000)
                       
                        // }
                    }
                }
                
            } 
        });
        }
    }
    loadingImage(){
        var that = this;
        return new Promise((resolve, reject) => {
            d3.select("#svg_"+ that.props.cellData.id).attr("viewBox", "0 0 700 500")
                // .attr("preserveAspectRatio", "xMinYMin meet")
                // console.log(that.props.cellData.url)
            d3.svg("images/"+ that.props.cellData.url).then(function(xml) {
                console.log(that.props.cellData)
                xml.documentElement.childNodes.forEach(element => {
                    d3.select("#svg_"+ that.props.cellData.id).node().appendChild(element.cloneNode(true));
                });
                // console.log('image loaded')
                resolve(true)
            })
            
        })
    }
    // changeWidthHeight()
    movingSlider = (d, index, variable, id, isFinal) => {
        this.setState({[variable]: d });
        // d3.select()

        var slider = this.props.cellData['sliders'][index];
        // console.log(slider)
        d3.selectAll('.'+ slider.variable).text(d)

        // console.log(variable)
        this.props.updateVariable(variable, d[0], isFinal)
        // console.log(this.props.event)
        // if (this.props.event != undefined ){
            
        //     var event = this.props.event[0];
            // console.log(event)
            // if (event.type == 'isotype'){
            //     // console.log(id, event.from)
            //     if (variable == event.from){
            //         // console.log(d)
            //         $('#'+event.to+' > foreignObject').html('')
            //         for (var i=0; i<d[0]; i++){
            //             d3.select('#'+event.to).select('foreignObject')
            //             $('#'+event.to+' > foreignObject').append('<img style="width:100px;" src="../images/fog.png" />')
                            
            //         }
                   
            //     }
                
                
            // }
        // }
        // console.log(event)
       
    }
    render() {
        var that = this;
        let button;
        let sliders;
        // let isotype;


        // IF NOTHING ELSE
        if (this.props.cell.length == undefined) {
            button = <svg id={"svg_"+ this.props.cellData.id} width="100%" height="100%" style={{float: 'left'}}></svg>
            //<img src={"images/"+ this.props.cellData.url} />
  
        } else {
            var height = 100/this.props.cell.length;
            button = this.props.cell.map((cell, index) => {
                console.log(this.props.cellData)
                return ( 
                    <Cell 
                        h={height} 
                        w={'100%'} 
                        cell={cell} 
                        cellData={this.props.cellData[index]} 
                        key={cell}
                        variables={this.props.variables}
                    /> 
                )
            })
        }
        if (this.state.isotype.length != 0){

            for (var d in this.state.isotype){
                var isotype = this.state.isotype[d];
                // console.log(isotype.to)
                var myIndex = this.props.variables.findIndex(x => x.name == isotype.variable);
                $('#' + isotype.to + ' > foreignObject').html('')
                for (var i=0; i<that.props.variables[myIndex].value; i++){
                    $('#'+isotype.to+' > foreignObject').append('<img style="width:100px;" src='+isotype.icon+' />')               
                }
            }
            
        }
        // style={{position: 'absolute',top: slider.top+'px', left: slider.left+'px'}}
        if (this.state.sliders != null){
            sliders = this.props.cellData['sliders'].map((slider, index) => {
                // console.log(slider)
                var id = slider.id;
                var variable = slider.variable;
                // var sliderData = that.props.cellData['sliders'][index]
                return ( <Range
                    // style={{}}
                    className={'slider'}
                    key = {id}
                    step={0.1}
                    min={0}
                    max={100}
                    values={this.state[variable]}
                    onFinalChange={(d) => this.movingSlider(d, index, variable, id, true)}
                    onChange={(d) => this.movingSlider(d, index, variable, id, false)}
                    renderTrack={({ props, children }) => (
                        <div {...props} style={{...props.style, margin: '0 auto', position: 'relative', top: slider['top'], left: slider['left'], height: '6px',width: slider['w'],backgroundColor: '#ccc'}}>
                        {children}
                        </div>
                    )}
                    renderThumb={({ props }) => (<div {...props} style={{...props.style, height: '42px', width: '42px', backgroundColor: '#999', zIndex:1000}}/>)}
                    />
            )})
        }

       /* if (this.props.cellData['sliders'] != undefined){
            this.props.cellData['sliders'].forEach(d => {
                var id = d.id;
                var variable = d.variable;

                // var position = d3.select('#'+ id).node().getBoundingClientRect();
                console.log(d3.select('#'+ id))

                sliders = <Range
                    step={0.1}
                    min={0}
                    max={100}
                    values={this.state.values}
                    onChange={(values) => this.setState({ values })}
                    renderTrack={({ props, children }) => (
                        <div {...props} style={{...props.style,height: '6px',width: '60%',backgroundColor: '#ccc'}}>
                          {children}
                        </div>
                      )}
                      renderThumb={({ props }) => (<div {...props} style={{...props.style, height: '42px', width: '42px', backgroundColor: '#999'}}/>)}
                    />
                // d3.select('#'+ id).append('foreignObject').attr({
                //     'width': '200'
                // });
                
                console.log(d)              
            });
        }*/




          return(

            
            <div className="cell" id={"cell_"+ this.props.cell} style={{height: this.props.h + "%", width: this.props.w }}>
                {button}
                {sliders}
                
                <div style={{position: 'relative', top: '-20px', width:'10px', height:'10px'}}> {this.props.cell} </div>
                {/* <div className="dot"></div> */}
            </div>
           
          );
    }
}
export default Cell

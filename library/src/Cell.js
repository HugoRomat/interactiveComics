import React from 'react';
import './css/gallery.css';
import * as d3 from 'd3';
// import SingleObject from './SingleObject';
import { Resizable } from "re-resizable";
import { Range } from 'react-range';
import $ from 'jquery';


class Cell extends React.Component {
    constructor(props) {
        super(props);

        this.state = { values: [50], sliders: null, isotype: []  };
        this.slidersPosition = [];
        
    }
    
    componentDidMount(){
        var that = this;
        
        // console.log(that.props)
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

                if (that.props.cellData.type == "map"){
                    console.log(that.props.cellData)
                    // $('.panel_'+ that.props.cellData.id).addClass('mapLayer');
                    for (var key in that.props.cellData.attr){
                        d3.select('.panel_'+ that.props.cellData.id).style(key, that.props.cellData.attr[key])
                    }
                    // $('.panel_'+ that.props.cellData.id)
                    console.log()
                }
                
                // console.log(that.props.cellData.zoomable)
                // if (that.props.cellData.zoomable != undefined && that.props.cellData.zoomable == true){
                //     // console.log("HEYYYY")

                //     d3.select()
                // }
        
            // if (that.props.event != undefined ){
            //     console.log( that.props.event)
            //     for (var i in that.props.event){
            //         var event =  that.props.event[i];
            //         var events = that.props.event;

            //         console.log(event)
            //         // SET EVENTS IN PANEL
            //     } 
            // } 
        });
        }
    }
    //replace itt with class
    replaceClass(DOMelement){
        var items = DOMelement.getElementsByTagName("*");
        for (var i = items.length; i--;) {
            var item = items[i];
            var id = $(item).attr('id')
            // console.log(id)
            $(item).addClass(id);
            $(item).removeAttr('id');
            // console.log(id)
            // if ($(item).hasClass("panel")){
            //     console.log('HELLO')
            // }
        }
        return DOMelement;
    }
    loadingImage(){
        var that = this;
        return new Promise((resolve, reject) => {
            //.attr("viewBox", "0 0 700 500")
                // .attr("preserveAspectRatio", "xMinYMin meet")
                // console.log(that.props.cellData.url)
            d3.svg("images/"+ that.props.cellData.url).then(function(xml) {
                // var width = d3.select(xml.documentElement).attr('width')
                // var height = d3.select(xml.documentElement).attr('height')

                var DOM = that.replaceClass(xml.documentElement.cloneNode(true))
                d3.select("#panel_"+ that.props.cellData.id).node().appendChild(DOM);

                if (that.props.cellData.content != undefined){
                    d3.select("#panel_"+ that.props.cellData.id).select('svg').selectAll('*').remove();
                    $("#panel_"+ that.props.cellData.id).addClass('noBorder');
                }

                var id = $("#panel_"+ that.props.cellData.id).attr('id')
                $("#panel_"+ that.props.cellData.id).addClass(id);
                // $(item).removeAttr('id');
                // console.log(that.props.cellData)
                // d3.select("#svg_"+ that.props.cellData.id).attr('width', width).attr('height', height)
                // console.log()
                // xml.documentElement.childNodes.forEach(element => {
                //     d3.select("#svg_"+ that.props.cellData.id).node().appendChild(element.cloneNode(true));
                // });
                // console.log('image loaded')
                resolve(true)
            })
            
        })
    }
    
    render() {
        var that = this;
        let svg;
        let sliders;
        // let isotype;


        // IF NOTHING ELSE
        if (this.props.cell.length == undefined) {
            // svg = <svg id={"svg_"+ this.props.cellData.id} style={{float: 'left'}}></svg>
            //<img src={"images/"+ this.props.cellData.url} />
  
        } else {
            // var height = 100/this.props.cell.length;
            svg = this.props.cell.map((cell, index) => {
                // console.log(this.props.cellData)
                return ( 
                    <Cell 
                        // h={height} 
                        // w={'100%'} 
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
           
        }

          return(

            
            <div className="panel" id={"panel_"+ this.props.cell} style={{height: this.props.h + "%", width: this.props.w }}>
                {svg}
                {sliders}
                
                <div style={{position: 'absolute'}}> ID: {this.props.cell} </div>
                {/* <div className="dot"></div> */}
            </div>
           
          );
    }
}
export default Cell

import React from 'react';
import './css/gallery.css';
import * as d3 from 'd3';
// import SingleObject from './SingleObject';
import { Resizable } from "re-resizable";
import { Range } from 'react-range';
import $ from 'jquery';
import shallowCompare from 'react-addons-shallow-compare';
import { CSSTransition, Transition } from 'react-transition-group';

class Cell extends React.Component {
    constructor(props) {
        super(props);

        this.state = { values: [50], sliders: null, isotype: [], mounted: false };
        this.slidersPosition = [];
        
    }
    componentWillUnmount(){
        // console.log('DELETE ', this.props.cell)

        // $("#panel_"+ this.props.cell).fadeOut( "slow")
        this.setState({ mounted: false});
    }
    shouldComponentUpdate(nextProps, nextState){
        // if (nextProps)
        if (nextProps.cellData.visible!=undefined && nextProps.cellData.visible == false && this.state.mounted == true){
            console.log('GOOOOOOOOOOOOO')
            this.setState({ mounted: false});
        }
        // console.log(nextProps.cellData.cell)
        return true
    }
    componentDidMount(){
        this.setState({ mounted: true});
        // console.log('MOUNTING ', this.props.cell)
        var that = this;
        
        // console.log(that.props)
        // console.log('CREATE ', this.props.cell)
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

                // console.log(this.props.cellData, this.props.cell)
                this.props.isMounted(this.props.cell, true)

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
            var url = that.props.cellData.url;
            var extension = url.split(".").pop();
            var firstCharact = url.substring(0, 3)
            // console.log(url, extension)
            if (firstCharact != 'htt' && extension == 'svg') {
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
                    resolve(true)
                })
            } 
            if (firstCharact != 'htt' && (extension == 'png' || extension == 'jpg')) {
                $("#panel_"+ that.props.cellData.id).append("<img width='400px' src='images/"+  that.props.cellData.url +"'/>")


                var id = $("#panel_"+ that.props.cellData.id).attr('id')
                $("#panel_"+ that.props.cellData.id).addClass(id);

                resolve(true)

            } 
            if (firstCharact == 'htt' && extension == 'svg') {
                // console.log(that.props.cellData.url)
                d3.svg(that.props.cellData.url).then(function(xml) {
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
                    resolve(true)
                })
                // var ajax = new XMLHttpRequest();
                // ajax.open("GET", that.props.cellData.url, true);
                // ajax.send();
                // ajax.onload = function(e) {
                // var div = document.createElement("div");
                // div.innerHTML = ajax.responseText;
                // document.body.insertBefore(div, document.body.childNodes[0]);
                // }
                // $.ajax({
                //     headers: { "Accept": "application/json"},
                //     type: 'GET',
                //     dataType: 'json',
                //     url: that.props.cellData.url,
                //     crossDomain: true,
                //     beforeSend: function(xhr){
                //         xhr.withCredentials = true;
                //   },
                //     success: function(data, textStatus, request){
                //         console.log(data);
                //     }
                //  });

            }
            // if (firstCharact == 'htt'){
            //     $("#panel_"+ that.props.cellData.id).append("<img width='400px' src='"+  that.props.cellData.url +"'/>")
            // }
            
            
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

                        isMounted={this.props.isMounted}

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
        const defaultStyle = {
            height: this.props.h + "%",
            width: this.props.w
        }
        // const transitionStyle = {
        //     entering: {opacity: 0.5},
        //     entered: {opacity: 1},
        //     exiting: {opacity: 0.5},
        //     exited: {opacity: 0}
        // }

          return(
            <CSSTransition in={this.state.mounted} timeout={1000} classNames="my-node" >
                <div> 
                    <div className="panel" id={"panel_"+ this.props.cell} style={{...defaultStyle}}>
                        {svg}
                        {sliders}
                        
                        <div style={{position: 'absolute', fontSize: '60px', fontWeight: '900'}}> ID: {this.props.cell} </div>
                         {/* <div className="dot"></div> */}
                     </div>
                 </div>
          </CSSTransition>


            // <CSSTransition in={this.state.mounted} timeout={10000} className="sample">
            //     <div> 
            //         <div className="panel" id={"panel_"+ this.props.cell} style={{...defaultStyle}}>
            //             {svg}
            //             {sliders}
                        
            //             <div style={{position: 'absolute'}}> ID: {this.props.cell} </div>
            //             {/* <div className="dot"></div> */}
            //         </div>
            //     </div>
            // </CSSTransition>
           
          );
    }
}
export default Cell

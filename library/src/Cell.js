import React from 'react';
import './css/gallery.css';
import * as d3 from 'd3';
// import SingleObject from './SingleObject';
import { Resizable } from "re-resizable";
import { Range } from 'react-range';
import $ from 'jquery';
import shallowCompare from 'react-addons-shallow-compare';
import { CSSTransition, Transition } from 'react-transition-group';
import { uuidv4 } from './helper';
import { autoType } from 'd3';

class Cell extends React.Component {
    constructor(props) {
        super(props);

        this.state = { values: [50], sliders: null, isotype: [], mounted: false };
        this.slidersPosition = [];
        this.myRef = React.createRef();
        
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
        // console.log(JSON.parse(JSON.stringify(nextProps)), JSON.parse(JSON.stringify(this.props)))
        // console.log(this.shallowEqual(nextProps, this.props), this.props.cell)
        // console.log(this.state, nextState )
        return true
    }
    shallowEqual = (objA, objB) => {
        if (!objA || !objB) {
          return objA === objB
        }
        var fi
        return !Boolean(Object.keys(Object.assign({}, objA, objB)).find((key) => {
            console.log(objA[key] !== objB[key])
            return objA[key] !== objB[key]
        }))
      }
    componentDidMount(){

        
        this.setState({ mounted: true});
        console.log('MOUNTING ', this.props.cell)
        var that = this;
        
        // console.log(that.props)
        console.log('CREATE ', this.props.cellData)
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
                        d3.select('.'+ that.props.cellData.id).style(key, that.props.cellData.attr[key])
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
        var masks = {};
        var elementsMask = {};
        var items = DOMelement.getElementsByTagName("*");
        for (var i = items.length; i--;) {
            var item = items[i];

            //TO DEAL WITH MASKS
            if (item.tagName == 'g' && item.getAttribute("mask") != null){
                elementsMask[item.getAttribute("mask").slice(5).slice(0,-1)] = item
            }
            if (item.tagName == 'mask'){
                masks[$(item).attr('id')] = item;
            }

            // TO DEAL WITH CLASSES

            if (item.tagName != 'mask' && item.tagName != 'pattern' && item.tagName != 'image'){
                var id = $(item).attr('id')
                // console.log(id)
                if (id != undefined) id = id.replace(/ /g,"_");
                // console.log(id)
                $(item).addClass(id);
                $(item).removeAttr('id');
    
                $(item).removeAttr('filter');
            }

            if (item.tagName == 'image'){
                // console.log(item)
                var newID = 'image-'+uuidv4();
                var id = $(item).attr('id')
                for (var j = items.length; j--;) {
                    var itemNew = items[j];
                    if ($(itemNew).attr( "xlink:href" ) == '#'+ id) $(itemNew).attr( "xlink:href",  '#' + newID)
                }
                $(item).attr('id',newID);
            }


            if (item.tagName == 'pattern'){
                // console.log(item)
                var newID = 'pattern-'+uuidv4();
                var id = $(item).attr('id')
                for (var j = items.length; j--;) {
                    var itemNew = items[j];
                    if ($(itemNew).attr( "fill" ) == 'url(#'+ id + ')') $(itemNew).attr( "fill",  'url(#'+ newID + ')')
                }
                $(item).attr('id',newID);
            }
            
            // console.log(id)
            // if ($(item).hasClass("panel")){
            //     console.log('HELLO')
            // }
        }
        for (var m in masks){
            var mask = masks[m];
            if (elementsMask[m] != undefined){
                var newNameMask = m+'_'+uuidv4();
                $(mask).attr('id',newNameMask);
                $(elementsMask[m]).attr('mask','url(#'+newNameMask+')');
            }
        }
        return DOMelement;
    }
    
    loadingImage(){
        var that = this;

        var node = this.myRef.current;

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
                    // console.log(d3.select("#panel_"+ that.props.cellData.id).node(), "panel_"+ that.props.cellData.id)
                    d3.select(node).node().appendChild(DOM);

                    that.appendShadow(DOM)
    
                    if (that.props.cellData.content != undefined){
                        d3.select(node).select('svg').selectAll('*').remove();
                        $(node).addClass('noBorder');
                    }
    
                    var id = $(node).attr('id')
                    $(node).addClass(id);
                    resolve(true)
                })
            } 
            if (firstCharact != 'htt' && (extension == 'png' || extension == 'jpg')) {
                // console.log(that.props.cellData)
                // if (that.props.cellData )
                $(node).append("<img src='images/"+  that.props.cellData.url +"'/>")


                var id = $(node).attr('id')
                $(node).addClass(id);

                resolve(true)

            } 
            if (firstCharact == 'htt' && extension == 'svg') {
                
                d3.svg(that.props.cellData.url).then(function(xml) {
                    // var width = d3.select(xml.documentElement).attr('width')
                    // var height = d3.select(xml.documentElement).attr('height')
                    // console.log(that.props.cellData.url)
                    var DOM = that.replaceClass(xml.documentElement.cloneNode(true))
                    d3.select(node).node().appendChild(DOM);

                    that.appendShadow(DOM)
    
                    if (that.props.cellData.content != undefined){
                        d3.select(node).select('svg').selectAll('*').remove();
                        $(node).addClass('noBorder');
                    }
    
                    var id = $(node).attr('id')
                    $(node).addClass(id);

                    // console.log('GOOOOO')
                    resolve(true)
                })
            }
            if (firstCharact == 'htt' && (extension == 'png' || extension == 'jpg')) {
                // console.log(that.props.cellData)
                var width = null
                if (that.props.cellData.width == undefined) width = 'auto'
                else width = that.props.cellData.width + 'px'
                $(node).append("<img width='"+width+"' src='"+  that.props.cellData.url +"'/>")


                var id = $(node).attr('id')
                $(node).addClass(id);

                resolve(true)

            } 
        })
    }
    appendShadow(DOM){
        var that = this;
        // (IsItMuted === true) ? 'On' : 'Off';
        if (this.props.showInteraction != undefined && this.props.showInteraction != false){
            console.log(d3.color(this.props.showInteraction))
            var R = (d3.color(this.props.showInteraction).r /255 != Infinity) ? d3.color(this.props.showInteraction).r/255: 0;
            var G = (d3.color(this.props.showInteraction).g /255 != Infinity) ? d3.color(this.props.showInteraction).g/255: 0;
            var B = (d3.color(this.props.showInteraction).b /255 != Infinity) ? d3.color(this.props.showInteraction).b/255: 0;

            console.log(R, G, B)
            $(DOM).append(that.parseSVG(`
            <defs>
                <filter id="dropshadowCustom" width="130%" height="130%">
                <feOffset result="offOut" in="SourceGraphic" dx="5" dy="5"></feOffset>
                <feColorMatrix result="matrixOut" in="offOut" type="matrix"
                values="0 0 0 0 `+R+`
                        0 0 0 0 `+G+`
                        0 0 0 0 `+B+`
                        0 0 0 1 0" />
                <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="2"></feGaussianBlur>
                <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>
            </filter>
        </defs>
        `)
            
            );
        }
        
    }
    parseSVG(s) {
        var div= document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
        div.innerHTML= '<svg xmlns="http://www.w3.org/2000/svg">'+s+'</svg>';
        var frag= document.createDocumentFragment();
        while (div.firstChild.firstChild)
            frag.appendChild(div.firstChild.firstChild);
        return frag;
    }
    render() {
        var that = this;
        let svg;
        let sliders;
        // let isotype;

        // console.log(this.props.cell)
        // IF NOTHING ELSE
        if (!Array.isArray(this.props.cell)) {
            // svg = <svg id={"svg_"+ this.props.cellData.id} style={{float: 'left'}}></svg>
            //<img src={"images/"+ this.props.cellData.url} />
  
        } else {
            // var height = 100/this.props.cell.length;
            svg = this.props.cell.map((cell, index) => {
                
                return ( 
                    <Cell 
                        // h={height} 
                        // w={'100%'} 
                        cell={cell} 
                        cellData={this.props.cellData[index]} 
                        key={cell}
                        variables={this.props.variables}
                        debug={this.props.debug}
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
        // console.log(this.props.debug)
          return(
            <CSSTransition in={this.state.mounted} timeout={500} classNames="my-node" >
                <div> 
                    <div className="panel" id={this.props.cell} style={{...defaultStyle}} ref={this.myRef}>
                        {svg}
                        {sliders}
                        
                        { (this.props.debug != undefined && this.props.debug == true) ?
                            <div style={{position: 'absolute', fontSize: '60px', fontWeight: '900'}}> ID: {this.props.cell} </div> : (null)
                        }
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

import _ from 'underscore'
import * as d3 from 'd3';
import { useThumbOverlap } from 'react-range';
import { select } from 'd3';
import $ from 'jquery';

export class Slider { 
    constructor(appContext, state) { 
        this.state = JSON.parse(JSON.stringify(state));
        this.stateApp = appContext;
    } 
    setVariables(appContext, state){
        this.state = JSON.parse(JSON.stringify(state));
        this.stateApp = appContext;
    }
    init(){
        
        
        var panelSliders = this.stateApp.state.panels.filter((d) => d.sliders != undefined);
        console.log(panelSliders)
        for (var index in panelSliders){
            var panel = panelSliders[index];
            var idPanel = panel['id'];
            // console.log(panel)
            for (var indexSliders in panel['sliders']){
                var slider = panel['sliders'][indexSliders];
                
                // console.log(slider);
                var idSlider = slider['id'];
                if ($("."+ slider['id']).length) this.appendSlider(idPanel, idSlider, slider);
            }
           
        }
        // console.log(panelSliders);
    }
    appendSlider(idPanel, idSlider, slider){
        console.log(idPanel, idSlider, slider);
        var that = this;
        var selection = d3.select('#panel_'+ idPanel).select('svg')//;
        console.log(selection)
        var BBox = selection.select('.'+idSlider).node().getBBox();
        // console.log(BBox)
        // this.slider(selection, BBox, slider);

        var parent = selection.append('g').attr('class', 'slider')
                .attr('transform', 'translate('+ BBox.x + ',' + BBox.y + ')')
        var fO = parent.append('foreignObject')
                .attr('width', BBox.width)
                .attr('height', BBox.height)

        var id = this.uuidv4();
                // .attr('y', '10')

        fO.append("xhtml:body")
        .html(`<div class="slidecontainer">
                <input type="range" min="1" max="10" value="2" class="slider" id="`+id+`" step="1">
            </div>`)
            $("#"+id).off("input change mouseup")

            // console.log(id)
            $("#"+id).on("input",(e)=>{
                // console.log('MOVE')
                // console.log(e.target.value)
                that.stateApp.updateVariable(slider.variable, e.target.value, false);
                // document.getElementById("label").value = `${e.target.value}`;
            
            });
            $("#"+id).on("mouseup",(e)=>{
                // console.log("UP")
                that.stateApp.updateVariable(slider.variable, e.target.value, true);
                // document.getElementById("label").value = `${e.target.value}`;
            
            });


    //   .append('div')
    //         .attr('class', 'slidecontainer')
    //     .append('input')
    //         .attr('type').attr('type', 'range')
    //         .attr('class', 'slider')
    //         .attr('min', '1')
    //         .attr('max', '100')
{/* <div class="slidecontainer">
  <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
</div> */}
    }
    uuidv4() {
        var date = new Date();
        var components = [
            date.getYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        ];

        var id = parseInt(components.join(""));
        // return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        //   var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        //   return v.toString(16);
        // });
        return id;
    }
}
    // slider (selection, BBox, slider) {
    //     var that = this;
    //     console.log(BBox)
    //     var width = BBox.width,
    //         value = 0.5, /* Domain assumes to be [0 - 1] */
    //         event,
    //         x = 0,
    //         y = 0;
    //     var lastValue = 0;
    //     var sliderValue= 0

    //     var parent = selection.append('g').attr('class', 'slider')
    //     .attr('transform', 'translate('+ BBox.x + ',' + BBox.y + ')')

    //     //Line to represent the current value
    //     var valueLine = parent.append("line")
    //         .attr("x1", x)
    //         .attr("x2", x + (width * value))
    //         .attr("y1", y)
    //         .attr("y2", y)
    //         .style('stroke', "black")
    //         .style('stroke-linecap', "round")
    //         .style('stroke-width', 8)

    //     //Line to show the remaining value
    //     var emptyLine = parent.append("line")
    //         .attr("x1", x + (width * value))
    //         .attr("x2", x + width)
    //         .attr("y1", y)
    //         .attr("y2", y)
    //         .style("stroke", "#ECECEC")
    //         .style("stroke-linecap", "round")
    //         .style("stroke-width", 8)

    //         // parent.append("circle")
    //         // .attr('cx', 0)
    //         // .attr('cy', 0)
    //         // .attr('r', 10)
    //         // .attr('fill', 'red')
            

    //     var drag = d3.drag().on("drag", function() {
    //             var newX = d3.mouse(this)[0];

                
    //             if (newX < x)
    //                 newX = x;
    //             else if (newX > x + width)
    //                 newX = x + width;

    //             value = (newX - x) / width;

    //             console.log(Math.abs(lastValue - value))
    //             if (Math.abs(lastValue - value) > 0.1){
    //                 value = lastValue + 0.1
    //                 lastValue = value;


                    
    //                 valueCircle.attr("cx", newX);
    //                 valueLine.attr("x2", x + (width * value));
    //                 emptyLine.attr("x1", x + (width * value));

    //                 if (event)
    //                     event();

    //                 d3.event.sourceEvent.stopPropagation();

    //                 // UPDATE THE STATE WITH THE NEW VARIABLE VALUE
    //                 that.stateApp.updateVariable(slider.variable, value, false);
    //             }
                
    //             // that.stateApp.state.variables[slider.variable] = value;
    //         })
    //         .on("end", function() {
    //             that.stateApp.updateVariable(slider.variable, value, true);
    //         })

    //         //Draggable circle to represent the current value
    //         var valueCircle = parent.append("circle")
    //             .attr("cx", x + (width * value))
    //             .attr("cy", y)
    //             .attr("r", 20)

    //             .style("stroke", "black")
    //             .style("stroke-width", 1.0)
    //             .style("fill", "white")
                
    //             .call(drag);
        
    // }
    // computeValue() {
        
        
    // }
// }  


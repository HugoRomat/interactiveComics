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
    update(){
        // console.log('UPDATE SALIDERS VALUE')
        $(".sliderInputCustom").each(function() {
            var value = $(this).trigger("input");
            // console.log(value)
            // $(this).val(value+1)
        });
        // $("#slide").val(parseInt($("#slide").val())+30);  
    }
    init(){
        
        /**** SLIDERS */
        var panelSliders = this.stateApp.state.panels.filter((d) => d.sliders != undefined);
        // console.log(panelSliders)
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



        /***** INPUT *******/
        var panelInput = this.stateApp.state.panels.filter((d) => d.input != undefined);
        // console.log(panelSliders)
        for (var index in panelInput){
            var panel = panelInput[index];
            var idPanel = panel['id'];
            console.log(idPanel)
            for (var indexInput in panel['input']){
                var input = panel['input'][indexInput];
                
                // console.log(slider);
                var idInput = input['id'];
                // console.log(input, idInput)
                if ($("."+ input['id']).length) this.appendInput(idPanel, idInput, input);
            }
        }




        // console.log(panelSliders);
    }
    appendInput(idPanel, idInput, input){
        console.log(idPanel, idInput, input);

        var that = this;
        var selection = d3.select('#'+ idPanel).select('svg')//;
        var BBox = selection.select('.'+idInput).node().getBBox();

        var parent = selection.append('g').attr('class', 'slider')
                .attr('transform', 'translate('+ BBox.x + ',' + BBox.y + ')')
        var fO = parent.append('foreignObject')
                .attr('width', BBox.width)
                .attr('height', BBox.height)

        var id = this.uuidv4();

        fO.append("xhtml:body")
        .html(`<div class="slidecontainer">
                <input type="text" id="`+id+`" name="name" minlength="4" maxlength="10" size="10">
            </div>`)
            $("#"+id).off("input change mouseup")

            // console.log(id)
            $("#"+id).on("input",(e)=>{
                
                // if (e.target.value)
                var value = parseInt(e.target.value);
                if (Number.isNaN(value)) value=0
                
                that.stateApp.updateVariable(input.variable, value, false);
            
            });
            // $("#"+id).on("mouseup",(e)=>{
            //     that.stateApp.updateVariable(input.variable, e.target.value, true);
            // });



    }
    appendSlider(idPanel, idSlider, slider){
        console.log(idPanel, idSlider, slider);
        var that = this;
        var selection = d3.select('#'+ idPanel).select('svg')//;
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

        var min = (slider.min) ? slider.min : 0;
        var max = (slider.max) ? slider.max : 10;
        var initValue = min;

        fO.append("xhtml:body")
        .html(`<div class="slidecontainer">
                <input type="range" min="`+min+`" max="`+max+`" value="`+initValue+`" class="sliderInputCustom" id="`+id+`" step="1">
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

import _ from 'underscore'
import * as d3 from 'd3';
import { useThumbOverlap } from 'react-range';
import { select } from 'd3';
import $ from 'jquery';

export class EventsPanels { 
    constructor(appTontext, state) { 
        this.state = JSON.parse(JSON.stringify(state));
        this.stateApp = appTontext;
        this.objectsAttributes = {}
       
    } 
    //Group operations
    init(){
        var objectGrouped = _.groupBy(this.state.operations, "element");
        var keys = Object.keys(objectGrouped)

        // grouped by panel trigerring and panel
        for (var i in keys){
            var idPanel = keys[i]
            var operationPanelById = objectGrouped[idPanel];
            var operationTrigger = _.groupBy(operationPanelById, "trigger");
            var keys2 = Object.keys(operationTrigger)
            for (var j in keys2){
                var trigger = keys2[j];
                this.setEvents(idPanel, trigger, operationTrigger[trigger])
            }
        }
    }
    setEvents(idPanel, trigger, event){
        console.log(idPanel, trigger, event);
        var that = this;
        var idSelector = null;
        // IF CLASS OR ID
        // if (idPanel[0] == '.') idSelector = d3.selectAll(".hand")
        idSelector = d3.select('.'+ idPanel)

        

        // console.log(idSelector, idPanel)
        idSelector.on(trigger, function(d, i){
            // console.log('clicl')
            var isTriggered = d3.select(this).attr('isTriggered')
            if (isTriggered == 'false'){
                that.populateEvent(event, idSelector);
               
                
                d3.select(this).attr('isTriggered', 'true')
            }
            
        })
        .attr('isTriggered', 'false')


        // console.log(trigger, event.operation)
        if (trigger == 'mouseover' ){
            idSelector.on('mouseout', function(d, i){
                // that.getToInitial();
                var isTriggered = d3.select(this).attr('isTriggered')
                if (isTriggered == 'true'){
                    that.populateEvent(event, idSelector, true);
                    d3.select(this).attr('isTriggered', 'false')
                }
            })
        }
    }
    populateEvent(events, idSelector, reverse){

        for (var i in events){
            var event = events[i];
            if (event.operation == 'append'){
                var where = event['after'];
                var what = event['newpanels'];
                var isFlex = event['flexwrap'];
                this.append(where, what, isFlex)
            } else if (event.operation == 'replace'){
                var where = event['after'];
                var what = event['newpanels'];
                var isFlex = event['flexwrap'];
                this.replace(where, what, isFlex)
            } else if (event.operation == 'highlight' && reverse == undefined){
                var element = event['element'];
                var after = event['after'];
                var what = event['what']
                // console.log(what)
                var selector = d3.selectAll('.'+what)
                this.highlight(element, after, selector)
            }

            if (event.operation == 'highlight' && reverse == true){
                // console.log('GO')
                var element = event['element'];
                var after = event['after'];
                var what = event['what']
                var selector = d3.selectAll('.'+what)
                this.unhighlight(element, after, selector)
            }
           
        }

    }
    unhighlight(element, after, idSelector){
        // console.log(this.objectsAttributes)
        var nodes = idSelector.nodes();
        for (var k in nodes){
            var nodeInterface = nodes[k];
            // console.log(this.objectsAttributes[element])
            
            var childNodesInterface = nodeInterface.getElementsByTagName("*");
            var items = this.objectsAttributes[element][k].getElementsByTagName("*");
            // console.log(childNodesInterface, items)
            for (var i = items.length; i--;) {
                var itemWithoutCSS = items[i];
                var itemInterface = childNodesInterface[i];
                // console.log($(itemWithoutCSS).attr('style'))
                // console.log($(itemInterface).attr('style'))
                itemInterface.style.cssText = $(itemWithoutCSS).attr('style')
            }
            nodeInterface.style.cssText = $(this.objectsAttributes[element][k]).attr('style')
        }
        this.objectsAttributes[element] = []
    
    }
    highlight(element, after, idSelector){
        console.log('HIGHLIGHT')

        // if ()
        var elementDOM = idSelector.nodes();

        for (var i in elementDOM){
            var cloned = elementDOM[i].cloneNode(true);
            $(cloned).attr('class', '');
            if (this.objectsAttributes[element] == undefined) this.objectsAttributes[element] = []
            this.objectsAttributes[element].push(cloned)
            
        }
        for (var key in after.style){
            idSelector.selectAll('*').style(key, after.style[key])
        }
        //.cloneNode(true);
        // console.log(elementDOM)
        // REMOVE CLASS OF THE FICTIVE ELEMENT 
        

    }
    replace(where, what, isFlex){
        // console.log('replace')
        var where = parseInt(where.split('_')[1])
        var what = this.splitArray(what);
        console.log(where, what);
        
        var indexes = []
        var arrayArrangement = this.state.layout.arrangment;
        for (var i= 0; i <  arrayArrangement.length; i++){
            for (var j= 0; j <  arrayArrangement[i].length; j++){
                    if (arrayArrangement[i][j] == where){indexes.push([i,j])}
            } 
        }

        if (isFlex == false){
            arrayArrangement[indexes[0][0]].splice(indexes[0][1], 1, ...what);
            this.stateApp.setState({layout: this.state.layout})
        } 
    }
    // append(where, what, isFlex){
    // SPlit and parse multidimensionnal array
    splitArray(data){
        console.log(data)
        var newData = data.map((d) => {
            // if (d.length != undefined)
            if (Array.isArray(d)){
                return d.map((e) => parseInt(e.split('_')[1]))
            } else {
                return parseInt(d.split('_')[1])
            }
        })
        return newData
    }
    append(where, what, isFlex){
        
        console.log(where, what);
        var where = parseInt(where.split('_')[1])
        var what = this.splitArray(what);
        // console.log(event);
        
        var indexes = []
        var arrayArrangement = this.state.layout.arrangment;
        for (var i= 0; i <  arrayArrangement.length; i++){
            for (var j= 0; j <  arrayArrangement[i].length; j++){
                    if (arrayArrangement[i][j] == where){indexes.push([i,j])}
            } 
        }

        if (isFlex == false){
            arrayArrangement[indexes[0][0]].splice(indexes[0][1]+1, 0, ...what);
            this.stateApp.setState({layout: this.state.layout})
        } 
        //EVERYTNIGN THAT IS BEFORE null and new line
        else {
            
            // arrayArrangement[indexes[0][0]].splice(0, 0, []);
            // console.log(indexes)
            // ADD LINE
            arrayArrangement.splice(indexes[0][0] + 1, 0, []);

            // DELETE 
            var elementsDeleted = arrayArrangement[indexes[0][0]].splice(indexes[0][1] + 1, arrayArrangement[indexes[0][0]].length - indexes[0][1] +1);

            // TO PERFORM THE OFFSET
            var myArrayToAppend = []
            for (var i = 0; i < indexes[0][1] +1; i++){
                // console.log('HELLO')
                var cell = JSON.parse(JSON.stringify(this.stateApp.state.panels.find((d) => d['id'] == arrayArrangement[indexes[0][0]][i])))
                cell.id = this.uuidv4();
                cell.content = 'remove';
                this.stateApp.addCell(cell)

                myArrayToAppend.push(cell.id)
            }
            myArrayToAppend = myArrayToAppend.concat(elementsDeleted)
            // TO APPEND
            arrayArrangement[indexes[0][0] + 1] = arrayArrangement[indexes[0][0] + 1].concat(myArrayToAppend);
        
            // ADD ELEMENT
            arrayArrangement[indexes[0][0]].splice(indexes[0][1]+1, 0, ...what);
            // 

            // console.log(arrayArrangement)

            this.stateApp.setState({layout: this.state.layout});

            //Left element on new line
        }
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


















    setEvents2(){
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


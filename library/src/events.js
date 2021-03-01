import _ from 'underscore'
import * as d3 from 'd3';
import { useThumbOverlap } from 'react-range';
import { select } from 'd3';
import $ from 'jquery';

export class EventsPanels { 
    constructor(appTontext, state){
        this.state = JSON.parse(JSON.stringify(state));
        this.stateApp = appTontext;
        this.objectsAttributes = {}

        
       this.layout = this.state.layout.find(x => x.name == this.state.currentLayout)

    } 
    setVariables(appTontext, state){
        console.log('GOOOOO')
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
                // console.log(trigger)
                // if (trigger == "condition") this.setEventsCondition(operationTrigger[trigger])
                if (trigger != 'undefined') this.setEvents(idPanel, trigger, operationTrigger[trigger])
            }
        }
    }
    setCondition(){
        var conditions = this.state.operations.filter((d)=> d.trigger == 'condition');
        this.setEventsCondition(conditions);
        // console.log(conditions)
    }
    setEventsCondition(conditions){
        // console.log(conditions);
        for (var i in conditions){
            var mathematicalFunction = "";
            var condition = conditions[i];
            for (var j in condition['condition']){
                var item = condition['condition'][j];
                // console.log(item, j)
                var myIndex = this.stateApp.state.variables.findIndex(x => x.name == item);
                // // console.log(item, this.state.variables[item], this.state.variables)
                if (myIndex == -1){
                    mathematicalFunction += item
                } else {
                    mathematicalFunction += this.stateApp.state.variables[myIndex]['value'];
                }
            }
            var isSatisfied = eval(mathematicalFunction);
            
            if (isSatisfied){
                if (condition.operation == "append") {
                    var arePresent = this.arePresent(condition.newpanels);
                    if (arePresent == false) this.append(condition.after,condition.newpanels, false);
                }
                else if (condition.operation == "remove") {
                    var arePresent = this.arePresent(condition.panel);
                    // console.log(arePresent)
                    if (arePresent == true) this.remove(condition.panel, false);
                }
            }
            // console.log(isSatisfied)
            // console.log(eval(mathematicalFunction))
        }
        // console.log(eval(mathematicalFunction))
        
    //    variable.value = eval(mathematicalFunction)
    }
    arePresent(panels){
        var mypanels = panels.flat(100);
        // var areThere = []
        // console.log(mypanels)
        for (var i in mypanels){
            var panel = mypanels[i];
            // console.log(panel, $("#" + panel).get(0))
            if (!$("#" + panel).get(0)) return false
        }
        return true;
    }
    setEvents(idPanel, trigger, event){
        console.log(idPanel, trigger, event);
        var that = this;
        var idSelector = null;
        // IF CLASS OR ID
        // if (idPanel[0] == '.') idSelector = d3.selectAll(".hand")
        idSelector = d3.select('.'+ idPanel)

        idSelector.style('cursor', 'pointer')

        
        if (trigger == "click"){
            // console.log(idSelector, idPanel)
            idSelector.on(trigger, function(d, i){
                // console.log('clicl')
                var isTriggered = d3.select(this).attr('isTriggered')
                if (isTriggered == 'false'){
                    d3.select(this).attr('isTriggered', 'true')
                    that.populateEvent(event, idSelector);
                }
                
            })
            .attr('isTriggered', 'false')
        }
        
        if (trigger == "zoom"){

            // for (var i in event){
            //     var myevent = event[i];
            //     console.log(myevent)
            // }
            // console.log()
            var myEvent = event[0]
            console.log(myEvent)
            idSelector.call(d3.zoom().on("zoom", function () {

                for (var i in myEvent['linked']){
                    var idPanel = myEvent['linked'][i]
                    d3.select('.'+idPanel).select('svg').attr("transform", d3.event.transform)
                }
                idSelector.select('svg').attr("transform", d3.event.transform)
               
            }))


        }



        // console.log(trigger, event.operation)
        if (trigger == 'mouseover'){
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
        // console.log(events)
        for (var i in events){
            var event = events[i];

            console.log(event)
            var isSatisfied = true;
            if (event.condition != undefined){
                var mathematicalFunction = "";
                var condition = event.condition;
                for (var j in condition){
                    var item = condition[j];
                    var myIndex = this.stateApp.state.variables.findIndex(x => x.name == item);
                    if (myIndex == -1){
                        mathematicalFunction += item
                    } else {
                        mathematicalFunction += this.stateApp.state.variables[myIndex]['value'];
                    }
                }
                console.log(mathematicalFunction)
                isSatisfied = eval(mathematicalFunction);
                if (!isSatisfied) idSelector.attr('isTriggered', 'false')
            }
            
            if (event.operation == 'append' && isSatisfied){
                var where = event['after'];
                var what = event['newpanels'];
                var isFlex = event['flexwrap'];
                var newline = event['newline'];
                // var condition = event['newline'];
                this.append(where, what)//, isFlex, newline)
            } else if (event.operation == 'replace' && isSatisfied){

                // console.log('REPALCE')
                var where = event['after'];
                var what = event['newpanels'];
                var isFlex = event['flexwrap'];
                this.replace(where, what, isFlex)
            } else if (event.operation == 'highlight' && reverse == undefined && isSatisfied){
                var element = event['element'];
                var after = event['after'];
                var what = event['what']
                // console.log(what)
                var selector = d3.selectAll('.'+what)
                this.highlight(element, after, selector)
            }
            if (event.operation == 'highlight' && reverse == true && isSatisfied){
                // console.log('GO')
                var element = event['element'];
                var after = event['after'];
                var what = event['what']
                var selector = d3.selectAll('.'+what)
                this.unhighlight(element, after, selector)
            }

            if (event.operation == 'loadLayout' && isSatisfied){
                // console.log('GO')
                var element = event['element'];
                var layout = event['layout'];
                this.loadLayout(element, layout)
            }
            if (event.operation == 'zoom' && isSatisfied){
                var element = event['element'];
                var linked = event['linked'];
                this.zoom(element, linked)
            }
           
        }

    }
    zoom(element, layout){
        console.log(element, layout)

    }
    loadLayout(element, layout){

        // this.stateApp.setState({currentLayout: []});
        this.stateApp.setState({currentLayout: layout});

        // console.log(this.stateApp.state.layout)
        this.stateApp.reloadEvents();

        // console.log(element, layout)
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
        // console.log('HIGHLIGHT')

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
        
        var indexes = [];
        var arrayArrangement = this.layout.panels;
        for (var i= 0; i <  arrayArrangement.length; i++){
            for (var j= 0; j <  arrayArrangement[i].length; j++){
                    if (arrayArrangement[i][j] == where){indexes.push([i,j])}
            } 
        }

        // if (isFlex == false){
            arrayArrangement[indexes[0][0]].splice(indexes[0][1], 1, ...what);
            this.stateApp.setState({layout: this.state.layout})
        // } 
    }
    remove(items, isFlex){
        console.log("====== REMOVE")
        var itemsToRemove = this.splitArray(items);
        itemsToRemove = itemsToRemove.flat(100);
        var allIndexes = []
        // console.log(itemsToRemove)
        for (var e in itemsToRemove){
            var where = itemsToRemove[e]
            var indexes = []
            var arrayArrangement = this.layout.panels;
            for (var i = arrayArrangement.length-1; i >= 0; i--){
                // console.log(arrayArrangement[i])
                for (var j = arrayArrangement[i].length-1; j >= 0; j--){
                    if (Array.isArray(arrayArrangement[i][j])){
                        // console.log(arrayArrangement[i][j], where, arrayArrangement[i][j].indexOf(where))
                        if (arrayArrangement[i][j].indexOf(where) > -1){
                            indexes = [i,j, arrayArrangement[i][j].indexOf(where)]
                            // console.log('inline', indexes)
                        }
                    }
                    else if (arrayArrangement[i][j] == where){
                        indexes= [i,j]
                    }
                } 
            }
            allIndexes.push(indexes);
            // console.log(indexes)
        }

        // TO SORT THE ARRAY BY INDEX
        allIndexes.sort(function(a, b) {
            return a[2] - b[2] || a[1] - b[1] || a[0] - b[0];
        });

        // // NOW ITERATE TO REMOVE
        for (var i = allIndexes.length-1; i >= 0; i--){
            var allIndex = allIndexes[i]
            if (allIndex.length == 3) arrayArrangement[allIndex[0]][allIndex[1]].splice(allIndex[2]);
            else arrayArrangement[allIndex[0]].splice(allIndex[1], 1);
            
        }
      
        // // REMOVE IF EMPTY PANEL
        for (var i = arrayArrangement.length-1; i >= 0; i--){
            for (var j = arrayArrangement[i].length-1; j >= 0; j--){
                if (arrayArrangement[i][j].length == 0) arrayArrangement[i].splice(j, 1);
            }
        }
        // console.log(arrayArrangement)
        this.stateApp.setState({layout: this.state.layout})
    }
    // append(where, what, isFlex){
    // SPlit and parse multidimensionnal array
    splitArray(data){
        // console.log(data)
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
        
        console.log(where, what, isFlex);
        var myNewLine = [];
        var lineToAvoid = []

        //TO RETRIVE THE NEW LINE
        for (var i = what.length-1; i >= 0; i--){
           
            if (Array.isArray(what[i])){
                // console.log(what[i])
                for (var j = what[i].length-1; j >= 0; j--){
                    // console.log(what[i][j])
                    if (lineToAvoid.indexOf(i) == -1 && Array.isArray(what[i][j])){
                        // console.log('GO')
                        // console.log(what[i] + 'is multi array'+ i)
                        myNewLine.push(what.splice(i, 1));
                        lineToAvoid.push(i);
                    }
                }
            } 
        }

        console.log(what)
        var where = parseInt(where.split('_')[1])
        var what = this.splitArray(what);
        console.log(where, what);
        // console.log(event);
        
        // indexes of the from array
        var indexes = []
        var arrayArrangement = this.layout.panels;
        for (var i= 0; i <  arrayArrangement.length; i++){
            for (var j= 0; j <  arrayArrangement[i].length; j++){
                if (Array.isArray(arrayArrangement[i][j])){
                    if (arrayArrangement[i][j].indexOf(where) > -1){
                        indexes.push([i,j])
                    }
                }
                else if (arrayArrangement[i][j] == where){
                    indexes.push([i,j])
                }
            } 
        }
        if (indexes.length == 0) console.log('no INDEXES FOUND')


        if (isFlex == undefined){
            arrayArrangement[indexes[0][0]].splice(indexes[0][1]+1, 0, ...what);

            // IF THERE IS A NEW LINE MENTIONNED
            if (myNewLine.length > 0){
                console.log(myNewLine)
                for (var i = myNewLine.length-1; i >= 0; i--){
                    var element = this.splitArray(myNewLine[i][0]);
                    // arrayArrangement.concat(element);
                    arrayArrangement = [...arrayArrangement, element] 
                    // console.log(element)
                }
                
                // arrayArrangement = arrayArrangement.concat(myArrayToAppend);
            }
            // console.log(arrayArrangement, this.state.layout)
            this.layout.panels = arrayArrangement


            this.stateApp.setState({layout: this.state.layout})



        } 
        //EVERYTNIGN THAT IS BEFORE null and new line
        /*else {
            
            // arrayArrangement[indexes[0][0]].splice(0, 0, []);
            console.log(indexes)
            console.log(arrayArrangement)
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
            arrayArrangement[indexes[0][0] + 1].splice(indexes[0][1]+1, 0, ...what);
            // 

            console.log(arrayArrangement)

            this.stateApp.setState({layout: this.state.layout});

            //Left element on new line
        }*/
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


import _ from 'underscore'
import * as d3 from 'd3';
import { useThumbOverlap } from 'react-range';
import { select } from 'd3';
import $ from 'jquery';
import update from 'immutability-helper';
import { uuidv4 } from './helper';

export class EventsPanels { 
    constructor(appTontext, state){
        this.state = JSON.parse(JSON.stringify(state));
        this.stateApp = appTontext;
        this.objectsAttributes = {}

        console.log(this.state)
       this.layout = this.state.layouts.find(x => x.name == this.state.currentLayout)
       console.log(this.layout)

    } 
    setVariables(appTontext, state){
        console.log('GOOOOO')
        this.state = JSON.parse(JSON.stringify(state));
        this.stateApp = appTontext;
        this.objectsAttributes = {}

        
    }
    appendEventsToPanels(what){
        var arrayFlettened = what.flat(10);
        // console.log(arrayFlettened)
        for (var i in arrayFlettened){
            var element = arrayFlettened[i]
            // console.log(element)
            this.init(element)
        }
        // console.log(arrayFlettened)
    }
    // Group operations
    // parent to init only in one panel
    init(parent){
        // console.log('FO')
        //groupByElement
        var i = 0
        for (var operation in this.state.operations){
            var ope = this.state.operations[operation];
            // console.log(ope)
            if (Array.isArray(ope.element)){
            // if (ope.element.length > 1){
                i =0
                var groupName = uuidv4() 
                for (var element in ope.element){
                    var el = ope.element[element];
                    // console.log(el)
                    if (element == ope.element.length-1){
                        var json = ope;
                        json.element = el;
                        json.layer = ope.layer[i];
                        json.group = groupName
                    } else {
                        var json = JSON.parse(JSON.stringify(ope));
                        console.log(json)
                        json.element = el;
                        json.layer = ope.layer[i]
                        json.group = groupName
                        this.state.operations.push(json)
                    }
                    i++
                    
                }
            }
            
        }
        // console.log(this.state.operations)
        var objectGrouped = _.groupBy(this.state.operations, "element");
        var keys = Object.keys(objectGrouped)


        
        console.log(this.state.operations)
        // grouped by panel trigerring and panel
        for (var i in keys){
            var idPanel = keys[i];

            
            
            // if (this.isNumeric(idPanel)) idPanel='panel_'+idPanel
           
            // console.log(idPanel)
            var operationPanelById = objectGrouped[idPanel];
            var operationTrigger = _.groupBy(operationPanelById, "trigger");
            var keys2 = Object.keys(operationTrigger)
            for (var j in keys2){
                var trigger = keys2[j];
                // console.log(operationTrigger[trigger])
                // if (trigger == "condition") this.setEventsCondition(operationTrigger[trigger])
                // console.log(idPanel, trigger, operationTrigger[trigger])
                if (trigger != 'undefined') this.setEvents(idPanel, trigger, operationTrigger[trigger], parent)

                // console.log(operationTrigger[trigger])
            }
        }
    }
    isNumeric(str) {
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
               !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
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
    setEvents(idPanel, trigger, event, parent){
        console.log(idPanel, trigger, event, parent);
        var that = this;
        var idSelector = null;
        // IF CLASS OR ID
        // if (idPanel[0] == '.') idSelector = d3.selectAll(".hand")

        // If there is a prent or not
        // To constrain the selection

        // IF THE PANEL HAS BEEN RELOADED
        if (parent == undefined ) idSelector = d3.selectAll('.'+ idPanel)
        else if (idPanel == parent) idSelector = d3.select('.'+ idPanel)
        else idSelector = d3.select('.'+parent).selectAll('.'+ idPanel)


        // idSelector.style('filter', 'url(#shadowSuggestInteractivity)')
        // idSelector.attr('filter', "url(#dropshadow)")
        // filter="url(#filter1)"
        // var sentence = '.'+parent + ' .'+ idPanel
        // console.log(idSelector, parent, idPanel)
        // console.log($('.'+parent + ' .'+ idPanel).get()[0])
        // console.log($('.panel_3 .compare').get()[0])
        idSelector.style('cursor', 'pointer')
        idSelector.attr('isTriggered', 'false')
        
        if (trigger == "click"){
            // console.log(idSelector.node(), trigger)
            idSelector.on(trigger, function(d, i){
                // console.log('CLICK')
                var isTriggered = d3.select(this).attr('isTriggered')
                console.log(isTriggered)
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
            // console.log(idSelector.nodes())
            // console.log(idPanel)

            idSelector.call(d3.zoom().on("zoom", function () {
                for (var i in myEvent['linked']){
                    var idPanel = myEvent['linked'][i]
                    var tagName = d3.select('.'+idPanel).node().tagName;
                    if (tagName == 'DIV') d3.select('.'+idPanel).select('svg').attr("transform", d3.event.transform)
                    else d3.select('.'+idPanel).attr("transform", d3.event.transform)
                }
            }))


        }



        // Pour gerer le mouseover
        // 
        if (trigger == 'mouseover'){
            idSelector.attr('isTriggered' + trigger, 'false')

            idSelector.on('mouseenter', function(d, i){
                var isTriggered = d3.select(this).attr('isTriggered' + trigger)
                // console.log('goooo', isTriggered)
                if (isTriggered == 'false'){
                    that.populateEvent(event, idSelector, false);
                    d3.select(this).attr('isTriggered' + trigger, 'true')
                } 
            })
            idSelector.on('mouseout', function(d, i){
                // console.log(idPanel, trigger, event, parent);
                var isTriggered = d3.select(this).attr('isTriggered' + trigger)
                if (isTriggered == 'true'){
                    that.populateEvent(event, idSelector, true);
                    d3.select(this).attr('isTriggered' + trigger, 'false')
                }
            })
        }
    }
    populateEvent(events, idSelector, reverse){
        // console.log(events)
        for (var i in events){
            var event = events[i];

            // console.log(event)
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
                // console.log(mathematicalFunction)
                isSatisfied = eval(mathematicalFunction);
                if (!isSatisfied) idSelector.attr('isTriggered', 'false')
            }
            
            if (event.operation == 'append' && isSatisfied){
                var where = event['after'];
                var what = event['newpanels'];
                // var isFlex = event['flexwrap'];
                // var newline = event['newline'];
                // var condition = event['newline'];
                console.log(what,where);
                this.append(where, JSON.parse(JSON.stringify(what)));//, isFlex, newline)
                setTimeout(()=>{
                    this.appendEventsToPanels(what);
                }, 500)
            } else if (event.operation == 'replace' && isSatisfied){

                // console.log('REPALCE')
                var replace = event['replace'];
                var newpanels = event['newpanels'];
                var isFlex = event['flexwrap'];
                // console.log(event)
                this.replace(replace, JSON.parse(JSON.stringify(newpanels)), isFlex)


                setTimeout(()=>{
                    this.appendEventsToPanels(newpanels);
                }, 500)


            } else if (event.operation == 'highlight' && reverse == false && isSatisfied){
                var element = event['element'];
                var after = event['after'];
                var what = event['what']
                // console.log('highlight')
                if (what == undefined) var selector = d3.selectAll('.'+element)
                else var selector = d3.selectAll('.'+what)
                this.highlight(element, after, selector)
            }
            if (event.operation == 'highlight' && reverse == true && isSatisfied){
                // console.log('GO')
                var element = event['element'];
                var after = event['after'];
                var what = event['what']

                if (what == undefined) var selector = d3.selectAll('.'+element)
                else var selector = d3.selectAll('.'+what)
                // console.log('non highlight')
                
                this.unhighlight(element, after, selector)
            }

            if (event.operation == 'loadLayout' && isSatisfied && (reverse == false || reverse == undefined)){
                // console.log('GO')
                var element = event['element'];
                var layout = event['layout'];
                var where = event['after'];
                var group = event['group']
                // if (where == undefined) where = element

                // console.log(where)
                this.loadLayout(element, layout, where, group);
                setTimeout(()=>{
                    this.appendEventsToPanels(JSON.parse(JSON.stringify(layout)));
                }, 500)
                
                idSelector.attr('isTriggered', 'false')

                // setTimeout(()=>{
                   
                // }, 500)
            }

            if (event.operation == 'loadLayers' && isSatisfied && (reverse == false || reverse == undefined)){
                console.log('GO', event)
                var element = event['element'];
                var layer = event['layer'];
                var group = event['group'];
                // // if (where == undefined) where = element

                // // console.log(where)
                this.loadLayer(element, layer, group);
                // setTimeout(()=>{
                //     this.appendEventsToPanels(JSON.parse(JSON.stringify(layout)));
                // }, 500)
                
                idSelector.attr('isTriggered', 'false')
            }
            if (event.operation == 'zoom' && isSatisfied){
                var element = event['element'];
                var linked = event['linked'];
                this.zoom(element, linked)
            }

            if (event.operation == 'hyperlink' && isSatisfied){
                // var element = event['element'];
                // var linked = event['linked'];
                // this.link(element, linked)
                // console.log('HELLO')
            }

            
           
        }
        setTimeout(()=>{
           this.stateApp.sliders.update()
        //    this.init();
        //    console.log('init started')

        }, 1000)

    }
    zoom(element, layout){
        console.log(element, layout)

    }
    loadLayer(element, layer, group){
        var sameGroup = this.state.operations.filter(x => x.group == group);
        var elementObj = this.state.operations.find(x => x.element == element);
        // console.log(sameGroup, elementObj)

        for (var i in sameGroup){
            var gr = sameGroup[i];
            d3.selectAll('.' + gr.layer).style('opacity', 0)
        }
        d3.selectAll('.' + elementObj.layer).style('opacity', 1)
    }
    loadLayout(element, layout, where, group){


        if (where == null){
            this.stateApp.setState({currentLayout: layout});
            this.stateApp.reloadEvents();
        } else {
            // var whereSplited = where//parseInt(where.split('_')[1]);
            var indexes = [0,0];
            var arrayArrangement = this.layout.panels;
            for (var i= 0; i <  arrayArrangement.length; i++){
                for (var j= 0; j <  arrayArrangement[i].length; j++){
                        if (arrayArrangement[i][j] == where){indexes = [i,j];}
                } 
            }
            console.log()

            //1 REMOVE ALL GROUP PANEL
            var otherGroup = this.stateApp.state.operations.filter(x => x.group == group);
            var indexes = [];
            for (var i= 0; i <  otherGroup.length; i++){
                var layoutTemp = []
                if (Array.isArray(layout)) layoutTemp = otherGroup[i]['layout']
                else layoutTemp = this.state.layouts.find(x => x.name == otherGroup[i]['layout'])['panels'];
                indexes = indexes.concat(layoutTemp.flat(5))
            }
            console.log(indexes)
            this.remove(indexes)

            console.log(this.state.layouts[0]['panels'])

            //2 APPEND
            console.log('APPENDING')
            // setTimeout(()=>{
                var newLayout = []
                if (Array.isArray(layout)) newLayout = layout
                else newLayout = this.state.layouts.find(x => x.name == layout)['panels']
                
                this.append(where, JSON.parse(JSON.stringify(newLayout)));
            // }, 1000)
            

        }
        


        // this.stateApp.setState({currentLayout: layout});
        // this.stateApp.reloadEvents();
    }
    unhighlight(element, after, idSelector){
       
        
        
        
        var nodes = idSelector.nodes();
        // if (this.objectsAttributes.length > 0){
            
        // }
        for (var k in nodes){
            var nodeInterface = nodes[k];
            // console.log(this.objectsAttributes[element])
            
            var childNodesInterface = nodeInterface.getElementsByTagName("*");
            // console.log()
            if (this.objectsAttributes[element][k] != undefined){
                var items = this.objectsAttributes[element][k].getElementsByTagName("*");
                // console.log(items)
                for (var i = items.length; i--;) {
                    var itemWithoutCSS = items[i];
                    var itemInterface = childNodesInterface[i];
                    // console.log($(itemWithoutCSS).attr('style'))
                    // console.log($(itemInterface).attr('style'))
                    itemInterface.style.cssText = $(itemWithoutCSS).attr('style')

                    
                    // for (var aInitial in itemWithoutCSS.attributes){
                    //     itemInterface.setAttribute(aInitial, itemWithoutCSS.attributes[aInitial]);
                    //     console.log(aInitial)
                    // }

                    // console.log(this.objectsAttributes[element][k].attributes)
                }
                // console.log(nodeInterface, this.objectsAttributes[element][k])
                // console.log($(this.objectsAttributes[element][k]).attr('style'))
                nodeInterface.style.cssText = $(this.objectsAttributes[element][k]).attr('style')

                // var arrayName = ['isTriggered','isTriggeredmouseover','getNamedItem','getNamedItemNS','item','class', 'removeNamedItem','removeNamedItemNS','setNamedItem','setNamedItemNS']
                // for (var aInitialIndex in this.objectsAttributes[element][k].attributes){
                //     var name = this.objectsAttributes[element][k].attributes[aInitialIndex]['name'];
                //     var value = this.objectsAttributes[element][k].attributes[aInitialIndex]['value'];
                   
                //     if (arrayName.indexOf(name) == -1 && name!= undefined) {
                //         // console.log(name, value)
                //         // nodeInterface.setAttribute(name, value);
                //     }
                    
                // }

            }
            
        }
        this.objectsAttributes[element] = []
    
    }
    highlight(element, after, idSelector){
        // console.log('HIGHLIGHT')
        this.objectsAttributes[element] = []
        // if ()
        var elementDOM = idSelector.nodes();

        // console.log(elementDOM)
        // To push elements in the array
        for (var i in elementDOM){
            var cloned = elementDOM[i].cloneNode(true);
            // $(cloned).attr('class', '');
            if (this.objectsAttributes[element] == undefined) this.objectsAttributes[element] = []
            // console.log(cloned)
            this.objectsAttributes[element].push(cloned)

            // console.log(cloned)
        }

        // Generate highlight 
        for (var key in after.style){
            // console.log(idSelector.node(), key, after.style[key])
            idSelector.selectAll('*').each(function(){
                var node = d3.select(this).node()
                // if (node.tagName == 'path' && key == 'fill') d3.select(this).style('stroke', after.style[key])
                // else 
                d3.select(this).style(key, after.style[key])
            })
            idSelector.each(function(){
                var node = d3.select(this).node()
                // if (node.tagName == 'path'  && key == 'fill') d3.select(this).style('stroke', after.style[key])
                // else 
                d3.select(this).style(key, after.style[key])
            })
        }
        for (var key in after.attr){
            console.log(key)
            idSelector.selectAll('*').attr(key, after.style[key])
            idSelector.attr(key, after.style[key])
        }

        // console.log(JSON.parse(JSON.stringify(this.objectsAttributes)))
        //.cloneNode(true);
        // console.log(elementDOM)
        // REMOVE CLASS OF THE FICTIVE ELEMENT 
        // for (var k in this.objectsAttributes){
        //     for (var i in this.objectsAttributes[k]){
        //         console.log(this.objectsAttributes[k][i])
        //     }
        // }

    }
    replace(where, what, isFlex){
        console.log('replace', where, what)
        // var where = parseInt(where.split('_')[1])
        // var what = this.splitArray(what);
        console.log(where, what);
        
        var indexes = [];
        var arrayArrangement = JSON.parse(JSON.stringify(this.layout.panels));
        for (var i= 0; i <  arrayArrangement.length; i++){
            for (var j= 0; j <  arrayArrangement[i].length; j++){
                    if (arrayArrangement[i][j] == where){indexes.push([i,j])}
            } 
        }
        console.log(indexes)
        // Object.assign([], array, {2: newItem});
        // const newArray = Object.assign([...array], {2: 'item2'});

       
        // this.state
        arrayArrangement[indexes[0][0]].splice(indexes[0][1], 1, ...what);
        // arrayArrangement[2][0] = [16]
        this.layout.panels = arrayArrangement

        // console.log(this.layout.panels)
        this.stateApp.setState({layouts: this.state.layouts})

    }
    remove(items, isFlex){

        return new Promise((resolve, reject) => {
            console.log("====== REMOVE")
            var itemsToRemove = items;
            // if (items.flat(5)[0][0] != undefined) itemsToRemove = this.splitArray(items);

            // var itemsToRemove = this.splitArray(items);
            itemsToRemove = itemsToRemove.flat(100);
            var allIndexes = []
            // console.log(itemsToRemove)
            for (var e in itemsToRemove){
                var where = itemsToRemove[e]
                var indexes = []
                var arrayArrangement = JSON.parse(JSON.stringify(this.layout.panels));
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
                            // console.log('GO')
                        }
                    } 
                }
                if (indexes.length > 0) allIndexes.push(JSON.parse(JSON.stringify(indexes)));
                // console.log(indexes)
            }

            // TO SORT THE ARRAY BY INDEX
            allIndexes.sort(function(a, b) {
                return a[2] - b[2] || a[1] - b[1] || a[0] - b[0];
            });
            // console.log('ARRAY ARRANGEMENT', arrayArrangement)
            // console.log(indexes)
            // // NOW ITERATE TO REMOVE
            for (var i = allIndexes.length-1; i >= 0; i--){
                var allIndex = allIndexes[i]
                // console.log(allIndex)
                if (allIndex.length == 3) {
                    
                    // this.changePanelProp(arrayArrangement[allIndex[0]][allIndex[1]][allIndex[2]], 'visible', false);
                    arrayArrangement[allIndex[0]][allIndex[1]].splice(allIndex[2]);
                    // arrayArrangement[allIndex[0]][allIndex[1]][allIndex[2]]
                }
                else {
                    
                    // this.changePanelProp(arrayArrangement[allIndex[0]][allIndex[1]], 'visible', false)
                    arrayArrangement[allIndex[0]].splice(allIndex[1], 1);
                }
                
            }

            // console.log(arrayArrangement)
        
            // // REMOVE IF EMPTY PANEL
            for (var i = arrayArrangement.length-1; i >= 0; i--){
                if (arrayArrangement[i].length == 0) arrayArrangement.splice(i, 1);
                else {
                    for (var j = arrayArrangement[i].length-1; j >= 0; j--){
                        if (arrayArrangement[i][j].length == 0) arrayArrangement[i].splice(j, 1);
                    }
                }
            }
            
            // console.log(arrayArrangement)
            // setTimeout(()=>{
            this.layout.panels = arrayArrangement;
            this.stateApp.setState({layouts: this.state.layouts})
            // }, 1000)
            // console.log(this.state.panels)
            // this.stateApp.setState({panels: this.state.panels})
           

            resolve(true);
        })
    }
    changePanelProp(which, prop, value){
        // console.log(which)
        // var panel = this.state.panels.find(x => x.id == which)
        // panel[prop] = value;
        // console.log(panel)
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
                // for (var j = what[i].length-1; j >= 0; j--){
                    // console.log(what[i][j])
                if (lineToAvoid.indexOf(i) == -1){
                    // console.log('GO')
                    // console.log(what[i] + 'is multi array'+ i)
                    myNewLine.push(what.splice(i, 1));
                    lineToAvoid.push(i);
                }
                // }
            } 
        }

        
        // if (where.length > 0 && where[0][0] != undefined) where = parseInt(where.split('_')[1])
        // // console.log(what.flat(5))
        
        // if (what.flat(5).length > 0 && what.flat(5)[0][0] != undefined) what = this.splitArray(what);

        

        // console.log(where, what);
        // console.log(event);
        
        // indexes of the from array
        // FOR THE WHERE
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
        // console.log(indexes)
        // console.log(myNewLine)

       if (isFlex == undefined){
        //    console.log(what)
            if (what.length > 0) arrayArrangement[indexes[0][0]].splice(indexes[0][1]+1, 0, ...what);

            // IF THERE IS A NEW LINE MENTIONNED
            if (myNewLine.length > 0){
                console.log(myNewLine)
                // for (var i = myNewLine.length-1; i >= 0; i--){
                for (var i = 0; i < myNewLine.length; i++){
                    var element = myNewLine[i][0];
                    // if (myNewLine[i][0].flat(5).length > 0 && myNewLine[i][0].flat(5)[0][0] != undefined) element = this.splitArray(myNewLine[i][0]);
                    console.log("===================", element)
                    arrayArrangement.splice(indexes[0][0]+1, 0, element);
                    
                    // arrayArrangement = [...arrayArrangement, element] 
                }
            }
            // console.log(arrayArrangement, this.state.layout)
            this.layout.panels = arrayArrangement;
            // console.log(this.layout.panels)

            this.stateApp.setState({layouts: this.state.layouts})
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


















    // setEvents2(){
    //     d3.select('#cell_'+ event.on).attr('open', false);
                

    //     if (event.type == 'remove'){
    //         d3.select('#cell_'+ event.on).on(event.event, function(){
    //             if (d3.select(this).attr('open') == 'false'){
    //                 that.props.changeLayout('remove', event.action.from, event.action.to, event.action.width);
    //                 d3.select(this).attr('open', true)
    //             }
    //         })
    //     }

    //     if (event.type == 'append'){
            
    //         d3.select('#cell_'+ event.on).on(event.event, function(){
    //             if (event.backForth == true){
    //                 if (d3.select(this).attr('open') == 'false'){
    //                     that.props.changeLayout('append', event.action.from, event.action.to, event.action.width);
    //                     d3.select(this).attr('open', true)
    //                 } else {
    //                     that.props.changeLayout('remove', event.action.to, event.action.from, event.action.width);
    //                     d3.select(this).attr('open', false)
    //                 }
    //             } else{
    //                 if (d3.select(this).attr('open') == 'false'){
    //                     that.props.changeLayout(event.type, event.action.from, event.action.to, event.action.width);
    //                     d3.select(this).attr('open', true)
    //                 }
    //             }
    //         })
    //     }
    //     if (event.type == 'replace'){
            
    //         d3.select('#cell_'+ event.on).attr('eventiteration', i).on(event.event, function(){
    //             console.log('======', event)
    //             var k = parseInt(d3.select(this).attr('eventiteration'));
    //             if (events[k].backForth == true){
    //                 if (d3.select(this).attr('open') == 'false'){
    //                     that.props.changeLayout('append', events[k].action.from, events[k].action.to, events[k].action.width);
    //                     that.props.changeLayout('remove', events[k].action.from, [], []);
    //                     d3.select(this).attr('open', true)
    //                 } else {
    //                     that.props.changeLayout('append', events[k].action.to, events[k].action.from, events[k].action.width);
    //                     that.props.changeLayout('remove', events[k].action.to, [], []);
    //                     d3.select(this).attr('open', false)
    //                 }
    //             } else{
    //                 if (d3.select(this).attr('open') == 'false'){
    //                     that.props.changeLayout('append', events[k].action.from, events[k].action.to, events[k].action.width);
    //                     that.props.changeLayout('remove', events[k].action.from, [], []);
    //                     d3.select(this).attr('open', true)
    //                 }
    //             }
    //         })
    //     }
    //     // console.log(event)

    //     if (event.type == 'isotype'){
    //         console.log('HELLO', event);
    //         // that.setState({})
    //         // that.setState({isotype: event})
    //         that.state.isotype.push(event);
    //         this.setState({isotype: that.state.isotype})


    //         setTimeout(function(){
    //             // console.log('=====================')
    //             for (var d in that.state.isotype){
    //                 var isotype = that.state.isotype[d];

    //                 var node = d3.select('.foreignClass_'+isotype.to).node()
    //                 // console.log(node)
    //                 // if (that.props.cellData.id == event.from){
    //                 if ( node == null ) {
    //                     console.log('EHHH')
    //                     d3.select('#'+isotype.to).append('foreignObject').attr('class', 'foreignClass_'+isotype.to)
    //                         .attr('width', '100%')
    //                         .attr('height', '100%')
    //                         .attr("x", 0).attr("y", 0)
    //                 }
    //             }


    //         }, 1000)
            
    //         // }
    //     }
    // }
}


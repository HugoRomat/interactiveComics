// function insert_glyph(x,y,glyph,color="",fontsize="") {
//   glyph = d3.select("svg").append('text')
//   .attr("class","glyph")
//   .attr("x",x)
//   .attr("y",y)
//   .attr("style","font-size:40px").text(glyph)
  
//    if (color)
//     {
//       glyph.attr("fill",color)
//     }
//    if (fontsize)
//     {
//       glyph.attr("style","font-size:" + fontsize + "px")
//     }
// }

// function insert_cloud(x,y,color) {
//   insert_glyph(x,y,"☁",color)
//   insert_glyph(x+12,y-12,"1t","white",16)
// }

// function update_glyphs_1(n) {
//   for (var i=0; i< n; i++)
//     {
      
//       x = (i % 5);
//       y = Math.floor(i / 5);
      
//       insert_glyph(65 + x * 40 ,300 - y * 45 ,"✈")
     
//       if (i < Math.round(n * 0.6))
//       {
//         i < 1 ? color="red" : color="black"
//         insert_glyph(740 + x * 25 ,250 - y * 25 ,"■",color)
//         insert_cloud(385 + x * 40 ,270 - y * 45, color)      
//       }
//     }
// }

// function update_glyphs_2()
// {
//   insert_glyph(90 ,240,"✈","black",150)
//   insert_glyph(700 ,160,"🍔🥑🍅","black",50)
//   insert_glyph(700 ,160,"🍔🥑🍅","black",50)
//   insert_glyph(770 ,230,"🏠","black",50)
//   d3.select("svg").append("circle").attr("r",80).attr("cx",490).attr("cy",180).attr("class","glyph")
//   d3.select("svg").append("circle").attr("r",60).attr("cx",490).attr("cy",180).attr("fill","white").attr("class","glyph")
//   d3.select("svg").append("polygon").attr("points","490,180 490,100 600,100 552,258").attr("fill","white").attr("class","glyph")
//   d3.select("svg").append("text").attr("x","465").attr("y","195").attr("font-size","40").text("0.6").attr("class","glyph")
// }
function roundHalf(num) {
  return Math.round(num*2)/2;
}
function updateGlyph1(){
  // console.log('HELLO')
  var kms = (valueInner * 1500) + (valueCross * 8000);
  var aroundGlobe = kms/40000;


  // ==> UPDATE THE VALUE
  var c02 = (kms * 0.85) ; // in kg
  c02 = c02 * 0.001 // in TONS
  var totalFlight = valueInner+valueCross;
  // console.log(c02)
  
  $('#travelTime').html(valueInner+valueCross);
  $('#travelDistance').html(kms);

  $('#timeAroundGlobe').html(aroundGlobe);
  $('.C02tons').html(c02);

  // 4.5 tress => 100Kg ==> 0.1 ton
  var tressNumber =  c02 * 4.5 / 0.1
  $('.tressNumber').html(tressNumber);
  

  $('.cowBurp').html(c02);
  
  
  
  //✈️
 
  for (var i =0; i<totalFlight; i++){
    $('#glyph1').append('<img  style="width:40px;" src="../img/plane.png" />')
  }
  //🌎
  // var roundValue = roundHalf(aroundGlobe);
  var decPart = (aroundGlobe % 1).toFixed(4)
  var intPart = Math.trunc(aroundGlobe)
  var calculatedDecPart = decPart * 70;
  for (var i=0; i<intPart; i++){
    $('#glyph2').append('<img style="width:70px;" src="../img/earth.png" />')
  }
  $('#glyph2').append('<img style="width:70px;position: absolute;clip: rect(0, '+calculatedDecPart+'px, 200px, 0);" src="../img/earth.png" />')

  
  //☁️
  // for (var i =0; i<c02; i++){
    
  //   $('#glyph3').append('<img style="width:70px;" src="../img/fog.png" />')
  // }
  var c02Viz = c02 / 10 ;/// 10000
  var decPart = (c02Viz % 1).toFixed(4)
  var intPart = Math.trunc(c02Viz)
  var calculatedDecPart = decPart * 70;
  for (var i=0; i<intPart; i++){
    $('#glyph3').append('<img style="width:70px;" src="../img/fog.png" />')
  }
  $('#glyph3').append('<img style="width:70px;position: absolute;clip: rect(0, '+calculatedDecPart+'px, 200px, 0);" src="../img/fog.png" />')


  // TREE VISUALISATION
  $('#treeVisualisation').html('');
  console.log(tressNumber)
  for (var i=0; i<tressNumber/10; i++){
    // $('#treeVisualisation').html();
    $('#treeVisualisation').append('<img style="width:10px;" src="../img/tree2.png" />')
  }

  

  $('#cowVisualization').html('');
  for (var i=0; i<c02/10; i++){
    $('#cowVisualization').append('<img style="width:50px;" src="../img/fartingCow.png" />')
  }
  

  
    
}

function updateGlyphs () {
  $(".glyph").empty();

  updateGlyph1();
   
  
}

d3.selectAll('.treeSelect').on('click', function(){
  var id = d3.select(this).attr('id');
  var lastId = id.substr(id.length - 1);
  d3.selectAll('.treePath').style('display', 'none');
  d3.selectAll('.path'+lastId).style('display', 'inline');
})

d3.selectAll('.path1').style('display', 'none');
d3.selectAll('.path2').style('display', 'none');
d3.selectAll('.path3').style('display', 'none');


var valueInner = 0;
var valueCross = 0;
$( function() {

  $('.myslider').each(function() {
    var obj = $(this);
    var min   = parseInt(obj.data('min'));
		var max   = parseInt(obj.data('max'));

      obj.slider({
          value: 0,
          min: min,
          max: max,
          step: 1,
          slide: function( event, ui ) {
            var id = $(this).attr('id');
            if (id == 'sliderInnerFlights'){$("#textInnerFlights").html(ui.value); valueInner = ui.value;}
            if (id == 'sliderCrossFlights'){$("#textCrossFlights").html(ui.value); valueCross = ui.value;}

            updateGlyphs();
            //  console.log()
              // jQuery(sId).val( ui.value );
          }
      });
  })


    // $( "#sliderInnerFlights" ).slider({
    //   value: initial_val,
    //   min: $(this).data("min"),
    //   max: $(this).data("max"),
    //   step: 1,
    //   slide: function( event, ui ) {
    //     // $( "#number_of_flights" ).html(ui.value );
    //     // $( "#number_of_tons" ).html(Math.round(ui.value * 0.6) + "X"); 
    //     // if (ui.value == 2)
    //     //   {
    //     //     $( "#number_of_tons" ).html("1.2X"); 
    //     //   }
    //     // update_glyphs(ui.value)
    //   }
    // });

    
  } );
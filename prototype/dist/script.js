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
function updateGlyph1(){
  console.log('HELLO')
  for (var i =0; i<valueInner; i++){
    $('#glyph1').append("✈️")
  }

  for (var i =0; i<valueCross; i++){
    $('#glyph2').append("🌎")
  }
  for (var i =0; i<valueCross; i++){
    $('#glyph3').append("☁️")
  }


  
    
}

function updateGlyphs () {
  $(".glyph").empty();

  updateGlyph1();
   
  // if (n == 1)
  // {
  //   d3.selectAll(".new").attr("opacity",1.0)
  //   d3.selectAll(".old").attr("opacity",0.0)
  //   update_glyphs_2();
  // }
  // else {
  //   d3.selectAll(".new").attr("opacity",0.0)
  //   d3.selectAll(".old").attr("opacity",1.0)
  //   update_glyphs_1(n);
  // }
  
}

//   initial_val = 16
//   update_glyphs(initial_val);

//   $("#number_of_flights").html(initial_val)
//   $("#number_of_tons").html(Math.round(initial_val * 0.6) + "X")

//   d3.selectAll(".new").attr("opacity",0.0)
//   d3.selectAll(".old").attr("opacity",1.0)

// Slider code from https://jqueryui.com/slider/#steps

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
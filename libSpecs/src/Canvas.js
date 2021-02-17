import React from 'react';
import './css/gallery.css';
import { fabric } from 'fabric';
import  $ from 'jquery';

class CanvasVisualisation extends React.Component {
    state = {

    }
    handleDrop(){
      var that = this;
      $('.canvas-container').each(function(index) {
        var canvasContainer = $(this)[0];
        var canvasObject = $("canvas", this)[0];
        // var url = $(this).data('floorplan');
        // var canvas = window._canvas = new fabric.Canvas(canvasObject);

        // // canvas.setHeight(200);
        // // canvas.setWidth(500);
        // // canvas.setBackgroundImage(url, canvas.renderAll.bind(canvas));
        
        var imageOffsetX, imageOffsetY;

        function handleDragStart(e) {
          console.log('start');
            [].forEach.call(images, function (img) {
                img.classList.remove('img_dragging');
            });
            this.classList.add('img_dragging');
          
          
            var imageOffset = $(this).offset();
            imageOffsetX = e.clientX - imageOffset.left;
            imageOffsetY = e.clientY - imageOffset.top;
        }

        function handleDragOver(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.dataTransfer.dropEffect = 'copy';
            return false;
        }

        function handleDragEnter(e) {
            this.classList.add('over');
        }

        function handleDragLeave(e) {
            this.classList.remove('over');
        }

        function handleDrop(e) {
            console.log('drop');
            e = e || window.event;
            if (e.preventDefault) {
              e.preventDefault();
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            var img = document.querySelector('img.img_dragging');
            console.log('event: ', e);

            console.log(img)
            // console.log()
            var code = img.getAttribute("name")
          
            var offset = $(canvasObject).offset();
            var y = e.clientY - (offset.top + imageOffsetY);
            var x = e.clientX - (offset.left + imageOffsetX);
          
            var newImage = new fabric.Image(img, {
                // width: img.width,
                // height: img.height,
                left: x,
                top: y,
                scaleX: 0.2, scaleY: 0.2,
            });

            newImage.set('code', code);
            // console.log(newImage)
            that.canvas.add(newImage);

            
            that.computeQuery();

            return false;
        }

        function handleDragEnd(e) {
            [].forEach.call(images, function (img) {
                img.classList.remove('img_dragging');
            });
        }
      
      var images = document.querySelectorAll('.imageContainer img');
      // console.log(images);
      [].forEach.call(images, function (img) {
        img.addEventListener('dragstart', handleDragStart, false);
        img.addEventListener('dragend', handleDragEnd, false);
      });
      canvasContainer.addEventListener('dragenter', handleDragEnter, false);
      canvasContainer.addEventListener('dragover', handleDragOver, false);
      canvasContainer.addEventListener('dragleave', handleDragLeave, false);
      canvasContainer.addEventListener('drop', handleDrop, false);
    });
    }
    componentDidMount() {
      var that = this;
      this.canvas = new fabric.Canvas('canvas', {
        height: 500,
        width: 800,
        backgroundColor: 'white'
      })

      

      // Wait for the gallery to be done
      setTimeout(function(){
        that.handleDrop();
        // that.props.setCanvas(that.canvas);
        
      }, 2000)

      $(document).on('keyup',function(e) {
        if (e.which == 46 || e.which == 8){
          that.deleteObjects();
        }
      });
      
    }


    render() {
       
        return (
            <div id='panelCanvas' className="canvas-container">
              <canvas id="canvas" />
            </div>
          )
 }
}
export default CanvasVisualisation

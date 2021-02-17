import React from 'react';
import './css/gallery.css';
import * as d3 from 'd3';
import './css/gallery.css';


class SingleObject extends React.Component {
    componentDidMount(){
        console.log(this.props.object)
        // if (this.props.cell.w) d3.select('#'+this.props.cell.id).style('width', this.props.cell.w);
        // if (this.props.cell.h) d3.select('#'+this.props.cell.id).style('width', this.props.cell.h)
    }
    render() {
          return(
               <div className="object" id={this.props.object.id} style={{width:this.props.object.w, height:this.props.object.h}}>
                    {/* 'HELLO' */}
                    {this.props.object.type == 'image'? <img src={'images/'+this.props.object.url} />: null }
               </div>
          );
    }
}
export default SingleObject

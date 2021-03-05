import React from 'react';

class Hello extends React.Component {
    constructor(props) {
        super(props);

        this.state = { values: [50], sliders: null, isotype: [], mounted: false };
        this.slidersPosition = [];
        
    }
    componentDidUpdate() {
      console.log("UPDATE", this.props.name);
    }
    componentDidMount() {
      console.log("MOUNT", this.props.name);
    }
    render() {
      return <h2>{this.props.name}</h2>;
    }
}

export default Hello
// import React, { Component } from 'react';
import React from 'react';

class Doenet extends React.PureComponent {

  componentDidMount(){
    if (this.props.free.componentDidMount !== undefined){
      this.props.free.componentDidMount();
    }
  }

  componentWillUnmount() {
    if (this.props.free.componentWillUnmount !== undefined){
      this.props.free.componentWillUnmount();
    }
    this.props.free.componentDidMount = undefined;
    this.props.free.componentDidUpdate = undefined;
    this.props.free.doenetState = undefined;
    this.props.free.componentWillUnmount = undefined;
  }

  componentDidUpdate(){
    if (this.props.free.componentDidUpdate !== undefined){
      this.props.free.componentDidUpdate();
    }
  }

  render() {

    return (<React.Fragment>
      {this.props.free.doenetState}
      </React.Fragment>);
  }
}

export default Doenet;

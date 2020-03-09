import React, { Component } from 'react';


export default class DoenetRenderer extends Component {
  constructor(props) {
    super(props);
    this.addChildren = this.addChildren.bind(this);
    this.removeChildren = this.removeChildren.bind(this);
    this.update = this.update.bind(this);

    this.children = this.props.children;

    this.doenetSvData = {};
    Object.assign(this.doenetSvData, props.svData);

    this.props.updateObject.update = this.update;
    this.props.updateObject.addChildren = this.addChildren;
    this.props.updateObject.removeChildren = this.removeChildren;

  }

  update(newStateVariables) {
    Object.assign(this.doenetSvData, newStateVariables);
    this.forceUpdate();
  }

  addChildren(index, components) {
    this.children.splice(index, 0, ...components);
    this.forceUpdate();
  }

  removeChildren(index, numberToRemove) {
    this.children.splice(index, numberToRemove);
    this.forceUpdate();
  }

 
}
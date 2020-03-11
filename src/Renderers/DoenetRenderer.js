import React, { Component } from 'react';


export default class DoenetRenderer extends Component {
  constructor(props) {
    super(props);
    this.addChildren = this.addChildren.bind(this);
    this.removeChildren = this.removeChildren.bind(this);
    this.update = this.update.bind(this);

    this.childrenToCreate = props.componentInstructions.children;
    this.componentName = props.componentInstructions.componentName;

    this.actions = props.componentInstructions.actions;


    // TODO: this keeps the proxy in place so that state variables
    // aren't calculated unless asked for
    // Is this what we want?
    // Also means it will always have the new values when they are changed....
    this.doenetSvData = props.componentInstructions.stateValues;

    props.rendererUpdateObjects[this.componentName] = this.update;
    props.updateObject.addChildren = this.addChildren;
    props.updateObject.removeChildren = this.removeChildren;

  }

  update() {
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

  createChildren(additionalprops = {}) {
    this.children = [];

    for (let childInstructions of this.childrenToCreate) {

      // TODO: how does updateObject work in this model????
      let updateObject = {};

      let propsForChild = {
        key: childInstructions.componentName,
        componentInstructions: childInstructions,
        updateObject,
        rendererClasses: this.props.rendererClasses,
        rendererUpdateObjects: this.props.rendererUpdateObjects,
        flags: this.props.flags,
      }

      Object.assign(propsForChild, additionalprops);


      let child = React.createElement(
        this.props.rendererClasses[childInstructions.componentType],
        propsForChild
      );
      this.children.push(child);
    }

    return this.children;
  }

}
import { nanoid } from 'nanoid';
import React, { Component } from 'react';
import { renderersloadComponent } from '../DoenetViewer';


export default class DoenetRenderer extends Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);

    // BADBADBAD: this.childrenToCreate gets updated indirectly by Core
    // in updateRendererInstructions, where it modifies componentInstructions.children,
    // and that change is assumed in addChildren, below.
    // Very confusing!
    this.childrenToCreate = props.componentInstructions.children;
    this.componentName = props.componentInstructions.componentName;

    this.actions = props.componentInstructions.actions;
    this.callAction = props.callAction;

    // This keeps the proxy in place so that state variables
    // aren't calculated unless asked for
    // Also means it will always have the new values when they are changed
    // so we don't have to pass them in on update
    this.doenetSvData = props.componentInstructions.stateValues;

    props.rendererUpdateMethods[this.componentName] = {
      update: this.update,
    }
    this.rendererPromises = {};
    this.initializeChildren();
  }

  static initializeChildrenOnConstruction = true;

  update() {
    this.initializeChildren()
    this.forceUpdate();
  }

  initializeChildren() {
    this.children = [];

    for (let childInstructions of this.childrenToCreate) {
      let child = this.createChildFromInstructions(childInstructions);

      this.children.push(child);
    }
    if (Object.keys(this.rendererPromises).length > 0){
        renderersloadComponent(Object.values(this.rendererPromises), Object.keys(this.rendererPromises)).then((newRendererClasses)=>{
          Object.assign(this.props.rendererClasses,newRendererClasses)
          this.rendererPromises = {}
          this.initializeChildren();
          this.forceUpdate();
        })
    }

    return this.children;
  }

  createChildFromInstructions(childInstructions) {
    // add nanoid to key so that will have unique key if recreate
    // renderer for a component with the same name as an old one
    // TODO: is this the best way to do it?


    if(typeof childInstructions === "string") {
      return childInstructions;
    }

    let propsForChild = {
      key: childInstructions.componentName + nanoid(10),
      componentInstructions: childInstructions,
      rendererClasses: this.props.rendererClasses,
      rendererUpdateMethods: this.props.rendererUpdateMethods,
      flags: this.props.flags,
      callAction: this.callAction,
    };
    if (this.doenetPropsForChildren) {
      Object.assign(propsForChild, this.doenetPropsForChildren);
    }
    let rendererClass = this.props.rendererClasses[childInstructions.rendererType];

    if (!rendererClass) {
      if (!(childInstructions.rendererType in this.rendererPromises)){
        this.rendererPromises[childInstructions.rendererType] = import(`./${childInstructions.rendererType}.js`);
      }
      return null;
      // throw Error(`Cannot render component ${childInstructions.componentName} as have not loaded renderer type ${childInstructions.rendererType}`)
    }

    let child = React.createElement(rendererClass, propsForChild);
    return child;
  }

  
}
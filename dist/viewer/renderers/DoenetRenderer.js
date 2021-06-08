import {nanoid} from "../../_snowpack/pkg/nanoid.js";
import React, {Component} from "../../_snowpack/pkg/react.js";
export default class DoenetRenderer extends Component {
  constructor(props) {
    super(props);
    this.addChildren = this.addChildren.bind(this);
    this.removeChildren = this.removeChildren.bind(this);
    this.swapChildren = this.swapChildren.bind(this);
    this.update = this.update.bind(this);
    this.childrenToCreate = props.componentInstructions.children;
    this.componentName = props.componentInstructions.componentName;
    this.actions = props.componentInstructions.actions;
    this.doenetSvData = props.componentInstructions.stateValues;
    props.rendererUpdateMethods[this.componentName] = {
      update: this.update,
      addChildren: this.addChildren,
      removeChildren: this.removeChildren,
      swapChildren: this.swapChildren
    };
    if (this.constructor.initializeChildrenOnConstruction) {
      this.initializeChildren();
    }
  }
  static initializeChildrenOnConstruction = true;
  update() {
    this.forceUpdate();
  }
  addChildren(instruction) {
    let childInstructions = this.childrenToCreate[instruction.indexForParent];
    let child = this.createChildFromInstructions(childInstructions);
    this.children.splice(instruction.indexForParent, 0, child);
    this.children = [...this.children];
    this.forceUpdate();
  }
  removeChildren(instruction) {
    this.children.splice(instruction.firstIndexInParent, instruction.numberChildrenDeleted);
    this.children = [...this.children];
    for (let componentName of instruction.deletedComponentNames) {
      delete this.props.rendererUpdateMethods[componentName];
    }
    this.forceUpdate();
  }
  swapChildren(instruction) {
    [this.children[instruction.index1], this.children[instruction.index2]] = [this.children[instruction.index2], this.children[instruction.index1]];
    this.children = [...this.children];
    this.forceUpdate();
  }
  initializeChildren() {
    this.children = [];
    for (let childInstructions of this.childrenToCreate) {
      let child = this.createChildFromInstructions(childInstructions);
      this.children.push(child);
    }
    return this.children;
  }
  createChildFromInstructions(childInstructions) {
    let propsForChild = {
      key: childInstructions.componentName + nanoid(10),
      componentInstructions: childInstructions,
      rendererClasses: this.props.rendererClasses,
      rendererUpdateMethods: this.props.rendererUpdateMethods,
      flags: this.props.flags
    };
    if (this.doenetPropsForChildren) {
      Object.assign(propsForChild, this.doenetPropsForChildren);
    }
    let rendererClass = this.props.rendererClasses[childInstructions.rendererType];
    if (!rendererClass) {
      throw Error(`Cannot render component ${childInstructions.componentName} as have not loaderer renderer type ${childInstructions.rendererType}`);
    }
    let child = React.createElement(rendererClass, propsForChild);
    return child;
  }
}

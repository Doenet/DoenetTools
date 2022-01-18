import {nanoid} from "../../_snowpack/pkg/nanoid.js";
import React, {Component} from "../../_snowpack/pkg/react.js";
import {renderersloadComponent} from "../DoenetViewer.js";
export default class DoenetRenderer extends Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.childrenToCreate = props.componentInstructions.children;
    this.componentName = props.componentInstructions.componentName;
    this.actions = props.componentInstructions.actions;
    this.doenetSvData = props.componentInstructions.stateValues;
    props.rendererUpdateMethods[this.componentName] = {
      update: this.update
    };
    this.rendererPromises = {};
    this.initializeChildren();
  }
  static initializeChildrenOnConstruction = true;
  update() {
    this.initializeChildren();
    this.forceUpdate();
  }
  initializeChildren() {
    this.children = [];
    for (let childInstructions of this.childrenToCreate) {
      let child = this.createChildFromInstructions(childInstructions);
      this.children.push(child);
    }
    if (Object.keys(this.rendererPromises).length > 0) {
      renderersloadComponent(Object.values(this.rendererPromises), Object.keys(this.rendererPromises)).then((newRendererClasses) => {
        Object.assign(this.props.rendererClasses, newRendererClasses);
        this.rendererPromises = {};
        this.initializeChildren();
        this.forceUpdate();
      });
    }
    return this.children;
  }
  createChildFromInstructions(childInstructions) {
    if (typeof childInstructions === "string") {
      return childInstructions;
    }
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
      if (!(childInstructions.rendererType in this.rendererPromises)) {
        this.rendererPromises[childInstructions.rendererType] = import(`./${childInstructions.rendererType}.js`);
      }
      return null;
    }
    let child = React.createElement(rendererClass, propsForChild);
    return child;
  }
}

import React, { Component } from 'react';
import Core from '../Doenet/Core';


class DoenetViewer extends Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.coreReady = this.coreReady.bind(this);
    this.buildTree = this.buildTree.bind(this);

    this.rendererUpdateObjects = {};

    this.core = new Core({
      postConstructionCallBack: this.coreReady,
      coreUpdatedCallback: this.update,
      doenetML: props.doenetML,
    });

    this.doenetRenders = <>Loading...</>


  }

  coreReady() {
    let renderPromises = [];
    let rendererNames = [];
    for (let rendererName of this.core.renderedComponentTypes) {
      console.log(rendererName)
      rendererNames.push(rendererName);
      renderPromises.push(import(/* webpackMode: "lazy", webpackChunkName: "./renderers/[request]" */ `../Renderers/${rendererName}`));
    }

    console.log(rendererNames);

    renderersloadComponent(renderPromises, rendererNames).then((renderers) => {
      console.log("renderers inside laod component")
      console.log(renderers)
      this.renderers = renderers;
      this.buildTree();
    });

  }

  buildTree() {
    console.log("renderers")
    console.log(this.renderers)
    this.doenetRenders = this.buildTreeHelper([this.core.renderedComponents[this.core.documentName]]);
    this.forceUpdate();
  }

  //Build tree depth first
  buildTreeHelper(tree) {
    var reactArray = [];
    var children = [];
    for (let node of tree) {
      if (node.children.length > 0) {
        //if has children go deeper
        children = this.buildTreeHelper(node.children);
      }
      let updateObject = {};
      console.log("node")
      console.log(node)
      let reactComponent = React.createElement(this.renderers[node.componentType],
        {
          key: node.componentName,
          children,
          svData: node.stateValues,
          updateObject,
          requestUpdate: this.core.requestUpdate,
        });
      reactArray.push(reactComponent);
      this.rendererUpdateObjects[node.componentName] = updateObject;

      // reactArray.push({name:node.componentName,children})

    }

    return reactArray;



  }


  //offscreen then postpone that one
  update(instructions) {
    for (let instruction of instructions) {
      // console.log(`${instruction.instructionType}!`);

      if (instruction.instructionType === "UpdateStateVariable") {
        for (let componentName in instruction.newStateVariableValues) {
          this.rendererUpdateObjects[componentName].update(instruction.newStateVariableValues[componentName]);
        }
      } else if (instruction.instructionType === "AddComponents") {
        let renderer = this.rendererUpdateObjects[instruction.parentComponentName];
        let newComponents = this.buildTreeHelper(instruction.components);
        renderer.addChildren(instruction.childIndex, newComponents);
      } else if (instruction.instructionType === "DeleteComponents") {
        let renderer = this.rendererUpdateObjects[instruction.parentComponentName];
        for (let delChildName of instruction.childNames) {
          delete this.rendererUpdateObjects[delChildName];
        }

        renderer.removeChildren(instruction.childIndex, instruction.numberToRemove);

      }
    }


  }

  render() {
    return <>
      {this.doenetRenders}
    </>
  }

}

export default DoenetViewer;



async function renderersloadComponent(promises, rendererNames) {

  var renderers = {};
  for (let [index, promise] of promises.entries()) {
    try {
      let module = await promise;
      renderers[rendererNames[index]] = module.default;
    } catch (error) {
      console.log(error)
      console.error(`Error: loading ${rendererNames[index]} failed.`)
    }

  }
  return renderers;

}


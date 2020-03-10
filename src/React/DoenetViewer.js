import React, { Component } from 'react';
import Core from '../Doenet/Core';


class DoenetViewer extends Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.coreReady = this.coreReady.bind(this);

    this.rendererUpdateObjects = {};

    this.core = new Core({
      coreReadyCallback: this.coreReady,
      coreUpdatedCallback: this.update,
      doenetML: props.doenetML,
    });

    this.documentRenderer = <>Loading...</>
    // this.doenetRenderers = {};

  }

  coreReady() {
    let renderPromises = [];
    let rendererClassNames = [];
    for (let rendererClassName of this.core.renderedComponentTypes) {
      rendererClassNames.push(rendererClassName);
      renderPromises.push(import(/* webpackMode: "lazy", webpackChunkName: "./renderers/[request]" */ `../Renderers/${rendererClassName}`));
    }


    renderersloadComponent(renderPromises, rendererClassNames).then((rendererClasses) => {
      this.rendererClasses = rendererClasses;
      let documentComponentInstructions = this.core.renderedComponents[this.core.documentName];
      let documentRendererClass = this.rendererClasses[documentComponentInstructions.componentType]

      // TODO: how does updateObject work in this model????
      let updateObject = {};
      this.documentRenderer = React.createElement(documentRendererClass,
        {
          key: documentComponentInstructions.componentName,
          componentInstructions: documentComponentInstructions,
          updateObject,
          rendererClasses: this.rendererClasses,
          requestUpdate: this.core.requestUpdate,
          rendererUpdateObjects: this.rendererUpdateObjects,
        }
      )

      this.forceUpdate();
      console.log("rendererUpdateObjects")
      console.log(this.rendererUpdateObjects)
    });

  }


  // buildTree() {
  //   this.buildTreeHelper([this.core.renderedComponents[this.core.documentName]]);
  //   this.documentRenderer = this.doenetRenderers[this.core.documentName];
  //   console.log("documentRenderer")
  //   console.log(this.documentRenderer)
  //   this.forceUpdate();
  // }

  // //Build tree depth first
  // buildTreeHelper(tree) {
  //   var reactArray = [];
  //   for (let node of tree) {
  //     var children = [];
  //     if (node.children.length > 0) {
  //       //if has children go deeper
  //       children = this.buildTreeHelper(node.children);
  //     }
  //     let updateObject = {};
  //     let reactComponent = React.createElement(this.renderers[node.componentType],
  //       {
  //         key: node.componentName,
  //         _key: node.componentName,
  //         children,
  //         svData: node.stateValues,
  //         updateObject,
  //         requestUpdate: this.core.requestUpdate,
  //       });
  //     reactArray.push(reactComponent);
  //     this.doenetRenderers[node.componentName] = reactComponent;
  //     this.rendererUpdateObjects[node.componentName] = updateObject;

  //   }

  //   return reactArray;

  // }


  //offscreen then postpone that one
  update(instructions) {
    for (let instruction of instructions) {
      // console.log(`${instruction.instructionType}!`);

      if (instruction.instructionType === "updateStateVariable") {
        for (let componentName of instruction.renderersToUpdate) {
          this.rendererUpdateObjects[componentName]();
        }
      } else if (instruction.instructionType === "addComponents") {
        let renderer = this.rendererUpdateObjects[instruction.parentComponentName];
        let newComponents = this.buildTreeHelper(instruction.components);
        renderer.addChildren(instruction.childIndex, newComponents);
      } else if (instruction.instructionType === "deleteComponents") {
        let renderer = this.rendererUpdateObjects[instruction.parentComponentName];
        for (let delChildName of instruction.childNames) {
          delete this.rendererUpdateObjects[delChildName];
        }

        renderer.removeChildren(instruction.childIndex, instruction.numberToRemove);

      }
    }


  }

  render() {
    return this.documentRenderer;
  }

}

export default DoenetViewer;



async function renderersloadComponent(promises, rendererClassNames) {

  var rendererClasses = {};
  for (let [index, promise] of promises.entries()) {
    try {
      let module = await promise;
      rendererClasses[rendererClassNames[index]] = module.default;
    } catch (error) {
      console.log(error)
      console.error(`Error: loading ${rendererClassNames[index]} failed.`)
    }

  }
  return rendererClasses;

}


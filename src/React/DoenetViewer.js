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
      let documentComponentInstructions = this.core.renderedComponentInstructions[this.core.documentName];
      let documentRendererClass = this.rendererClasses[documentComponentInstructions.componentType]

      // TODO: how does updateObject work in this model????
      let updateObject = {};
      this.documentRenderer = React.createElement(documentRendererClass,
        {
          key: documentComponentInstructions.componentName,
          componentInstructions: documentComponentInstructions,
          updateObject,
          rendererClasses: this.rendererClasses,
          rendererUpdateObjects: this.rendererUpdateObjects,
          flags: this.props.flags,
        }
      )

      this.forceUpdate();
      console.log("rendererUpdateObjects")
      console.log(this.rendererUpdateObjects)
    });

  }



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


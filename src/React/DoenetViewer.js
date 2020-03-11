import React, { Component } from 'react';
import Core from '../Doenet/Core';


class DoenetViewer extends Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.coreReady = this.coreReady.bind(this);

    this.rendererUpdateMethods = {};

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

      this.documentRenderer = React.createElement(documentRendererClass,
        {
          key: documentComponentInstructions.componentName,
          componentInstructions: documentComponentInstructions,
          rendererClasses: this.rendererClasses,
          rendererUpdateMethods: this.rendererUpdateMethods,
          flags: this.props.flags,
        }
      )

      this.forceUpdate();
    });

  }



  //offscreen then postpone that one
  update(instructions) {
    for (let instruction of instructions) {

      if (instruction.instructionType === "updateStateVariable") {
        for (let componentName of instruction.renderersToUpdate) {
          this.rendererUpdateMethods[componentName].update();
        }
      } else if (instruction.instructionType === "addRenderer") {
        this.rendererUpdateMethods[instruction.parentName].addChildren(instruction)
      } else if (instruction.instructionType === "deleteRenderers") {
        this.rendererUpdateMethods[instruction.parentName].removeChildren(instruction)

        // let renderer = this.rendererUpdateMethods[instruction.parentComponentName];
        // for (let delChildName of instruction.childNames) {
        //   delete this.rendererUpdateMethods[delChildName];
        // }

        // renderer.removeChildren(instruction.childIndex, instruction.numberToRemove);

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


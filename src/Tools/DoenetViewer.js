import React, { Component } from 'react';
import Core from '../Doenet/Core';


class DoenetViewer extends Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.coreReady = this.coreReady.bind(this);
    this.localStateChanged = this.localStateChanged.bind(this);

    this.rendererUpdateMethods = {};

    this.core = new Core({
      coreReadyCallback: this.coreReady,
      coreUpdatedCallback: this.update,
      doenetML: props.doenetML,
      externalFunctions: { localStateChanged: this.localStateChanged },
    });

    this.documentRenderer = <>Loading...</>
    // this.doenetRenderers = {};

    // this.databaseItemsToReload = props.databaseItemsToReload;

  }

  coreReady() {

    // Replay any updates
    // Call core.executeUpdateStateVariables on each row of database
    // for(let line of this.databaseItemsToReload) {
    //   core.executeUpdateStateVariables(....)
    // }

    let renderPromises = [];
    let rendererClassNames = [];
    console.log('rendererTypesInDocument');
    console.log(this.core.rendererTypesInDocument);
    for (let rendererClassName of this.core.rendererTypesInDocument) {
      rendererClassNames.push(rendererClassName);
      // renderPromises.push(import(/* webpackMode: "lazy", webpackChunkName: "./renderers/[request]" */ `../Renderers/${rendererClassName}`));
      renderPromises.push(import(/* webpackMode: "lazy", webpackChunkName: "renderers/[request]" */ `../Renderers/${rendererClassName}`));
    }


    renderersloadComponent(renderPromises, rendererClassNames).then((rendererClasses) => {
      this.rendererClasses = rendererClasses;
      let documentComponentInstructions = this.core.renderedComponentInstructions[this.core.documentName];
      let documentRendererClass = this.rendererClasses[documentComponentInstructions.rendererType]

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

  localStateChanged({
    newStateVariableValues,
    contentId, sourceOfUpdate, transient = false
  }) {

    // TODO: what should we do with transient updates?
    if (transient) {
      return;
    }

    // console.log('local state changed')

    // console.log(newStateVariableValues, contentId, sourceOfUpdate)

    // newStateVariableValues = {
    //   component1: {
    //     x: 3,
    //     y: 3,
    //   },
    //   comonent2: {
    //     q: 3,
    //     y: 5
    //   }
    // }


    // for(let componentName in newStateVariableValues) {
    //   if(!myValues[componentName]) {
    //     myValues[componentName] = {}
    //   }
    //   Object.assign(myValues[componentName], newStateVariableValues[componentName])
    // }


    // save to database
    // check the cookie to see if allowed to record
    // display warning if is assignment for class and have returned off recording
    // maybe that's shown when enroll in class, and you cannot turn it off
    // without disenrolling from class

  }

  //offscreen then postpone that one
  update(instructions) {
    for (let instruction of instructions) {

      if (instruction.instructionType === "updateStateVariable") {
        for (let componentName of instruction.renderersToUpdate
          .filter(x => x in this.rendererUpdateMethods)
        ) {
          this.rendererUpdateMethods[componentName].update({
            sourceOfUpdate: instruction.sourceOfUpdate
          });
        }
      } else if (instruction.instructionType === "addRenderer") {
        if (instruction.parentName in this.rendererUpdateMethods)
          this.rendererUpdateMethods[instruction.parentName].addChildren(instruction)
      } else if (instruction.instructionType === "deleteRenderers") {
        if (instruction.parentName in this.rendererUpdateMethods)
          this.rendererUpdateMethods[instruction.parentName].removeChildren(instruction)
      } else if (instruction.instructionType === "swapChildRenderers") {
        if (instruction.parentName in this.rendererUpdateMethods)
          this.rendererUpdateMethods[instruction.parentName].swapChildren(instruction)
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


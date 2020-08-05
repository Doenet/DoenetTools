import React, { Component } from 'react';
import Core from '../Doenet/Core';
import axios from 'axios';
import { serializedStateReplacer, serializedStateReviver } from '../Doenet/utils/serializedStateProcessing';


class DoenetViewer extends Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.coreReady = this.coreReady.bind(this);
    this.loadedStateVariables = this.loadedStateVariables.bind(this);
    this.loadState = this.loadState.bind(this);
    this.localStateChanged = this.localStateChanged.bind(this);

    this.rendererUpdateMethods = {};

    this.cumulativeStateVariableChanges = {};

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
    this.loadState(this.core.contentId, this.loadedStateVariables)

  }


  loadedStateVariables({ stateVariables }) {

    this.cumulativeStateVariableChanges = JSON.parse(stateVariables, serializedStateReviver)

    if (this.cumulativeStateVariableChanges) {
      this.core.executeUpdateStateVariables({
        newStateVariableValues: this.cumulativeStateVariableChanges
      })
    } else {
      // if database doesn't contain contentID, cumulativeStateVariableChanges is null
      // so change to empty object
      this.cumulativeStateVariableChanges = {};
    }


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


    for (let componentName in newStateVariableValues) {
      if (!this.cumulativeStateVariableChanges[componentName]) {
        this.cumulativeStateVariableChanges[componentName] = {}
      }
      Object.assign(this.cumulativeStateVariableChanges[componentName], newStateVariableValues[componentName])
    }

    let changeString = JSON.stringify(this.cumulativeStateVariableChanges, serializedStateReplacer);


    // save to database
    // check the cookie to see if allowed to record
    // display warning if is assignment for class and have returned off recording
    // maybe that's shown when enroll in class, and you cannot turn it off
    // without disenrolling from class



    // if (assignmentId) {
    //   //Save Assignment Info
    //   console.log('assignment')
    // }

    const phpUrl = '/api/recordContentInteraction.php';
    const data = {
      assignmentId: null,
      contentId,
      stateVariables: changeString,
    }

    axios.post(phpUrl, data)
      .then(resp => {
        console.log('save', resp.data);
      });



  }


  loadState(contentId, callback) {

    const phpUrl = '/api/loadContentInteractions.php';
    const data = {
      contentId,
    }
    console.log('data', data)
    const payload = {
      params: data
    }

    axios.get(phpUrl, payload)
      .then(resp => {
        console.log('load', resp.data);
        if (callback) {
          callback({ stateVariables: resp.data.stateVariables })
        }
        // let divs = [];
        // for (let stringified of resp.data.stateVariables){
        //   divs.push(<div>{JSON.stringify(stringified)}</div>)
        // }

        // setContentInteractionsDivs(divs);
      });


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


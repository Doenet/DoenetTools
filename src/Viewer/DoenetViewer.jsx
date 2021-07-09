import React, { Component } from 'react';
import Core from './core';
import axios from 'axios';
import sha256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';
import me from 'math-expressions';
import { nanoid } from 'nanoid';


export function serializedComponentsReplacer(key, value) {
  if (value !== value) {
    return { objectType: 'special-numeric', stringValue: 'NaN' };
  } else if (value === Infinity) {
    return { objectType: 'special-numeric', stringValue: 'Infinity' };
  } else if (value === -Infinity) {
    return { objectType: 'special-numeric', stringValue: '-Infinity' };
  }
  return value;
}

let nanInfinityReviver = function (key, value) {

  if (value && value.objectType === "special-numeric") {
    if (value.stringValue === "NaN") {
      return NaN;
    } else if (value.stringValue === "Infinity") {
      return Infinity;
    } else if (value.stringValue === "-Infinity") {
      return -Infinity;
    }
  }

  return value;
}

export function serializedComponentsReviver(key, value) {
  return me.reviver(key, nanInfinityReviver(key, value))
}

class DoenetViewerChild extends Component {

  constructor(props) {
    // console.log("===DoenetViewerChild constructor")

    super(props);
    this.update = this.update.bind(this);
    this.coreReady = this.coreReady.bind(this);
    this.createCore = this.createCore.bind(this);
    this.loadState = this.loadState.bind(this);
    this.localStateChanged = this.localStateChanged.bind(this);
    this.submitResponse = this.submitResponse.bind(this);
    this.recordSolutionView = this.recordSolutionView.bind(this);
    this.recordEvent = this.recordEvent.bind(this);

    this.rendererUpdateMethods = {};

    this.cumulativeStateVariableChanges = {};

    this.needNewCoreFlag = false;
    this.weightsStored = false;

    //Track if viewer should update with:
    //this.state.doenetML, this.state.attemptNumber, and this.state.contentId
    this.state = {
      doenetML: null,
      attemptNumber: null,
      contentId: null,
      errMsg: null
    }
  }


  createCore({ stateVariables, variant }) {

    if (stateVariables === undefined) {
      console.error(`error loading state variables`);
      this.cumulativeStateVariableChanges = null;
      variant = null;
    } else {
      this.cumulativeStateVariableChanges = JSON.parse(stateVariables, serializedComponentsReviver)
    }

    // if loaded variant from database,
    // then use that variant rather than requestedVariant from props
    if (variant !== null) {
      this.requestedVariant = JSON.parse(variant, serializedComponentsReviver);
      this.requestedVariantFromDatabase = true;
    }

    // TODO: who is responsible for verifying that a contentId matches hash?
    // Core or viewer?
    // Argument for doing it in core: core will have to do it anyway for
    // <copy uri="doenetML:abc" />
    // Best option: viewer and the function passed in to retrieve content 
    // should verify hash

    this.coreId = nanoid();
    // console.log(">>>CREATE core this.coreId!!!",this.coreId)  

    if (this.props.core) {
      new this.props.core({
        coreId: this.coreId,
        coreReadyCallback: this.coreReady,
        coreUpdatedCallback: this.update,
        doenetML: this.doenetML,
        externalFunctions: {
          localStateChanged: this.localStateChanged,
          submitResponse: this.submitResponse,
          recordSolutionView: this.recordSolutionView,
          recordEvent: this.recordEvent,
          contentIdsToDoenetMLs: this.contentIdsToDoenetMLs.bind(this)
        },
        flags: this.props.flags,
        requestedVariant: this.requestedVariant,
      });
    } else {
      new Core({
        coreId: this.coreId,
        coreReadyCallback: this.coreReady,
        coreUpdatedCallback: this.update,
        doenetML: this.doenetML,
        externalFunctions: {
          localStateChanged: this.localStateChanged,
          submitResponse: this.submitResponse,
          recordSolutionView: this.recordSolutionView,
          recordEvent: this.recordEvent,
          contentIdsToDoenetMLs: this.contentIdsToDoenetMLs.bind(this)
        },
        flags: this.props.flags,
        requestedVariant: this.requestedVariant,
      });
    }



    // this.databaseItemsToReload = props.databaseItemsToReload;

  }

  coreReady(core) {
    this.core = core;

    this.generatedVariant = core.document.stateValues.generatedVariantInfo;
    this.allPossibleVariants = [...core.document.sharedParameters.allPossibleVariants];

    if (this.props.generatedVariantCallback) {
      this.props.generatedVariantCallback(this.generatedVariant, this.allPossibleVariants);
    }

    if (this.cumulativeStateVariableChanges) {
      // continue to try setting the state variables to cummulativeStateVariableChanges
      // while there are a positive number of failures
      // and the number of failures is increasing
      let nFailures = Infinity;
      while (nFailures > 0) {
        let result = core.executeUpdateStateVariables({
          newStateVariableValues: this.cumulativeStateVariableChanges
        })
        if (!(result.nFailures && result.nFailures < nFailures)) {
          break;
        }
        nFailures = result.nFailures;
      }
    } else {
      // if database doesn't contain contentId, cumulativeStateVariableChanges is null
      // so change to empty object
      this.cumulativeStateVariableChanges = {};
    }


    // TODO: look up the items and their weights
    // save info to user_assignment_attempt and user_assignment_attempt_item
    // if it is the first time (adds records to database if they don't exist?)
    // this.core.scoredItemWeights = [ weight1, weight2, weight3 ]


    //TODO: Handle if number of items changed. Handle if weights changed


    let renderPromises = [];
    let rendererClassNames = [];
    // console.log('rendererTypesInDocument');
    // console.log(">>>core.rendererTypesInDocument",core.rendererTypesInDocument);  
    for (let rendererClassName of core.rendererTypesInDocument) {
      rendererClassNames.push(rendererClassName);
      renderPromises.push(import(`./renderers/${rendererClassName}.js`));
    }


    renderersloadComponent(renderPromises, rendererClassNames).then((rendererClasses) => {
      this.rendererClasses = rendererClasses;
      let documentComponentInstructions = core.renderedComponentInstructions[core.documentName];
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

      // this.forceUpdate();
      this.needNewCoreFlag = false;

      this.setState({
        doenetML: this.doenetML,
        attemptNumber: this.attemptNumber,
        contentId: this.contentId
      })
    });

    //Let the calling tool know we are ready
    //TODO: Move this to renderer
    if (this.props.onCoreReady) {
      this.props.onCoreReady();
    }
  }

  localStateChanged({
    newStateVariableValues,
    contentId, sourceOfUpdate, transient = false
  }) {


    // TODO: what should we do with transient updates?
    if (transient || !this.allowSavePageState && !this.allowLocalPageState) {
      return;
    }


    for (let componentName in newStateVariableValues) {
      if (!this.cumulativeStateVariableChanges[componentName]) {
        this.cumulativeStateVariableChanges[componentName] = {}
      }
      for (let varName in newStateVariableValues[componentName]) {
        let cumValues = this.cumulativeStateVariableChanges[componentName][varName];
        // if cumValues is an object with mergeObject = true,
        // then merge attributes from newStateVariableValues into cumValues
        if (typeof cumValues === "object" && cumValues !== null && cumValues.mergeObject) {
          Object.assign(cumValues, newStateVariableValues[componentName][varName])
        } else {
          this.cumulativeStateVariableChanges[componentName][varName] = newStateVariableValues[componentName][varName];
        }
      }
    }

    let changeString = JSON.stringify(this.cumulativeStateVariableChanges, serializedComponentsReplacer);


    let variantString = JSON.stringify(this.generatedVariant, serializedComponentsReplacer);

    // save to database
    // check the cookie to see if allowed to record
    // display warning if is assignment for class and have returned off recording
    // maybe that's shown when enroll in class, and you cannot turn it off
    // without disenrolling from class


    const data = {
      contentId,
      stateVariables: changeString,
      attemptNumber: this.attemptNumber,
      doenetId: this.props.doenetId,
      variant: variantString,
    }

    if (this.allowLocalPageState) {
      localStorage.setItem(`${contentId}${this.props.doenetId}${this.attemptNumber}`, JSON.stringify({ stateVariables: changeString, variant: variantString }))
    }

    if (!this.allowSavePageState) {
      return;
    }

    axios.post('/api/recordContentInteraction.php', data)
    // .then(resp => {
    // });



  }

  loadState(callback) {

    if (!this.allowLoadPageState && !this.allowLocalPageState) {
      callback({
        stateVariables: null,
        variant: null
      });
      return;
    }

    if (this.allowLocalPageState) {

      let stateVarVariant = JSON.parse(localStorage.getItem(`${this.contentId}${this.props.doenetId}${this.attemptNumber}`))
      let stateVariables = null;
      let variant = null;

      if (stateVarVariant) {
        stateVariables = stateVarVariant.stateVariables;
        variant = stateVarVariant.variant
      }
      callback({
        stateVariables,
        variant
      });
      return;
    }

    const payload = {
      params: {
        contentId: this.contentId,
        attemptNumber: this.attemptNumber,
        doenetId: this.props.doenetId,
      }
    }

    axios.get('/api/loadContentInteractions.php', payload)
      .then(resp => {
        if (!resp.data.success) {
          throw new Error(resp.data.message)
        }
        if (callback) {
          callback({
            stateVariables: resp.data.stateVariables,
            variant: resp.data.variant
          })
        }
      })
      .catch(errMsg => {
        this.setState({ errMsg: errMsg.message })
      })

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

  //Need item state?
  submitResponse({
    itemNumber,
    itemCreditAchieved,
    callBack,
  }) {

    // console.log(">>>submit itemNumber:",itemNumber)

    if (this.allowSaveSubmissions && this.props.doenetId) {


      if (!this.weightsStored) {
        this.weightsStored = true;
        //TODO: Test if weights dynamically changed then store updates
        //FOR NOW: Only call once
        const payload1 = {
          weights: this.core.scoredItemWeights,
          contentId: this.contentId,
          doenetId: this.props.doenetId,
          attemptNumber: this.attemptNumber
        }

        axios.post('/api/saveAssignmentWeights.php', payload1)
        // .then(resp => {
        // });
      }


      const payload2 = {
        doenetId: this.props.doenetId,
        contentId: this.contentId,
        attemptNumber: this.attemptNumber,
        credit: itemCreditAchieved,
        itemNumber,
      }
      // console.log(">>>saveCreditForItem payload",payload2)
      axios.post('/api/saveCreditForItem.php', payload2)
      // .then(resp => {
      //   console.log('saveCreditForItem-->>>',resp.data);

      // });
    }

    callBack("submitResponse callback parameter");
  }

  // TODO: if assignmentId, then need to record fact that student
  // viewed solution in user_assignment_attempt_item
  recordSolutionView({ itemNumber, scoredComponent, callBack }) {

    // console.log(`reveal solution, ${itemNumber}`)

    // if (this.assignmentId) {
    //   console.warn(`Need to record solution view in the database!!`);

    //   // TODO: is there a condition where we don't allow solution view?
    //   // Presumably some setting from course
    //   // But, should the condition be checked on the server?

    //   // TODO: call callBack as callBack from php call
    //   callBack({ allowView: true, message: "", scoredComponent })

    // } else {

    //   // if not an assignment, immediately show solution
    //   callBack({ allowView: true, message: "", scoredComponent })

    // }

    //Temporary until viewed solution is written
    callBack({ allowView: true, message: "", scoredComponent })


  }

  recordEvent(event) {

    if (!this.allowSaveEvents) {
      return;
    }

    const payload = {
      doenetId: this.props.doenetId,
      contentId: this.contentId,
      attemptNumber: this.attemptNumber,
      variant: JSON.stringify(this.generatedVariant, serializedComponentsReplacer),
      verb: event.verb,
      object: JSON.stringify(event.object, serializedComponentsReplacer),
      result: JSON.stringify(event.result, serializedComponentsReplacer),
      context: JSON.stringify(event.context, serializedComponentsReplacer),
      timestamp: event.timestamp,
      version: "0.1.0",
    }

    axios.post('/api/recordEvent.php', payload)
    // .then(resp => {
    // });

  }


  contentIdsToDoenetMLs({ contentIds, callBack }) {
    let promises = [];
    let newDoenetMLs = {};
    let newContentIds = contentIds;

    for (let contentId of contentIds) {
      promises.push(axios.get(`/media/${contentId}.doenet`))

    }

    Promise.all(promises).then((resps) => {
      // contentIds.forEach((x, i) => newDoenetMLs[x] = resps[i].data)
      newDoenetMLs = resps.map(x => x.data);

      callBack({
        newDoenetMLs,
        newContentIds,
        success: true
      })
    }).catch(err => {

      let message;
      if (newContentIds.length === 1) {
        message = `Could not retrieve contentId ${newContentIds[0]}`
      } else {
        message = `Could not retrieve contentIds ${newContentIds.join(',')}`
      }

      message += ": " + err.message;

      callBack({
        success: false,
        message,
        newDoenetMLs: [],
        newContentIds: []
      })
    })

  }


  render() {

    if (this.state.errMsg !== null) {
      return <div>{this.state.errMsg}</div>
    }

    this.allowLoadPageState = true;
    if (this.props.allowLoadPageState === false) {
      this.allowLoadPageState = false;
    }
    this.allowSavePageState = true;
    if (this.props.allowSavePageState === false) {
      this.allowSavePageState = false;
    }
    this.allowLocalPageState = true;
    if (this.props.allowLocalPageState === false) {
      this.allowLocalPageState = false;
    }
    this.allowSaveSubmissions = true;
    if (this.props.allowSaveSubmissions === false) {
      this.allowSaveSubmissions = false;
    }
    this.allowSaveEvents = true;
    if (this.props.allowSaveEvents === false) {
      this.allowSaveEvents = false;
    }

    //If no attemptNumber prop then set to 1
    this.attemptNumber = this.props.attemptNumber;
    if (this.attemptNumber === undefined) {
      this.attemptNumber = 1;
    }


    let adjustedRequestedVariantFromProp = this.props.requestedVariant;
    if (adjustedRequestedVariantFromProp === undefined) {
      adjustedRequestedVariantFromProp = { index: this.attemptNumber };
    }

    // TODO: should we be giving viewer both attemptNumber and requestedVariant?
    // for now, attemptNumber is used for requestedVariant if not specified

    if (!this.requestedVariantFromDatabase &&
      JSON.stringify(this.requestedVariant) !== JSON.stringify(adjustedRequestedVariantFromProp)
    ) {
      this.needNewCoreFlag = true;
    }
    this.requestedVariant = adjustedRequestedVariantFromProp;


    if (this.props.doenetML && !this.props.contentId) {
      //*** Define this.contentId if not prop
      this.doenetML = this.props.doenetML;
      if (this.doenetML !== this.state.doenetML) {
        this.contentId = sha256(this.props.doenetML).toString(CryptoJS.enc.Hex);
        this.needNewCoreFlag = true;
      }
    } else if (!this.props.doenetML && this.props.contentId) {
      //*** Define this.doenetML if not prop
      this.contentId = this.props.contentId;
      //If contentId is different load the corresponding contentId
      if (this.contentId !== this.state.contentId) {
        this.needNewCoreFlag = true;
        //Try to load doenetML from local storage
        this.doenetML = localStorage.getItem(this.contentId);
        if (!this.doenetML) {
          try {
            //Load the doenetML from the server
            axios.get(`/media/${this.contentId}.doenet`)
              .then(resp => {
                this.doenetML = resp.data;
                localStorage.setItem(this.contentId, this.doenetML)
                this.forceUpdate();
              })
          } catch (err) {
            //TODO: Handle 404
            return "Error Loading";
          }
          return null;

        }

      }

    } else if (this.props.doenetML && this.props.contentId) {
      //*** Have this.doenetML and this.contentId if not prop
      this.doenetML = this.props.doenetML;
      this.contentId = this.props.contentId;

      //Content changed, so need new core
      if (this.contentId !== this.state.contentId) {
        this.needNewCoreFlag = true;
      }
    }

    if (this.attemptNumber !== this.state.attemptNumber) {
      //TODO: Change attempt number without needing a new core
      this.needNewCoreFlag = true;
    }


    if (this.needNewCoreFlag) {
      this.loadState(this.createCore);
      return null;
    }


    return this.documentRenderer;
  }

}

//TODO: too blunt eliminate ignoreDatabase
//Propose: 
//props.AllowLoadPageState (ContentInteractions) (Turn off only for automated testing)
//props.AllowSavePageState (ContentInteractions) (Saves where you were)
//props.AllowSavePageStateLocally (Give user this option save only to device not Doenet)
//props.AllowSaveSubmissions (grades)
//props.AllowSaveEvents

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      errorMsg: ""
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMsg: error.toString()
    };
  }

  render() {
    if (this.state.hasError) {
      return <b>{this.state.errorMsg}</b>;
    }

    return this.props.children;
  }
}

function DoenetViewer(props) {
  return <ErrorBoundary><DoenetViewerChild {...props} /></ErrorBoundary>
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


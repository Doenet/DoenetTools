import React, { Component } from 'react';
import Core from './core';
import axios from 'axios';
import sha256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';
import { nanoid } from 'nanoid';
import { useToast, toastType } from '@Toast';
import { serializedComponentsReplacer, serializedComponentsReviver } from '../Core/utils/serializedStateProcessing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';


class DoenetViewerChild extends Component {

  constructor(props) {
    // console.log("===DoenetViewerChild constructor")

    super(props);
    this.update = this.update.bind(this);
    this.coreReady = this.coreReady.bind(this);
    this.createCore = this.createCore.bind(this);
    this.loadState = this.loadState.bind(this);
    this.localStateChanged = this.localStateChanged.bind(this);
    // this.submitResponse = this.submitResponse.bind(this);
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

    if (!stateVariables) {
      // console.error(`error loading state variables`);
      this.cumulativeStateVariableChanges = {};
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
    try {


      if (this.props.core) {
        new this.props.core({
          coreId: this.coreId,
          coreReadyCallback: this.coreReady,
          coreUpdatedCallback: this.update,
          doenetML: this.doenetML,
          externalFunctions: {
            localStateChanged: this.localStateChanged,
            // submitResponse: this.submitResponse,
            recordSolutionView: this.recordSolutionView,
            recordEvent: this.recordEvent,
            contentIdsToDoenetMLs: this.contentIdsToDoenetMLs.bind(this)
          },
          flags: this.props.flags,
          requestedVariant: this.requestedVariant,
          stateVariableChanges: this.cumulativeStateVariableChanges,
        });
      } else {
        new Core({
          coreId: this.coreId,
          coreReadyCallback: this.coreReady,
          coreUpdatedCallback: this.update,
          doenetML: this.doenetML,
          externalFunctions: {
            localStateChanged: this.localStateChanged,
            // submitResponse: this.submitResponse,
            recordSolutionView: this.recordSolutionView,
            recordEvent: this.recordEvent,
            contentIdsToDoenetMLs: this.contentIdsToDoenetMLs.bind(this)
          },
          flags: this.props.flags,
          requestedVariant: this.requestedVariant,
          stateVariableChanges: this.cumulativeStateVariableChanges,
        });
      }
    } catch (e) {
      if (this.props.setIsInErrorState) {
        this.props.setIsInErrorState(true)
      }
      this.setState({ errMsg: e.message });
    }



    // this.databaseItemsToReload = props.databaseItemsToReload;

  }

  coreReady(core) {
    this.core = core;

    this.generatedVariant = core.document.stateValues.generatedVariantInfo;
    this.itemVariantInfo = core.document.stateValues.itemVariantInfo;

    this.allPossibleVariants = [...core.document.sharedParameters.allPossibleVariants];

    if (this.props.generatedVariantCallback) {
      this.props.generatedVariantCallback(this.generatedVariant, this.allPossibleVariants);
    }

    // if (this.cumulativeStateVariableChanges) {
    //   // continue to try setting the state variables to cummulativeStateVariableChanges
    //   // while there are a positive number of failures
    //   // and the number of failures is increasing
    //   let nFailures = Infinity;
    //   while (nFailures > 0) {
    //     let result = core.executeUpdateStateVariables({
    //       newStateVariableValues: this.cumulativeStateVariableChanges
    //     })
    //     console.log(`nFailures: ${result.nFailures}`)
    //     if (!(result.nFailures && result.nFailures < nFailures)) {
    //       break;
    //     }
    //     nFailures = result.nFailures;
    //   }
    // } else {
    //   // if database doesn't contain contentId, cumulativeStateVariableChanges is null
    //   // so change to empty object
    //   this.cumulativeStateVariableChanges = {};
    // }


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

    //Initialize user_assignment tables
    // console.log(">>>>this.contentId",this.contentId)
    // console.log(">>>>this.attemptNumber",this.attemptNumber)
    // console.log(">>>>this.requestedVariant",this.requestedVariant)
    // console.log(">>>>this.generatedVariant",this.generatedVariant)
    // console.log(">>>>this.allowSavePageState",this.allowSavePageState)
    // console.log(">>>>this.savedUserAssignmentAttemptNumber",this.savedUserAssignmentAttemptNumber)
    if (this.allowSavePageState &&
      Number.isInteger(this.attemptNumber) &&
      this.savedUserAssignmentAttemptNumber !== this.attemptNumber
    ) {
      // console.log(">>>>savedUserAssignmentAttemptNumber!!!")

      //TODO: Do we need this? or does the catch handle it?
      if (!navigator.onLine) {
        this.props.toast("You're not connected to the internet. ", toastType.ERROR)
      }

      axios.post('/api/initAssignmentAttempt.php', {
        doenetId: this.props.doenetId,
        weights: this.core.scoredItemWeights,
        attemptNumber: this.attemptNumber,
        contentId: this.contentId,
        requestedVariant: JSON.stringify(this.requestedVariant, serializedComponentsReplacer),
        generatedVariant: JSON.stringify(this.generatedVariant, serializedComponentsReplacer),
        itemVariantInfo: this.itemVariantInfo.map(x => JSON.stringify(x, serializedComponentsReplacer)),
      }).then(({ data }) => {

        if (!data.success) {
          if (this.props.setIsInErrorState) {
            this.props.setIsInErrorState(true)
          }
          this.setState({ errMsg: data.message })
        }

        this.savedUserAssignmentAttemptNumber = this.attemptNumber; //In callback
      })
        .catch(errMsg => {
          if (this.props.setIsInErrorState) {
            this.props.setIsInErrorState(true)
          }
          this.setState({ errMsg: errMsg.message })
        })

    }

    //Let the calling tool know we are ready
    //TODO: Move this to renderer
    if (this.props.onCoreReady) {
      this.props.onCoreReady();
    }
  }

  localStateChanged({
    newStateVariableValues,
    contentId, sourceOfUpdate, transient = false,
    itemsWithCreditAchieved,
  }) {

    // TODO: think through what the different flags do
    // and what are the reasonable combinations
    // flags: allowSavePageState, allowLocalPageState, allowSaveSubmissions
    // For now: we will not save submissions unless either
    // allowSavePageState is true
    // (also won't save if transient is true but that will never happen :) )

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


    // check if generated variant changed
    // (which could happen, at least for now, when paginator changes pages)
    let currentVariantString = JSON.stringify(this.core.document.stateValues.generatedVariantInfo, serializedComponentsReplacer);
    if (currentVariantString !== variantString) {
      this.generatedVariant = this.core.document.stateValues.generatedVariantInfo;
      variantString = currentVariantString;
      if (this.props.generatedVariantCallback) {
        this.props.generatedVariantCallback(this.generatedVariant, this.allPossibleVariants);
      }

    }



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

    if (!navigator.onLine) {
      this.props.toast("You're not connected to the internet. Changes are not saved. ", toastType.ERROR)
    }

    if (this.savePageStateTimeoutID) {
      clearTimeout(this.savePageStateTimeoutID);
    }

    //Debounce the save to database
    this.savePageStateTimeoutID = setTimeout(() => {
      axios.post('/api/recordContentInteraction.php', data)
        .then(({ data }) => {
          if (!data.success) {
            this.props.toast(data.message, toastType.ERROR)
          }
            // console.log(">>>>recordContentInteraction data",data)
        });
    }, 1000);

    if (!this.allowSaveSubmissions) {
      return;
    }

    // if this update was not due to an answer submission,
    // itemsWithCreditAchieved will be empty
    for (let itemNumber in itemsWithCreditAchieved) {

      let itemCreditAchieved = itemsWithCreditAchieved[itemNumber]

      const payload2 = {
        doenetId: this.props.doenetId,
        contentId: this.contentId,
        attemptNumber: this.attemptNumber,
        credit: itemCreditAchieved,
        itemNumber,
        stateVariables: changeString,
      }
      axios.post('/api/saveCreditForItem.php', payload2)
        .then(resp => {
          // console.log('>>>>saveCreditForItem resp', resp.data);
          if (!resp.data.success) {
            this.props.toast(resp.data.message, toastType.ERROR)
          }

          this.props.updateCreditAchievedCallback(resp.data);

          //TODO: need type warning (red but doesn't hang around)
          if (resp.data.viewedSolution) {
            this.props.toast('No credit awarded since solution was viewed.', toastType.INFO)
          }
          if (resp.data.timeExpired) {
            this.props.toast('No credit awarded since the time allowed has expired.', toastType.INFO)
          }
          if (resp.data.pastDueDate) {
            this.props.toast('No credit awarded since the due date has passed.', toastType.INFO)
          }
          if (resp.data.exceededAttemptsAllowed) {
            this.props.toast('No credit awarded since no more attempts are allowed.', toastType.INFO)
          }
          if (resp.data.databaseError) {
            this.props.toast('Credit not saved due to database error.', toastType.ERROR)
          }
        });

    }


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

    //submissions or pageState
    let effectivePageStateSource = "pageState"; //Default
    if (this.props.pageStateSource) {
      effectivePageStateSource = this.props.pageStateSource;
    }

    const payload = {
      params: {
        contentId: this.contentId,
        attemptNumber: this.attemptNumber,
        doenetId: this.props.doenetId,
        userId: this.props.userId,
        pageStateSource: effectivePageStateSource,
      }
    }
    // console.log(">>>>>loadContentInteractions")

    axios.get('/api/loadContentInteractions.php', payload)
      .then(resp => {
        // console.log(">>>>>resp",resp.data)

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
        if (this.props.setIsInErrorState) {
          this.props.setIsInErrorState(true)
        }
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

  // //Need item state?
  // submitResponse({
  //   itemNumber,
  //   itemCreditAchieved,
  //   callBack,
  // }) {

  //   if (this.allowSaveSubmissions && this.props.doenetId) {

  //     const payload = {
  //       doenetId: this.props.doenetId,
  //       contentId: this.contentId,
  //       attemptNumber: this.attemptNumber,
  //       credit: itemCreditAchieved,
  //       itemNumber,
  //     }
  //     axios.post('/api/saveCreditForItem.php', payload)
  //       .then(resp => {
  //         // console.log('>>>>resp',resp.data);

  //         if (resp.data.viewedSolution) {
  //           this.props.toast('No credit awarded since solution was viewed.', toastType.INFO) //TODO: need type warning (red but doesn't hang around)
  //         }

  //       });
  //   }

  //   callBack("submitResponse callback parameter");
  // }

  // TODO: if assignmentId, then need to record fact that student
  // viewed solution in user_assignment_attempt_item
  // console.log(">>>>recordSolutionView")
  async recordSolutionView({ itemNumber, scoredComponent }) {
    const resp = await axios.post('/api/reportSolutionViewed.php', {
      doenetId: this.props.doenetId,
      itemNumber,
      attemptNumber: this.attemptNumber,
    });

    // console.log('reportSolutionViewed-->>>>',resp.data);

    return { allowView: true, message: "", scoredComponent };

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
    //   console.log(">>>>resp",resp.data)
    // });

  }

  contentIdsToDoenetMLs({ contentIds, callBack }) {
    let promises = [];
    let newDoenetMLs = {};
    let newContentIds = contentIds;

    for (let contentId of contentIds) {
      promises.push(axios.get(`/media/${contentId}.doenet`))

    }

    function ErrorFromWithinCallback(originalError) {
      this.name = 'ErrorFromWithinCallback';
      this.originalError = originalError;
    }

    Promise.all(promises).then((resps) => {
      // contentIds.forEach((x, i) => newDoenetMLs[x] = resps[i].data)
      newDoenetMLs = resps.map(x => x.data);

      try {
        callBack({
          newDoenetMLs,
          newContentIds,
          success: true
        })
      } catch (e) {
        throw new ErrorFromWithinCallback(e);
      }
    }).catch(err => {

      if (err.name === 'ErrorFromWithinCallback') {
        throw err.originalError;
      }

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
      let errorIcon = <span style={{fontSize:"1em",color:"#C1292E"}}><FontAwesomeIcon icon={faExclamationCircle}/></span>
      return <div style={{fontSize:"1.3em",marginLeft:"20px",marginTop:"20px"}}>{errorIcon} {this.state.errMsg}</div>
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


    if (typeof this.props.doenetML === "string" && !this.props.contentId) {
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
        // this.doenetML = localStorage.getItem(this.contentId);
        // if (!this.doenetML) {
        try {
          //Load the doenetML from the server
          axios.get(`/media/${this.contentId}.doenet`)
            .then(resp => {
              this.doenetML = resp.data;
              // localStorage.setItem(this.contentId, this.doenetML)
              this.forceUpdate();
            })
        } catch (err) {
          //TODO: Handle 404
          return "Error Loading";
        }
        return null;

        // }

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

    //Spacing around the whole doenetML document
    return <div style={{ maxWidth: "850px", paddingLeft: "20px", paddingRight: "20px", marginBottom: "200px" }}>{this.documentRenderer}</div>;
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
  const toast = useToast();
  let newProps = { ...props, toast }
  return <ErrorBoundary><DoenetViewerChild {...newProps} /></ErrorBoundary>
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


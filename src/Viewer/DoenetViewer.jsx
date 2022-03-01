import React, { Component } from 'react';
import Core from './core';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { useToast, toastType } from '@Toast';
import { serializedComponentsReplacer, serializedComponentsReviver } from '../Core/utils/serializedStateProcessing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { rendererState } from '../Viewer/renderers/useDoenetRenderer';
import { atomFamily, useRecoilCallback } from 'recoil';
import { CIDFromDoenetML } from '../Core/utils/cid';

const rendererUpdatesToIgnore = atomFamily({
  key: 'rendererUpdatesToIgnore',
  default: {},
})

class DoenetViewerChild extends Component {

  constructor(props) {
    // console.log("===DoenetViewerChild constructor",props)

    super(props);
    this.updateRenderers = this.updateRenderers.bind(this);
    this.coreReady = this.coreReady.bind(this);
    this.createCore = this.createCore.bind(this);
    this.loadState = this.loadState.bind(this);
    // this.submitResponse = this.submitResponse.bind(this);
    this.callAction = this.callAction.bind(this);

    this.rendererStateValues = {};

    this.cumulativeStateVariableChanges = {};

    this.needNewCoreFlag = false;
    this.weightsStored = false;

    //Track if viewer should update with:
    //this.state.doenetML, this.state.attemptNumber, and this.state.CID
    this.state = {
      doenetML: null,
      attemptNumber: null,
      CID: null,
      errMsg: null
    }

    // TODO: remove not!
    if (!this.props.useUnbundledCore) {
      this.coreWorker = new Worker('core/Core.js', { type: 'module' })
    } else {
      this.coreWorker = new Worker('viewer/core.js', { type: 'module' })
    }

    let viewer = this;

    this.coreCreated = false;

    this.coreWorker.onmessage = function (e) {
      if (e.data.messageType === "coreCreated") {
        viewer.coreCreated = true;
        if (viewer.coreInfo && JSON.stringify(viewer.coreInfo) === JSON.stringify(e.data.args)) {
          console.log('do we skip sending core ready since already have coreInfo?')

          // let string1 = JSON.stringify(viewer.coreInfo);
          // let string2 = JSON.stringify(e.data.args);
          // console.log('Is coreInfo unchanged?', string1 === string2)

          // for(let i=0; i < string1.length; i++) {
          //   let c1 = string1[i];
          //   let c2 = string2[i];
          //   if(c1 !== c2) {
          //     console.log(`different at ${i}: ${c1} vs ${c2}}`)
          //   }
          // }

          // console.log(JSON.stringify(viewer.coreInfo))
          // console.log(JSON.stringify(e.data.args))
        } else {
          console.log('creating new core')
          viewer.coreReady(e.data.args)
        }
      } else if (e.data.messageType === "updateRenderers") {
        if (e.data.init && viewer.coreInfo) {
          console.log('do we skip initial render state values since already have coreInfo?')
        } else {
          viewer.updateRenderers(e.data.args)
        }
      } else if (e.data.messageType === "saveState") {
        viewer.saveState(e.data.args)
      } else if (e.data.messageType === "recordSolutionView") {
        viewer.recordSolutionView(e.data.args);
      } else if (e.data.messageType === "returnAllStateVariables") {
        console.log(e.data.args)
        viewer.resolveAllStateVariables(e.data.args);
      } else if(e.data.messageType === "inErrorState") {
        if (viewer.props.setIsInErrorState) {
          viewer.props.setIsInErrorState(true)
        }
        viewer.setState({ errMsg: e.data.args.errMsg });
      }
    }

    window.returnAllStateVariables = function () {
      this.coreWorker.postMessage({
        messageType: "returnAllStateVariables"
      })

      return new Promise((resolve, reject) => {
        viewer.resolveAllStateVariables = resolve;
      })

    }.bind(this)


    window.callAction = function ({ actionName, componentName, args }) {
      this.callAction({
        action: { actionName, componentName },
        args
      })
    }.bind(this);

  }

  callAction({ action, args, baseVariableValue, name, rendererType }) {

    if (this.coreCreated || !this.rendererClasses?.[rendererType]?.ignoreActionsWithoutCore) {
      if (baseVariableValue !== undefined && name) {
        let actionId = nanoid();
        this.props.updateRendererUpdatesToIgnore({
          componentName: name,
          baseVariableValue,
          actionId
        })
        args = { ...args };
        args.actionId = actionId;
      }

      this.coreWorker.postMessage({
        messageType: "requestAction",
        args: {
          actionName: action.actionName,
          componentName: action.componentName,
          args,
        }
      })
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

    // TODO: who is responsible for verifying that a CID matches hash?
    // Core or viewer?
    // Argument for doing it in core: core will have to do it anyway for
    // <copy uri="doenetML:abc" />
    // Best option: viewer and the function passed in to retrieve content 
    // should verify hash

    this.coreId = nanoid();
    // console.log(">>>CREATE core this.coreId!!!",this.coreId)  
    try {


      this.coreWorker.postMessage({
        messageType: "createCore",
        args: {
          coreId: this.coreId,
          userId: this.props.userId,
          doenetML: this.doenetML,
          CID: this.CID,
          // CID: '7e2f6b647f74652b59dc31f709a13e273342efe251d0ecb15d9bbfb7dafa5bc1',
          doenetId: this.doenetId,
          flags: this.props.flags,
          attemptNumber: this.attemptNumber,
        }
      })

      // if (this.props.core) {
      //   new this.props.core({
      //     coreId: this.coreId,
      //     coreReadyCallback: this.coreReady,
      //     coreUpdatedCallback: this.update,
      //     doenetML: this.doenetML,
      //     externalFunctions: {
      //       localStateChanged: this.localStateChanged,
      //       updateRendererSVsWithRecoil: this.props.updateRendererSVsWithRecoil,
      //       // submitResponse: this.submitResponse,
      //       recordSolutionView: this.recordSolutionView,
      //       recordEvent: this.recordEvent,
      //       contentIdsToDoenetMLs: this.contentIdsToDoenetMLs.bind(this)
      //     },
      //     flags: this.props.flags,
      //     requestedVariant: this.requestedVariant,
      //     stateVariableChanges: this.cumulativeStateVariableChanges,
      //   });
      // } else {
      //   new Core({
      //     coreId: this.coreId,
      //     coreReadyCallback: this.coreReady,
      //     coreUpdatedCallback: this.update,
      //     doenetML: this.doenetML,
      //     externalFunctions: {
      //       localStateChanged: this.localStateChanged,
      //       updateRendererSVsWithRecoil: this.props.updateRendererSVsWithRecoil,
      //       // submitResponse: this.submitResponse,
      //       recordSolutionView: this.recordSolutionView,
      //       recordEvent: this.recordEvent,
      //       contentIdsToDoenetMLs: this.contentIdsToDoenetMLs.bind(this)
      //     },
      //     flags: this.props.flags,
      //     requestedVariant: this.requestedVariant,
      //     stateVariableChanges: this.cumulativeStateVariableChanges,
      //   });
      // }
    } catch (e) {
      throw (e);
      if (this.props.setIsInErrorState) {
        this.props.setIsInErrorState(true)
      }
      this.setState({ errMsg: e.message });
    }



    // this.databaseItemsToReload = props.databaseItemsToReload;

  }




  coreReady(coreInfo) {
    this.coreInfo = coreInfo;

    // this.generatedVariantInfo = coreInfo.generatedVariantInfo;
    // this.itemVariantInfo = coreInfo.itemVariantInfo;

    // this.allPossibleVariants = coreInfo.allPossibleVariants;

    if (this.props.generatedVariantCallback) {
      this.props.generatedVariantCallback(this.coreInfo.generatedVariantInfo, this.coreInfo.allPossibleVariants);
    }

    // if (this.cumulativeStateVariableChanges) {
    //   // continue to try setting the state variables to cumulativeStateVariableChanges
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
    //   // if database doesn't contain CID, cumulativeStateVariableChanges is null
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
    for (let rendererClassName of coreInfo.rendererTypesInDocument) {
      rendererClassNames.push(rendererClassName);
      renderPromises.push(import(`./renderers/${rendererClassName}.js`));
    }

    let documentComponentInstructions = coreInfo.documentToRender;


    renderersloadComponent(renderPromises, rendererClassNames).then((rendererClasses) => {
      this.rendererClasses = rendererClasses;
      let documentRendererClass = this.rendererClasses[documentComponentInstructions.rendererType]

      this.documentRenderer = React.createElement(documentRendererClass,
        {
          key: documentComponentInstructions.componentName,
          componentInstructions: documentComponentInstructions,
          rendererClasses: this.rendererClasses,
          flags: this.props.flags,
          callAction: this.callAction,
        }
      )

      // this.forceUpdate();
      this.needNewCoreFlag = false;

      this.setState({
        doenetML: this.doenetML,
        attemptNumber: this.attemptNumber,
        CID: this.CID
      })
    });

    //Initialize user_assignment tables
    // console.log(">>>>this.CID",this.CID)
    // console.log(">>>>this.attemptNumber",this.attemptNumber)
    // console.log(">>>>this.requestedVariant",this.requestedVariant)
    // console.log(">>>>this.coreInfo.generatedVariantInfo",this.coreInfo.generatedVariantInfo)
    // console.log(">>>>this.allowSavePageState",this.allowSavePageState)
    // console.log(">>>>this.savedUserAssignmentAttemptNumber",this.savedUserAssignmentAttemptNumber)
    if (this.props.flags.allowSavePageState &&
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
        weights: coreInfo.scoredItemWeights,
        attemptNumber: this.attemptNumber,
        contentId: this.CID,
        requestedVariant: JSON.stringify(this.requestedVariant, serializedComponentsReplacer),
        generatedVariant: JSON.stringify(this.coreInfo.generatedVariantInfo, serializedComponentsReplacer),
        itemVariantInfo: this.coreInfo.itemVariantInfo.map(x => JSON.stringify(x, serializedComponentsReplacer)),
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

  }


  saveState({
    newStateVariableValues,
    CID,
    itemsWithCreditAchieved,
    currentVariant,
  }) {

    // TODO: think through what the different flags do
    // and what are the reasonable combinations
    // flags: allowSavePageState, allowLocalPageState, allowSaveSubmissions
    // For now: we will not save submissions unless either
    // allowSavePageState is true

    if (!this.props.flags.allowSavePageState && !this.props.flags.allowLocalPageState) {
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

    let variantString = JSON.stringify(this.coreInfo.generatedVariantInfo, serializedComponentsReplacer);


    // check if generated variant changed
    // (which could happen, at least for now, when paginator changes pages)
    let currentVariantString = JSON.stringify(currentVariant, serializedComponentsReplacer);
    if (currentVariantString !== variantString) {
      this.coreInfo.generatedVariantInfo = currentVariant;
      variantString = currentVariantString;
      if (this.props.generatedVariantCallback) {
        this.props.generatedVariantCallback(this.coreInfo.generatedVariantInfo, this.coreInfo.allPossibleVariants);
      }

    }



    // save to database
    // check the cookie to see if allowed to record
    // display warning if is assignment for class and have returned off recording
    // maybe that's shown when enroll in class, and you cannot turn it off
    // without disenrolling from class


    const data = {
      contentId:CID,
      stateVariables: changeString,
      attemptNumber: this.attemptNumber,
      doenetId: this.props.doenetId,
      variant: variantString,
    }

    if (this.props.flags.allowLocalPageState) {
      localStorage.setItem(
        `${CID}${this.props.doenetId}${this.attemptNumber}`,
        JSON.stringify({
          stateVariables: changeString,
          variant: variantString,
          rendererStateValues: this.rendererStateValues,
          coreInfo: this.coreInfo,
        })
      )
    }

    if (!this.props.flags.allowSavePageState) {
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

    if (!this.props.flags.allowSaveSubmissions) {
      return;
    }

    // if this update was not due to an answer submission,
    // itemsWithCreditAchieved will be empty
    for (let itemNumber in itemsWithCreditAchieved) {

      let itemCreditAchieved = itemsWithCreditAchieved[itemNumber]

      const payload2 = {
        doenetId: this.props.doenetId,
        contentId: this.CID,
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

  async loadState() {

    if (!this.props.flags.allowLoadPageState && !this.props.flags.allowLocalPageState) {
      return {
        stateVariables: null,
        variant: null
      };
    }

    if (this.props.flags.allowLocalPageState) {

      let localInfo = JSON.parse(localStorage.getItem(
        `${this.CID}${this.props.doenetId}${this.attemptNumber}`
      ))
      let stateVariables = null;
      let variant = null;
      let rendererStateValues = {};

      if (localInfo) {
        stateVariables = localInfo.stateVariables;
        variant = localInfo.variant;

        if (localInfo.rendererStateValues) {
          this.rendererStateValues = localInfo.rendererStateValues;

          console.log('loading renderer values')
          console.log(this.rendererStateValues)
          for (let componentName in this.rendererStateValues) {
            this.props.updateRendererSVsWithRecoil({
              componentName,
              stateValues: this.rendererStateValues[componentName],
            })
          }
        }


        this.coreInfo = localInfo.coreInfo;
        if (this.coreInfo) {

          console.log('pretending core ready from database')
          this.coreReady(this.coreInfo);
        }
      }
      return {
        stateVariables,
        variant,
      }
    }

    //submissions or pageState
    let effectivePageStateSource = "pageState"; //Default
    if (this.props.pageStateSource) {
      effectivePageStateSource = this.props.pageStateSource;
    }

    const payload = {
      params: {
        contentId: this.CID,
        attemptNumber: this.attemptNumber,
        doenetId: this.props.doenetId,
        userId: this.props.userId,
        pageStateSource: effectivePageStateSource,
      }
    }
    // console.log(">>>>>loadContentInteractions")

    try {
      let resp = await axios.get('/api/loadContentInteractions.php', payload);

      // console.log(">>>>>resp",resp.data)

      if (!resp.data.success) {
        throw new Error(resp.data.message)
      }
      return {
        stateVariables: resp.data.stateVariables,
        variant: resp.data.variant
      }
    } catch (errMsg) {
      if (this.props.setIsInErrorState) {
        this.props.setIsInErrorState(true)
      }
      this.setState({ errMsg: errMsg.message })

      return null;
    }

  }

  //offscreen then postpone that one
  async updateRenderers(updateInstructions) {

    for (let instruction of updateInstructions) {

      if (instruction.instructionType === "updateRendererStates") {
        for (let { componentName, stateValues, rendererType, childrenInstructions } of instruction.rendererStatesToUpdate
        ) {

          this.props.updateRendererSVsWithRecoil({
            componentName,
            stateValues,
            childrenInstructions,
            sourceOfUpdate: instruction.sourceOfUpdate,
            baseStateVariable: this.rendererClasses?.[rendererType]?.baseStateVariable
          })
          this.rendererStateValues[componentName] = stateValues;

        }
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
  //       contentId: this.CID,
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


  // console.log(">>>>recordSolutionView")
  async recordSolutionView({ itemNumber, scoredComponent, messageId }) {

    const resp = await axios.post('/api/reportSolutionViewed.php', {
      doenetId: this.props.doenetId,
      itemNumber,
      attemptNumber: this.attemptNumber,
    });

    // TODO: check if student was actually allowed to view solution.

    // console.log('reportSolutionViewed-->>>>',resp.data);

    this.coreWorker.postMessage({
      messageType: "allowSolutionView",
      args: { allowView: true, message: "", scoredComponent, messageId }
    })

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
      variant: JSON.stringify(this.coreInfo.generatedVariantInfo, serializedComponentsReplacer),
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


  render() {

    if (this.state.errMsg !== null) {
      let errorIcon = <span style={{ fontSize: "1em", color: "#C1292E" }}><FontAwesomeIcon icon={faExclamationCircle} /></span>
      return <div style={{ fontSize: "1.3em", marginLeft: "20px", marginTop: "20px" }}>{errorIcon} {this.state.errMsg}</div>
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


    if (typeof this.props.doenetML === "string" && !this.props.CID) {
      //*** Define this.CID if not prop
      this.doenetML = this.props.doenetML;
      if (this.doenetML !== this.state.doenetML) {
        this.needNewCoreFlag = true;
        delete this.coreInfo;
        this.coreCreated = false;

        // repeat code from this.needNewCoreFlag, below,
        // as need to execute it after the promise from getting the CID is resolved
        CIDFromDoenetML(this.props.doenetML)
          .then(CID => {
            this.CID = CID;
            this.loadState().then(createCoreInfo => {
              if (createCoreInfo) {
                this.createCore(createCoreInfo)
              }
            })
          })

        return null;

      }
    } else if (!this.props.doenetML && this.props.CID) {
      //*** Define this.doenetML if not prop
      this.CID = this.props.CID;
      //If CID is different load the corresponding CID
      if (this.CID !== this.state.CID) {
        this.needNewCoreFlag = true;
      }

    } else if (this.props.doenetML && this.props.CID) {
      //*** Have this.doenetML and this.CID if not prop
      this.doenetML = this.props.doenetML;
      this.CID = this.props.CID;

      //Content changed, so need new core
      if (this.CID !== this.state.CID) {
        this.needNewCoreFlag = true;
      }
    }

    if (this.attemptNumber !== this.state.attemptNumber) {
      //TODO: Change attempt number without needing a new core
      this.needNewCoreFlag = true;
    }


    if (this.needNewCoreFlag) {
      delete this.coreInfo;
      this.coreCreated = false;
      this.loadState().then(createCoreInfo => {
        if (createCoreInfo) {
          this.createCore(createCoreInfo)
        }
      })
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
  const updateRendererSVsWithRecoil = useRecoilCallback(({ snapshot, set }) => async ({
    componentName, stateValues, childrenInstructions, sourceOfUpdate, baseStateVariable
  }) => {
    // stateVariables = JSON.parse(JSON.stringify(stateVariables))
    // stateVariables = JSON.stringify(stateVariables, serializedComponentsReplacer)
    // stateVariables = JSON.parse(JSON.stringify(stateVariables, serializedComponentsReplacer), serializedComponentsReviver)

    // let stateVariables2 = JSON.stringify(stateVariables)

    // console.log(">>>>{componentName,stateVariables}",{componentName,stateVariables})

    let ignoreUpdate = false;

    if (baseStateVariable) {

      let sourceActionId = sourceOfUpdate?.sourceInformation?.[componentName]?.actionId;

      let updatesToIgnore = snapshot.getLoadable(rendererUpdatesToIgnore(componentName)).contents;

      if (Object.keys(updatesToIgnore).length > 0) {
        let valueFromRenderer = updatesToIgnore[sourceActionId];
        let valueFromCore = stateValues[baseStateVariable];
        if (valueFromRenderer === valueFromCore
          || (
            Array.isArray(valueFromRenderer)
            && Array.isArray(valueFromCore)
            && valueFromRenderer.length == valueFromCore.length
            && valueFromRenderer.every((v, i) => valueFromCore[i] === v)
          )
        ) {
          // console.log(`ignoring update of ${componentName} to ${valueFromCore}`)
          ignoreUpdate = true;
          set(rendererUpdatesToIgnore(componentName), was => {
            let newUpdatesToIgnore = { ...was };
            delete newUpdatesToIgnore[sourceActionId];
            return newUpdatesToIgnore;
          })

        } else {
          // since value was change from the time the update was created
          // don't ignore the remaining pending changes in updatesToIgnore
          // as we changed the state used to determine they could be ignored
          set(rendererUpdatesToIgnore(componentName), {});
        }
      }
    }

    let newRendererState = { stateValues, childrenInstructions, sourceOfUpdate, ignoreUpdate };

    if (childrenInstructions === undefined) {
      let previousRendererState = snapshot.getLoadable(rendererState(componentName)).contents;
      newRendererState.childrenInstructions = previousRendererState.childrenInstructions;
    }

    set(rendererState(componentName), newRendererState)

  })
  const updateRendererUpdatesToIgnore = useRecoilCallback(({ snapshot, set }) => async ({ componentName, baseVariableValue, actionId }) => {

    // add to updates to ignore so don't apply change again
    // if it comes back from core without any changes
    // (possibly after a delay)
    set(rendererUpdatesToIgnore(componentName), was => {
      let newUpdatesToIgnore = { ...was };
      newUpdatesToIgnore[actionId] = baseVariableValue;
      return newUpdatesToIgnore;
    })

  })

  let newProps = { ...props, toast, updateRendererSVsWithRecoil, updateRendererUpdatesToIgnore }
  return <ErrorBoundary><DoenetViewerChild {...newProps} /></ErrorBoundary>
}

export default DoenetViewer;



export async function renderersloadComponent(promises, rendererClassNames) {

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


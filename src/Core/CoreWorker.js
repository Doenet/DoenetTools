import Core from './Core';
import { CIDFromDoenetML } from './utils/cid';
import me from 'math-expressions';
import { retrieveDoenetMLForCID } from './utils/retrieveDoenetML';
import { get as idb_get, set as idb_set } from 'idb-keyval';
import { serializedComponentsReplacer, serializedComponentsReviver } from './utils/serializedStateProcessing';
import axios from 'axios';

let core;

let queuedRequestActions = [];

onmessage = function (e) {

  if (e.data.messageType === "createCore") {

    let doenetML = e.data.args.doenetML;
    let CID = e.data.args.CID;


    // compare with undefined as doenetML could be empty string
    if (doenetML !== undefined) {
      if (CID) {
        // check to see if doenetML matches CID
        CIDFromDoenetML(doenetML)
          .then(calcCID => {
            if (calcCID === CID) {
              loadStateAndCreateCore(e.data.args);
            } else {
              postMessage({
                messageType: "inErrorState",
                args: {
                  errMsg: `doenetML did not match specified CID: ${CID}`
                }
              })
            }
          })
      } else {
        // if have doenetML and no CID, then calculate CID
        CIDFromDoenetML(doenetML)
          .then(CID => {
            let args = { ...e.data.args };
            args.CID = CID;
            loadStateAndCreateCore(args);
          })
      }
    } else {
      // if don't have doenetML, then return doenetML from CID
      // before creating core

      let CID = e.data.args.CID;

      retrieveDoenetMLForCID(CID)
        .then(doenetML => {
          let args = { ...e.data.args };
          args.doenetML = doenetML;
          loadStateAndCreateCore(args);
        })
        .catch(e => {
          postMessage({
            messageType: "inErrorState",
            args: {
              errMsg: `doenetML not found for CID: ${CID}`
            }
          })
        })
    }


  } else if (e.data.messageType === "requestAction") {
    if (core?.initialized) {
      // setTimeout(() => core.requestAction(e.data.args), 1000)
      core.requestAction(e.data.args)
    } else {
      queuedRequestActions.push(e.data.args);
    }
  } else if (e.data.messageType === "returnAllStateVariables") {
    console.log('all components')
    console.log(core._components)
    returnAllStateVariables(core).then(componentsObj => {
      postMessage({
        messageType: "returnAllStateVariables",
        args: componentsObj
      })
    });
  }
}


async function loadStateAndCreateCore({ coreId, userId, doenetML, CID, doenetId,
  flags, requestedVariantIndex, attemptNumber }) {

  let newFlags = { ...flags };

  // if userId is specified,
  // turn off flags to allow local page state and saving page state
  if (userId) {
    newFlags.allowLocalPageState = false;
    newFlags.allowSavePageState = false;
  } else if (newFlags.allowSavePageState) {
    // allowSavePageState implies allowLoadPageState
    newFlags.allowLoadPageState = true;
  }


  let coreState, requestedVariant;

  if (newFlags.allowLocalPageState) {

    let localInfo;
    
    try {
      localInfo = await idb_get(`${CID}|${doenetId}|${attemptNumber}`);
    } catch (e) {
      // ignore error
    }

    if (localInfo) {

      if (newFlags.allowSavePageState) {
        // attempt to save local info to database,
        // reseting data to that from database if it has changed since last save

        let result = await saveLoadedLocalStateToDatabase({ CID, doenetId, attemptNumber, localInfo });

        if (result.changedOnDevice) {
          if (result.newCID !== CID || result.newAttemptNumber !== attemptNumber) {
            // can't handle changes in CID or attemptNumber locally,
            // so send message and quit
            postMessage({
              messageType: "resetCore",
              args: {
                changedOnDevice: result.changedOnDevice,
                newCID: result.newCID,
                newAttemptNumber: result.newAttemptNumber,
              }
            });
            return;
          }

          // if just the localInfo changed, use that instead
          localInfo = result.newLocalInfo;
          postMessage({
            messageType: `Reverted page to state saved on device ${result.changedOnDevice}`,
            args: {
              message: data.message,
              toastType: toastType.ERROR
            }
          });

        }
      }


      postMessage({
        messageType: "initializeRenderers",
        args: {
          rendererState: localInfo.rendererState,
          coreInfo: localInfo.coreInfo,
        }
      });

      coreState = localInfo.coreState;
      requestedVariant = JSON.parse(localInfo.coreInfo.generatedVariantString, serializedComponentsReviver);

    }
  }

  if (!coreState) {
    // if didn't load core state from local storage, try to load from database

    // even if allowLoadPageState is false,
    // still call loadPageState, in which case it will only retrieve the initial page state


    const payload = {
      params: {
        CID,
        attemptNumber,
        doenetId,
        userId,
        requestedVariantIndex,
        allowLoadPageState: newFlags.allowLoadPageState,
      }
    }

    try {
      let resp = await axios.get('/api/loadPageState.php', payload);

      // console.log(">>>>>resp",resp.data)

      if (!resp.data.success) {
        if(newFlags.allowLoadPageState) {
          postMessage({
            messageType: "inErrorState",
            args: {
              errMsg: `Error loading page state: ${resp.data.message}`
            }
          });
          return;
        } else {
          // ignore this error if didn't allow loading of page state
          
        }

      }

      if (resp.data.loadState) {
        let coreInfo = JSON.parse(resp.data.coreInfo, serializedComponentsReviver);
        let rendererState = JSON.parse(resp.data.rendererState, serializedComponentsReviver);
        coreState = JSON.parse(resp.data.coreState, serializedComponentsReviver);
        requestedVariant = JSON.parse(coreInfo.generatedVariantString, serializedComponentsReviver);

        postMessage({
          messageType: "initializeRenderers",
          args: {
            rendererState,
            coreInfo,
          }
        });


      }


    } catch (e) {

      if(newFlags.allowLoadPageState) {
        postMessage({
          messageType: "inErrorState",
          args: {
            errMsg: `Error loading page state: ${e.message}`
          }
        });
        return;
      } else {
        // ignore this error if didn't allow loading of page state
        
      }

     
    }

  }

  createCore({
    coreId, userId, doenetML, CID, doenetId,
    flags: newFlags,
    requestedVariant,
    requestedVariantIndex, attemptNumber,
    stateVariableChanges: coreState
  });
}

async function saveLoadedLocalStateToDatabase({ CID, doenetId, attemptNumber, localInfo }) {

  let serverSaveId = await idb_get(`${CID}|${doenetId}|${attemptNumber}ServerSaveId`);

  let pageStateToBeSavedToDatabase = {
    CID,
    coreInfo: JSON.stringify(localInfo.coreInfo, serializedComponentsReplacer),
    coreState: JSON.stringify(localInfo.coreState, serializedComponentsReplacer),
    rendererState: JSON.stringify(localInfo.rendererState, serializedComponentsReplacer),
    attemptNumber,
    doenetId,
    saveId: localInfo.saveId,
    serverSaveId
  }

  let resp;

  try {
    resp = await axios.post('/api/savePageState.php', pageStateToBeSavedToDatabase);
  } catch (e) {
    // since this is initial load, don't show error message
    return { localInfo, CID, attemptNumber };
  }

  let data = resp.data;
  
  if (!data.success) {
    // since this is initial load, don't show error message
    return { localInfo, CID, attemptNumber };
  }

  idb_set(
    `${CID}|${doenetId}|${attemptNumber}ServerSaveId`,
    data.saveId
  )

  if (data.stateOverwritten) {
    let newLocalInfo = {
      coreState: JSON.parse(data.coreState, serializedComponentsReviver),
      rendererState: JSON.parse(data.rendererState, serializedComponentsReviver),
      coreInfo: JSON.parse(data.coreInfo, serializedComponentsReviver),
      saveId: data.saveId,
    }
    idb_set(
      `${data.CID}|${doenetId}|${data.attemptNumber}`,
      newLocalInfo
    );

    return {
      changedOnDevice: data.device,
      newLocalInfo,
      newCID: data.CID,
      newAttemptNumber: data.attemptNumber,
    }
  } else {
    return { localInfo, CID, attemptNumber };
  }


}


async function createCore(args) {

  // userId is typically undefined unless attempting to look up
  // state from another user

  // if (core) {
  //   // console.log('already have a core.  Refusing to create another one');
  //   // return;
  //   //TODO: Investigate for memory leaks
  // }

  // setTimeout(() => {
  //   core = new Core(args)
  //   core.getInitializedPromise().then(() => {
  //     console.log('actions to process', queuedRequestActions)
  //     for (let action of queuedRequestActions) {
  //       core.requestAction(action);
  //     }
  //     queuedRequestActions = [];
  //   })
  // }, 10000)
  core = new Core(args)
  core.getInitializedPromise().then(() => {
    // console.log('actions to process', queuedRequestActions)
    for (let action of queuedRequestActions) {
      core.requestAction(action);
    }
    queuedRequestActions = [];
  })


}


async function returnAllStateVariables(core) {
  let componentsObj = {};
  for (let componentName in core.components) {
    let component = core.components[componentName];
    let compObj = componentsObj[componentName] = {
      componentName,
      componentType: component.componentType,
      stateValues: {}
    }
    for (let vName in component.state) {
      compObj.stateValues[vName] = preprocessForPostMessage(await component.state[vName].value);
    }
    compObj.activeChildren = component.activeChildren.map(x => x.componentName ? x.componentName : x)
  }
  return componentsObj;
}

export function preprocessForPostMessage(value) {
  if (value instanceof me.class) {
    value = value.tree;
  } else if (typeof value === "function") {
    value = undefined;
  } else if (Array.isArray(value)) {
    value = value.map(x => preprocessForPostMessage(x))
  } else if (typeof value === "object" && value !== null) {
    let valueCopy = {}
    for (let key in value) {
      valueCopy[key] = preprocessForPostMessage(value[key]);
    }
    value = valueCopy;
  }
  return value;
}


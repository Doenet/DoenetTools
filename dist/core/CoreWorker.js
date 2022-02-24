import Core from './Core.js';
import { CIDFromDoenetML } from './utils/cid.js';
import me from '../_snowpack/pkg/math-expressions.js';
import { retrieveDoenetMLForCID } from './utils/retrieveDoenetML.js';

let core;

let queuedRequestActions = [];

onmessage = function (e) {

  if (e.data.messageType === "createCore") {

    console.log('create core', e.data.args);

    if (e.data.args.doenetML) {
      // if have doenetML, then just create core using that
      createCore(e.data.args)
    } else {
      // if don't have doenetML, then return doenetML from CID
      // before creating core

      let CID = e.data.args.CID;

      retrieveDoenetMLForCID(CID)
        .then(doenetML => {
          let args = { ...e.data.args };
          args.doenetML = doenetML;
          createCore(args);
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

    //loadStateAndCreateCore(e.data.args);

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
  } else if (e.data.messageType === "allowSolutionView") {
    let messageId = e.data.args.messageId;
    let resolveRecordSolutionView = core.resolveRecordSolutionView[messageId];
    if (resolveRecordSolutionView) {
      resolveRecordSolutionView(e.data.args)
      delete core.resolveRecordSolutionView[messageId];
    }
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

  // this.setTimeout(() => {
  //   core = new Core(e.data.args)
  //   core.getInitializedPromise().then(() => {
  //     console.log('actions to process', queuedRequestActions)
  //     for (let action of queuedRequestActions) {
  //       core.requestAction(action);
  //     }
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


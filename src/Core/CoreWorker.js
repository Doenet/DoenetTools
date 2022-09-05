import Core from './Core';
import me from 'math-expressions';

let core;

let queuedRequestActions = [];

onmessage = function (e) {

  if (e.data.messageType === "createCore") {

    createCore(e.data.args);

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
  } else if (e.data.messageType === "visibilityChange") {
    core.handleVisibilityChange(e.data.args)
  } else if (e.data.messageType === "terminate") {
    core.terminate().then(() => {
      postMessage({ messageType: "terminated" });
    })
  } else if (e.data.messageType === "navigatingToComponent") {
    core.handleNavigatingToComponent(e.data.args.componentName)
  } else if (e.data.messageType === "submitAllAnswers") {
    core.requestAction({
      componentName: core.documentName,
      actionName: "submitAllAnswers",
      args: {}
    })
  }
}


async function createCore(args) {

  // console.log('createCore', args)

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

  // let tot = 0;
  // for(let i=0; i< 10; i++) {
  //   let sum = 0;
  //   for(let j=0; j< 5000000; j++) {
  //     sum += Math.sin(j);
  //   }
  //   tot += sum;
  //   console.log(`waiting to create core, ${i}=${tot}`);
  // }


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

  if (!core.components) {
    return {};
  }

  let componentsObj = {};
  for (let componentName in core.components) {
    let component = core.components[componentName];
    let compObj = componentsObj[componentName] = {
      componentName,
      componentType: component.componentType,
      stateValues: {}
    }
    for (let vName in component.state) {
      compObj.stateValues[vName] = removeFunctionsMathExpressionClass(await component.state[vName].value);
    }
    compObj.activeChildren = component.activeChildren.map(x => x.componentName ? { componentName: x.componentName, componentType: x.componentType } : x)
    if (component.replacements) {
      compObj.replacements = component.replacements.map(x => x.componentName ? { componentName: x.componentName, componentType: x.componentType } : x)
      if (component.replacementsToWithhold !== undefined) {
        compObj.replacementsToWithhold = component.replacementsToWithhold;
      }
    }
  }


  componentsObj[core.documentName].sharedParameters = removeFunctionsMathExpressionClass(core.components[core.documentName].sharedParameters);
  return componentsObj;
}

export function removeFunctionsMathExpressionClass(value) {
  if (value instanceof me.class) {
    value = value.tree;
  } else if (typeof value === "function") {
    value = undefined;
  } else if (Array.isArray(value)) {
    value = value.map(x => removeFunctionsMathExpressionClass(x))
  } else if (typeof value === "object" && value !== null) {
    let valueCopy = {}
    for (let key in value) {
      valueCopy[key] = removeFunctionsMathExpressionClass(value[key]);
    }
    value = valueCopy;
  }
  return value;
}


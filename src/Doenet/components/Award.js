import BaseComponent from './abstract/BaseComponent';

export default class Award extends BaseComponent {
  static componentType = "award";

  static previewSerializedComponent({ serializedComponent, sharedParameters, components }) {
    if (serializedComponent.children === undefined) {
      return;
    }

    let matchpartialInd;
    for (let [ind, child] of serializedComponent.children.entries()) {
      if (child.componentType === "matchpartial" || (
        child.createdComponent && components[child.componentName].componentType === "matchpartial"
      )) {
        matchpartialInd = ind;
        break;
      }
    }

    let symbolicequalityInd;
    for (let [ind, child] of serializedComponent.children.entries()) {
      if (child.componentType === "symbolicequality" || (
        child.createdComponent && components[child.componentName].componentType === "symbolicequality"
      )) {
        symbolicequalityInd = ind;
        break;
      }
    }

    let allowederrorinnumbersInd;
    for (let [ind, child] of serializedComponent.children.entries()) {
      if (child.componentType === "allowederrorinnumbers" || (
        child.createdComponent && components[child.componentName].componentType === "allowederrorinnumbers"
      )) {
        allowederrorinnumbersInd = ind;
        break;
      }
    }

    let includeerrorinnumberexponentsInd;
    for (let [ind, child] of serializedComponent.children.entries()) {
      if (child.componentType === "includeerrorinnumberexponents" || (
        child.createdComponent && components[child.componentName].componentType === "includeerrorinnumberexponents"
      )) {
        includeerrorinnumberexponentsInd = ind;
        break;
      }
    }

    let allowederrorisabsoluteInd;
    for (let [ind, child] of serializedComponent.children.entries()) {
      if (child.componentType === "allowederrorisabsolute" || (
        child.createdComponent && components[child.componentName].componentType === "allowederrorisabsolute"
      )) {
        allowederrorisabsoluteInd = ind;
        break;
      }
    }

    let splitintooptionsInd;
    for (let [ind, child] of serializedComponent.children.entries()) {
      if (child.componentType === "splitintooptions" || (
        child.createdComponent && components[child.componentName].componentType === "splitintooptions"
      )) {
        splitintooptionsInd = ind;
        break;
      }
    }


    let nsignerrorsmatchedInd;
    for (let [ind, child] of serializedComponent.children.entries()) {
      if (child.componentType === "nsignerrorsmatched" || (
        child.createdComponent && components[child.componentName].componentType === "nsignerrorsmatched"
      )) {
        nsignerrorsmatchedInd = ind;
        break;
      }
    }

    let creationInstructions = [];

    if (matchpartialInd !== undefined) {
      creationInstructions.push({ createChildren: [matchpartialInd] });
    }
    if (symbolicequalityInd !== undefined) {
      creationInstructions.push({ createChildren: [symbolicequalityInd] });
    }
    if (allowederrorinnumbersInd !== undefined) {
      creationInstructions.push({ createChildren: [allowederrorinnumbersInd] });
    }
    if (includeerrorinnumberexponentsInd !== undefined) {
      creationInstructions.push({ createChildren: [includeerrorinnumberexponentsInd] });
    }
    if (allowederrorisabsoluteInd !== undefined) {
      creationInstructions.push({ createChildren: [allowederrorisabsoluteInd] });
    }
    if (splitintooptionsInd !== undefined) {
      creationInstructions.push({ createChildren: [splitintooptionsInd] });
    }
    if (nsignerrorsmatchedInd !== undefined) {
      creationInstructions.push({ createChildren: [nsignerrorsmatchedInd] });
    }
    creationInstructions.push({ callMethod: "setupComparisonParameters" })

    return creationInstructions;

  }


  static setupComparisonParameters({ sharedParameters, definingChildrenSoFar, serializedComponent }) {

    let matchpartialChild;
    for (let child of definingChildrenSoFar) {
      if (child !== undefined && child.componentType === "matchpartial") {
        matchpartialChild = child;
        break;
      }
    }

    if (matchpartialChild !== undefined) {
      // have a matchpartial child, so will get matchpartial from that child
      // once it is resolved
      sharedParameters.matchpartialChild = matchpartialChild;
    } else if (serializedComponent.state !== undefined && "matchpartial" in serializedComponent.state) {
      // matchpartial was specified directly via essential state variable
      sharedParameters.matchpartial = serializedComponent.state.matchpartial;
    }


    let symbolicequalityChild;
    for (let child of definingChildrenSoFar) {
      if (child !== undefined && child.componentType === "symbolicequality") {
        symbolicequalityChild = child;
        break;
      }
    }

    if (symbolicequalityChild !== undefined) {
      // have a symbolicequality child, so will get symbolicequality from that child
      // once it is resolved
      sharedParameters.symbolicequalityChild = symbolicequalityChild;
    } else if (serializedComponent.state !== undefined && "symbolicequality" in serializedComponent.state) {
      // symbolicequality was specified directly via essential state variable
      sharedParameters.symbolicequality = serializedComponent.state.symbolicequality;
    }

    let allowederrorinnumbersChild;
    for (let child of definingChildrenSoFar) {
      if (child !== undefined && child.componentType === "allowederrorinnumbers") {
        allowederrorinnumbersChild = child;
        break;
      }
    }

    if (allowederrorinnumbersChild !== undefined) {
      // have a allowederrorinnumbers child, so will get allowederrorinnumbers from that child
      // once it is resolved
      sharedParameters.allowederrorinnumbersChild = allowederrorinnumbersChild;
    } else if (serializedComponent.state !== undefined && "allowederrorinnumbers" in serializedComponent.state) {
      // allowederrorinnumbers was specified directly via essential state variable
      sharedParameters.allowederrorinnumbers = serializedComponent.state.allowederrorinnumbers;
    }

    let includeerrorinnumberexponentsChild;
    for (let child of definingChildrenSoFar) {
      if (child !== undefined && child.componentType === "includeerrorinnumberexponents") {
        includeerrorinnumberexponentsChild = child;
        break;
      }
    }

    if (includeerrorinnumberexponentsChild !== undefined) {
      // have a includeerrorinnumberexponents child, so will get includeerrorinnumberexponents from that child
      // once it is resolved
      sharedParameters.includeerrorinnumberexponentsChild = includeerrorinnumberexponentsChild;
    } else if (serializedComponent.state !== undefined && "includeerrorinnumberexponents" in serializedComponent.state) {
      // includeerrorinnumberexponents was specified directly via essential state variable
      sharedParameters.includeerrorinnumberexponents = serializedComponent.state.includeerrorinnumberexponents;
    }

    let allowederrorisabsoluteChild;
    for (let child of definingChildrenSoFar) {
      if (child !== undefined && child.componentType === "allowederrorisabsolute") {
        allowederrorisabsoluteChild = child;
        break;
      }
    }

    if (allowederrorisabsoluteChild !== undefined) {
      // have a allowederrorisabsolute child, so will get allowederrorisabsolute from that child
      // once it is resolved
      sharedParameters.allowederrorisabsoluteChild = allowederrorisabsoluteChild;
    } else if (serializedComponent.state !== undefined && "allowederrorisabsolute" in serializedComponent.state) {
      // allowederrorisabsolute was specified directly via essential state variable
      sharedParameters.allowederrorisabsolute = serializedComponent.state.allowederrorisabsolute;
    }

    let splitintooptionsChild;
    for (let child of definingChildrenSoFar) {
      if (child !== undefined && child.componentType === "splitintooptions") {
        splitintooptionsChild = child;
        break;
      }
    }

    if (splitintooptionsChild !== undefined) {
      // have a splitintooptions child, so will get splitintooptions from that child
      // once it is resolved
      sharedParameters.splitintooptionsChild = splitintooptionsChild;
    } else if (serializedComponent.state !== undefined && "splitintooptions" in serializedComponent.state) {
      // splitintooptions was specified directly via essential state variable
      sharedParameters.splitintooptions = serializedComponent.state.splitintooptions;
    }

    let nsignerrorsmatchedChild;
    for (let child of definingChildrenSoFar) {
      if (child !== undefined && child.componentType === "nsignerrorsmatched") {
        nsignerrorsmatchedChild = child;
        break;
      }
    }

    if (nsignerrorsmatchedChild !== undefined) {
      // have a nsignerrorsmatched child, so will get nsignerrorsmatched from that child
      // once it is resolved
      sharedParameters.nsignerrorsmatchedChild = nsignerrorsmatchedChild;
    } else if (serializedComponent.state !== undefined && "nsignerrorsmatched" in serializedComponent.state) {
      // nsignerrorsmatched was specified directly via essential state variable
      sharedParameters.nsignerrorsmatched = serializedComponent.state.nsignerrorsmatched;
    }


  }

  static createPropertiesObject() {
    return {
      credit: { default: 1 },
      matchpartial: { default: false },
      symbolicequality: { default: false },
      allowederrorinnumbers: { default: 0 },
      includeerrorinnumberexponents: { default: false },
      allowederrorisabsolute: { default: false },
      splitintooptions: { default: false },
      nsignerrorsmatched: { default: 0 },
      feedbackcode: { default: undefined },
      feedbacktext: { default: undefined },
    };
  }

  static returnChildLogic({ standardComponentTypes, allComponentClasses, components }) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    let exactlyOneIf = childLogic.newLeaf({
      name: "exactlyOneIf",
      componentType: 'if',
      number: 1
    });

    let exactlyOneString = childLogic.newLeaf({
      name: "exactlyOneString",
      componentType: 'string',
      number: 1
    });

    let exactlyOneMath = childLogic.newLeaf({
      name: "exactlyOneMath",
      componentType: 'math',
      number: 1
    });

    let exactlyOneText = childLogic.newLeaf({
      name: "exactlyOneText",
      componentType: 'text',
      number: 1
    });

    childLogic.newOperator({
      name: "ifXorStringXorMathXorText",
      operator: 'xor',
      propositions: [exactlyOneIf, exactlyOneString, exactlyOneMath, exactlyOneText],
      setAsBase: true,
    });

    return childLogic;
  }

  updateState(args = {}) {
    if (args.init === true) {
      this.makePublicStateVariable({
        variableName: "awarded",
        componentType: "boolean"
      });

      this.makePublicStateVariableArray({
        variableName: "feedback",
        componentType: "feedback",
        returnSerializedComponents: returnSerializedComponentsFeedback,
        emptyForOutOfBounds: true,
      });

      if (this._state.awarded.essential !== true) {
        this.state.awarded = false;
        this._state.awarded.essential = true;
      }

      if (!(this._state.justSubmitted && this._state.justSubmitted.essential)) {
        this.state.justSubmitted = false;
      }
      this._state.justSubmitted.trackChanges = true;
      this._state.justSubmitted.essential = true;
    }

    super.updateState(args);

    if (!this.childLogicSatisfied) {
      this.unresolvedState.awarded = true;
      return;
    }

    delete this.unresolvedState.awarded;


    // override default splitintooptions from shared parameters
    if (this._state.splitintooptions.usedDefault) {
      let splitintooptionsChild = this.sharedParameters.splitintooptionsChild;
      if (splitintooptionsChild) {
        if (splitintooptionsChild.unresolvedState.value) {
          this.unresolvedState.splitintooptions = true;
          return;
        }
        this.state.splitintooptions = splitintooptionsChild.state.value;
      } else if (this.sharedParameters.splitintooptions) {
        this.state.splitintooptions = this.sharedParameters.splitintooptions;
      }
      delete this.unresolvedState.splitintooptions;
      // delete usedDefault so logic isn't repeated
      delete this._state.splitintooptions.usedDefault;
    }


    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged) {
      this.state.incomplete = false;
      let exactlyOneString = this.childLogic.returnMatches("exactlyOneString");
      if (exactlyOneString.length === 1) {
        this.state.childForIncomplete = this.activeChildren[exactlyOneString[0]];
        this.state.incomplete = true;
        this.state.incompleteType = "string";
      } else {
        let exactlyOneMath = this.childLogic.returnMatches("exactlyOneMath");
        if (exactlyOneMath.length === 1) {
          this.state.childForIncomplete = this.activeChildren[exactlyOneMath[0]];
          this.state.incomplete = true;
          this.state.incompleteType = "math";
        } else {
          let exactlyOneText = this.childLogic.returnMatches("exactlyOneText");
          if (exactlyOneText.length === 1) {
            this.state.childForIncomplete = this.activeChildren[exactlyOneText[0]];
            this.state.incomplete = true;
            this.state.incompleteType = "text";
          }
        }
      }

      if (this.state.incomplete) {
        return;
      }

      delete this.state.childForIncomplete;
      delete this.state.incompleteType;

      this.state.ifChild = this.activeChildren[this.childLogic.returnMatches("exactlyOneIf")];

    }

    if (this.state.incomplete) {
      return;
    }

    if (this.state.feedbacktext === undefined) {
      let feedback = this.constructor.standardizedFeedback[this.state.feedbackcode];
      if (feedback === undefined) {
        this.state.feedback = [];
      } else {
        this.state.feedback = [feedback];
      }
    } else {
      this.state.feedback = [this.state.feedbacktext];
    }

    let justSubmitted = true;
    if (args.sourceOfUpdate !== undefined) {
      justSubmitted = false;
      let instructionsForThisComponent = args.sourceOfUpdate.instructionsByComponent[this.componentName];
      if (instructionsForThisComponent !== undefined) {
        if (instructionsForThisComponent.variableUpdates.justSubmitted !== undefined) {
          justSubmitted = instructionsForThisComponent.variableUpdates.justSubmitted.changes;
        }
      } else if (Object.keys(args.sourceOfUpdate.instructionsByComponent).length === 1) {
        let val = Object.values(args.sourceOfUpdate.instructionsByComponent)[0];
        let variableUpdates = val.variableUpdates;
        if (Object.keys(variableUpdates).length === 1 && Object.keys(variableUpdates)[0] === "rendererValueAsSubmitted") {
          // if only change was changing renderedValueAsSubmitted on some component
          // the don't change this.state.justSubmitted
          // (which we accomplish by setting justSubmitted to true)
          justSubmitted = true;
        }
      }
    }

    if (!justSubmitted || !this.state.ifChild.state.justSubmitted) {
      this.state.justSubmitted = false;
    }

  }

  determineCredit() {

    let fractionsatisfied = this.state.ifChild.evaluateLogic();
    let creditachieved = 0;
    if (Number.isFinite(this.state.credit)) {
      creditachieved = Math.max(0, Math.min(1, this.state.credit)) * Math.max(0, Math.min(1, fractionsatisfied));
    }
    return {
      fractionsatisfied: fractionsatisfied,
      creditachieved: creditachieved
    }

  }

  adapters = ["awarded"];


  allowDownstreamUpdates(status) {
    // don't allow non-initial changes
    return (status.initialChange === true);
  }

  get variablesUpdatableDownstream() {
    return ["awarded", "justSubmitted"];
  }

  calculateDownstreamChanges({ stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate }) {

    let newStateVariables = {};
    if ("awarded" in stateVariablesToUpdate) {
      newStateVariables.awarded = stateVariablesToUpdate.awarded;
    }
    if ("justSubmitted" in stateVariablesToUpdate) {
      newStateVariables.justSubmitted = stateVariablesToUpdate.justSubmitted;
    }
    let shadowedResult = this.updateShadowSources({
      newStateVariables: newStateVariables,
      dependenciesToUpdate: dependenciesToUpdate,
    });
    let shadowedStateVariables = shadowedResult.shadowedStateVariables;
    let isReplacement = shadowedResult.isReplacement;

    for (let varname in newStateVariables) {
      if (this._state[varname].essential === true &&
        !shadowedStateVariables.has(varname)// && !isReplacement
      ) {
        stateVariableChangesToSave[varname] = newStateVariables[varname];
      }
    }

    return true;

  }

  static standardizedFeedback = {
    'numericalerror': `Credit reduced because numbers in your answer weren't quite right.  Did you round too much?`,
    'goodjob': `Good job!`,
    'onesignerror': `Credit reduced because it appears that you made a sign error.`,
    'twosignerrors': `Credit reduced because it appears that you made two sign errors.`,
  }

}



// return the JSON representing the portion of array determined by the given propChildren
function returnSerializedComponentsFeedback({
  stateVariable, variableName,
  propChildren, propName,
  componentName,
}) {

  if (stateVariable.value.length === 0) {
    return [];
  }

  return [{
    componentType: "feedback",
    children: [
      {
        componentType: "if",
        children: [
          {
            componentType: "ref",
            children: [
              {
                componentType: "prop",
                state: { variableName: "awarded" }
              },
              {
                componentType: "reftarget",
                state: { refTargetName: componentName }
              }
            ]
          }
        ]
      },
      {
        componentType: "string",
        state: { value: stateVariable.value[0] }
      }
    ],
    downstreamDependencies: {
      [componentName]: {
        dependencyType: "referenceShadow",
        prop: propName,
      }
    },
  }]

}

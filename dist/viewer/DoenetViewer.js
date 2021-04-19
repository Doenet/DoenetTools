import React, {Component} from "../_snowpack/pkg/react.js";
import Core from "./core.js";
import axios from "../_snowpack/pkg/axios.js";
import sha256 from "../_snowpack/pkg/crypto-js/sha256.js";
import CryptoJS from "../_snowpack/pkg/crypto-js.js";
import me from "../_snowpack/pkg/math-expressions.js";
export function serializedComponentsReplacer(key, value) {
  if (value !== value) {
    return {objectType: "special-numeric", stringValue: "NaN"};
  } else if (value === Infinity) {
    return {objectType: "special-numeric", stringValue: "Infinity"};
  } else if (value === -Infinity) {
    return {objectType: "special-numeric", stringValue: "-Infinity"};
  }
  return value;
}
let nanInfinityReviver = function(key, value) {
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
};
export function serializedComponentsReviver(key, value) {
  return me.reviver(key, nanInfinityReviver(key, value));
}
class DoenetViewer extends Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.coreReady = this.coreReady.bind(this);
    this.createCore = this.createCore.bind(this);
    this.haveDoenetML = this.haveDoenetML.bind(this);
    this.loadState = this.loadState.bind(this);
    this.loadDoenetML = this.loadDoenetML.bind(this);
    this.localStateChanged = this.localStateChanged.bind(this);
    this.submitResponse = this.submitResponse.bind(this);
    this.recordSolutionView = this.recordSolutionView.bind(this);
    this.recordEvent = this.recordEvent.bind(this);
    this.rendererUpdateMethods = {};
    this.cumulativeStateVariableChanges = {};
    this.attemptNumber = props.attemptNumber;
    if (this.attemptNumber === void 0) {
      this.attemptNumber = 1;
    }
    this.assignmentId = props.assignmentId;
    this.requestedVariant = props.requestedVariant;
    if (this.requestedVariant === void 0) {
      this.requestedVariant = {index: 0};
    }
    this.documentRenderer = /* @__PURE__ */ React.createElement(React.Fragment, null, "Loading...");
    if (props.contentId === void 0) {
      let doenetML = props.doenetML;
      this.contentId = sha256(JSON.stringify(doenetML)).toString(CryptoJS.enc.Hex);
      this.haveDoenetML({contentId: this.contentId, doenetML});
    } else {
      this.contentId = props.contentId;
      this.loadDoenetML(props.contentId, this.haveDoenetML);
    }
  }
  haveDoenetML({contentId, doenetML}) {
    this.contentId = contentId;
    this.doenetML = doenetML;
    this.loadState(this.createCore);
  }
  createCore({stateVariables, variant}) {
    if (stateVariables === void 0) {
      console.error(`error loading state variables`);
      this.cumulativeStateVariableChanges = null;
      variant = null;
    } else {
      this.cumulativeStateVariableChanges = JSON.parse(stateVariables, serializedComponentsReviver);
    }
    if (variant !== null) {
      this.requestedVariant = JSON.parse(variant, serializedComponentsReviver);
    }
    this.core = new Core({
      coreReadyCallback: this.coreReady,
      coreUpdatedCallback: this.update,
      doenetML: this.doenetML,
      externalFunctions: {
        localStateChanged: this.localStateChanged,
        submitResponse: this.submitResponse,
        recordSolutionView: this.recordSolutionView,
        recordEvent: this.recordEvent
      },
      flags: this.props.flags,
      requestedVariant: this.requestedVariant
    });
  }
  coreReady() {
    this.resultingVariant = this.core.document.state.selectedVariantInfo.value;
    if (this.cumulativeStateVariableChanges) {
      let nFailures = Infinity;
      while (nFailures > 0) {
        let result = this.core.executeUpdateStateVariables({
          newStateVariableValues: this.cumulativeStateVariableChanges
        });
        if (!(result.nFailures && result.nFailures < nFailures)) {
          break;
        }
        nFailures = result.nFailures;
      }
    } else {
      this.cumulativeStateVariableChanges = {};
    }
    if (this.assignmentId && !this.props.ignoreDatabase) {
      const payload = {
        weights: this.core.scoredItemWeights,
        contentId: this.contentId,
        assignmentId: this.assignmentId,
        attemptNumber: this.attemptNumber
      };
      console.log("core ready payload:", payload);
      axios.post("/api/saveAssignmentWeights.php", payload).then((resp) => {
        console.log("saveAssignmentWeights-->>", resp.data);
      });
    }
    let renderPromises = [];
    let rendererClassNames = [];
    console.log("rendererTypesInDocument");
    console.log(this.core.rendererTypesInDocument);
    for (let rendererClassName of this.core.rendererTypesInDocument) {
      rendererClassNames.push(rendererClassName);
      console.log(`>>>dynamic import '${rendererClassName}'`);
      renderPromises.push(import(`./renderers/${rendererClassName}.js`));
    }
    renderersloadComponent(renderPromises, rendererClassNames).then((rendererClasses) => {
      this.rendererClasses = rendererClasses;
      let documentComponentInstructions = this.core.renderedComponentInstructions[this.core.documentName];
      let documentRendererClass = this.rendererClasses[documentComponentInstructions.rendererType];
      this.documentRenderer = React.createElement(documentRendererClass, {
        key: documentComponentInstructions.componentName,
        componentInstructions: documentComponentInstructions,
        rendererClasses: this.rendererClasses,
        rendererUpdateMethods: this.rendererUpdateMethods,
        flags: this.props.flags
      });
      this.forceUpdate();
    });
    if (this.props.onCoreReady) {
      this.props.onCoreReady();
    }
  }
  localStateChanged({
    newStateVariableValues,
    contentId,
    sourceOfUpdate,
    transient = false
  }) {
    if (transient || this.props.ignoreDatabase) {
      return;
    }
    for (let componentName in newStateVariableValues) {
      if (!this.cumulativeStateVariableChanges[componentName]) {
        this.cumulativeStateVariableChanges[componentName] = {};
      }
      for (let varName in newStateVariableValues[componentName]) {
        let cumValues = this.cumulativeStateVariableChanges[componentName][varName];
        if (typeof cumValues === "object" && cumValues !== null && cumValues.mergeObject) {
          Object.assign(cumValues, newStateVariableValues[componentName][varName]);
        } else {
          this.cumulativeStateVariableChanges[componentName][varName] = newStateVariableValues[componentName][varName];
        }
      }
    }
    let changeString = JSON.stringify(this.cumulativeStateVariableChanges, serializedComponentsReplacer);
    let variantString = JSON.stringify(this.resultingVariant, serializedComponentsReplacer);
    const phpUrl = "/api/recordContentInteraction.php";
    const data = {
      contentId,
      stateVariables: changeString,
      attemptNumber: this.attemptNumber,
      assignmentId: this.assignmentId,
      variant: variantString
    };
    axios.post(phpUrl, data).then((resp) => {
      console.log("save", resp.data);
    });
  }
  loadDoenetML(contentId, callback) {
    const loadFromContentIdUrl = "/api/loadFromContentId.php";
    const data = {
      contentId
    };
    axios.post(loadFromContentIdUrl, data).then((resp) => {
      if (callback) {
        callback({
          contentId,
          doenetML: resp.data.doenetML
        });
      }
    });
  }
  loadState(callback) {
    if (this.props.ignoreDatabase) {
      callback({
        stateVariables: null,
        variant: null
      });
      return;
    }
    const phpUrl = "/api/loadContentInteractions.php";
    const data = {
      contentId: this.contentId,
      attemptNumber: this.attemptNumber,
      assignmentId: this.assignmentId
    };
    const payload = {
      params: data
    };
    axios.get(phpUrl, payload).then((resp) => {
      console.log("load ci", resp.data);
      if (callback) {
        callback({
          stateVariables: resp.data.stateVariables,
          variant: resp.data.variant
        });
      }
    });
  }
  update(instructions) {
    for (let instruction of instructions) {
      if (instruction.instructionType === "updateStateVariable") {
        for (let componentName of instruction.renderersToUpdate.filter((x) => x in this.rendererUpdateMethods)) {
          this.rendererUpdateMethods[componentName].update({
            sourceOfUpdate: instruction.sourceOfUpdate
          });
        }
      } else if (instruction.instructionType === "addRenderer") {
        if (instruction.parentName in this.rendererUpdateMethods)
          this.rendererUpdateMethods[instruction.parentName].addChildren(instruction);
      } else if (instruction.instructionType === "deleteRenderers") {
        if (instruction.parentName in this.rendererUpdateMethods)
          this.rendererUpdateMethods[instruction.parentName].removeChildren(instruction);
      } else if (instruction.instructionType === "swapChildRenderers") {
        if (instruction.parentName in this.rendererUpdateMethods)
          this.rendererUpdateMethods[instruction.parentName].swapChildren(instruction);
      }
    }
  }
  submitResponse({
    itemNumber,
    itemCreditAchieved,
    callBack
  }) {
    if (this.assignmentId) {
      const payload = {
        assignmentId: this.assignmentId,
        attemptNumber: this.attemptNumber,
        credit: itemCreditAchieved,
        itemNumber
      };
      axios.post("/api/saveCreditForItem.php", payload).then((resp) => {
      });
    }
    callBack("submitResponse callback parameter");
  }
  recordSolutionView({itemNumber, scoredComponent, callBack}) {
    console.log(`reveal solution, ${itemNumber}`);
    if (this.assignmentId) {
      console.warn(`Need to record solution view in the database!!`);
      callBack({allowView: true, message: "", scoredComponent});
    } else {
      callBack({allowView: true, message: "", scoredComponent});
    }
  }
  recordEvent(event) {
    if (this.props.ignoreDatabase) {
      return;
    }
    const payload = {
      assignmentId: this.assignmentId,
      contentId: this.contentId,
      attemptNumber: this.attemptNumber,
      variant: JSON.stringify(this.resultingVariant, serializedComponentsReplacer),
      verb: event.verb,
      object: JSON.stringify(event.object, serializedComponentsReplacer),
      result: JSON.stringify(event.result, serializedComponentsReplacer),
      context: JSON.stringify(event.context, serializedComponentsReplacer),
      timestamp: event.timestamp,
      version: "0.1.0"
    };
    axios.post("/api/recordEvent.php", payload).then((resp) => {
    });
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
      console.log(error);
      console.error(`Error: loading ${rendererClassNames[index]} failed.`);
    }
  }
  return rendererClasses;
}

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
class DoenetViewerChild extends Component {
  constructor(props) {
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
    this.state = {
      doenetML: null,
      attemptNumber: null,
      contentId: null,
      errMsg: null
    };
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
      this.requestedVariantFromDatabase = true;
    }
    if (this.props.core) {
      this.core = new this.props.core({
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
        requestedVariant: this.requestedVariant
      });
    } else {
      this.core = new Core({
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
        requestedVariant: this.requestedVariant
      });
    }
  }
  coreReady() {
    this.generatedVariant = this.core.document.stateValues.generatedVariantInfo;
    this.allPossibleVariants = [...this.core.document.sharedParameters.allPossibleVariants];
    if (this.props.generatedVariantCallback) {
      this.props.generatedVariantCallback(this.generatedVariant, this.allPossibleVariants);
    }
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
    let renderPromises = [];
    let rendererClassNames = [];
    for (let rendererClassName of this.core.rendererTypesInDocument) {
      rendererClassNames.push(rendererClassName);
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
      this.needNewCoreFlag = false;
      this.setState({
        doenetML: this.doenetML,
        attemptNumber: this.attemptNumber,
        contentId: this.contentId
      });
    });
    if (this.props.onCoreReady) {
      this.props.onCoreReady();
    }
  }
  localStateChanged({
    newStateVariableValues,
    contentId: contentId2,
    sourceOfUpdate,
    transient = false
  }) {
    if (transient || !this.allowSavePageState && !this.allowLocalPageState) {
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
    let variantString = JSON.stringify(this.generatedVariant, serializedComponentsReplacer);
    const data = {
      contentId: contentId2,
      stateVariables: changeString,
      attemptNumber: this.attemptNumber,
      doenetId: this.props.doenetId,
      variant: variantString
    };
    if (this.allowLocalPageState) {
      localStorage.setItem(`${contentId2}${this.props.doenetId}${this.attemptNumber}`, JSON.stringify({stateVariables: changeString, variant: variantString}));
    }
    if (!this.allowSavePageState) {
      return;
    }
    axios.post("/api/recordContentInteraction.php", data);
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
      let stateVarVariant = JSON.parse(localStorage.getItem(`${this.contentId}${this.props.doenetId}${this.attemptNumber}`));
      let stateVariables = null;
      let variant = null;
      if (stateVarVariant) {
        stateVariables = stateVarVariant.stateVariables;
        variant = stateVarVariant.variant;
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
        doenetId: this.props.doenetId
      }
    };
    axios.get("/api/loadContentInteractions.php", payload).then((resp) => {
      if (!resp.data.success) {
        throw new Error(resp.data.message);
      }
      if (callback) {
        callback({
          stateVariables: resp.data.stateVariables,
          variant: resp.data.variant
        });
      }
    }).catch((errMsg) => {
      this.setState({errMsg: errMsg.message});
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
    if (this.allowSaveSubmissions && this.props.doenetId) {
      if (!this.weightsStored) {
        this.weightsStored = true;
        const payload1 = {
          weights: this.core.scoredItemWeights,
          contentId: this.contentId,
          doenetId: this.props.doenetId,
          attemptNumber: this.attemptNumber
        };
        axios.post("/api/saveAssignmentWeights.php", payload1);
      }
      const payload2 = {
        doenetId: this.props.doenetId,
        contentId: this.contentId,
        attemptNumber: this.attemptNumber,
        credit: itemCreditAchieved,
        itemNumber
      };
      axios.post("/api/saveCreditForItem.php", payload2);
    }
    callBack("submitResponse callback parameter");
  }
  recordSolutionView({itemNumber, scoredComponent, callBack}) {
    callBack({allowView: true, message: "", scoredComponent});
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
      version: "0.1.0"
    };
    axios.post("/api/recordEvent.php", payload);
  }
  contentIdsToDoenetMLs({contentIds, callBack}) {
    let promises = [];
    let newDoenetMLs = {};
    let newContentIds = contentIds;
    for (let contentId2 of contentIds) {
      promises.push(axios.get(`/media/${contentId2}.doenet`));
    }
    Promise.all(promises).then((resps) => {
      newDoenetMLs = resps.map((x) => x.data);
      callBack({
        newDoenetMLs,
        newContentIds,
        success: true
      });
    }).catch((err) => {
      let message;
      if (newContentIds.length === 1) {
        message = `Could not retrieve contentId ${newContentIds[0]}`;
      } else {
        message = `Could not retrieve contentIds ${newContentIds.join(",")}`;
      }
      callBack({
        success: false,
        message,
        newDoenetMLs: [],
        newContentIds: []
      });
    });
  }
  render() {
    if (this.state.errMsg !== null) {
      return /* @__PURE__ */ React.createElement("div", null, this.state.errMsg);
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
    this.attemptNumber = this.props.attemptNumber;
    if (this.attemptNumber === void 0) {
      this.attemptNumber = 1;
    }
    let adjustedRequestedVariantFromProp = this.props.requestedVariant;
    if (adjustedRequestedVariantFromProp === void 0) {
      adjustedRequestedVariantFromProp = {index: this.attemptNumber};
    }
    if (!this.requestedVariantFromDatabase && JSON.stringify(this.requestedVariant) !== JSON.stringify(adjustedRequestedVariantFromProp)) {
      this.needNewCoreFlag = true;
    }
    this.requestedVariant = adjustedRequestedVariantFromProp;
    if (this.props.doenetML && !this.props.contentId) {
      this.doenetML = this.props.doenetML;
      if (this.doenetML !== this.state.doenetML) {
        this.contentId = sha256(this.props.doenetML).toString(CryptoJS.enc.Hex);
        this.needNewCoreFlag = true;
      }
    } else if (!this.props.doenetML && this.props.contentId) {
      this.contentId = this.props.contentId;
      if (this.contentId !== this.state.contentId) {
        this.needNewCoreFlag = true;
        this.doenetML = localStorage.getItem(this.contentId);
        if (!this.doenetML) {
          try {
            axios.get(`/media/${contentId}.doenet`).then((resp) => {
              this.doenetML = resp.data;
              localStorage.setItem(this.contentId, this.doenetML);
              this.forceUpdate();
            });
          } catch (err) {
            return "Error Loading";
          }
          return null;
        }
      }
    } else if (this.props.doenetML && this.props.contentId) {
      this.doenetML = this.props.doenetML;
      this.contentId = this.props.contentId;
      if (this.contentId !== this.state.contentId) {
        this.needNewCoreFlag = true;
      }
    }
    if (this.attemptNumber !== this.state.attemptNumber) {
      this.needNewCoreFlag = true;
    }
    if (this.needNewCoreFlag) {
      this.loadState(this.createCore);
      return null;
    }
    return this.documentRenderer;
  }
}
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
      return /* @__PURE__ */ React.createElement("b", null, this.state.errorMsg);
    }
    return this.props.children;
  }
}
function DoenetViewer(props) {
  return /* @__PURE__ */ React.createElement(ErrorBoundary, null, /* @__PURE__ */ React.createElement(DoenetViewerChild, {
    ...props
  }));
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

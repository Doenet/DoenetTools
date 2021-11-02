import React, {Component} from "../_snowpack/pkg/react.js";
import Core from "./core.js";
import axios from "../_snowpack/pkg/axios.js";
import sha256 from "../_snowpack/pkg/crypto-js/sha256.js";
import CryptoJS from "../_snowpack/pkg/crypto-js.js";
import {nanoid} from "../_snowpack/pkg/nanoid.js";
import {useToast, toastType} from "../_framework/Toast.js";
import {serializedComponentsReplacer, serializedComponentsReviver} from "../core/utils/serializedStateProcessing.js";
import {FontAwesomeIcon} from "../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faExclamationCircle} from "../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
class DoenetViewerChild extends Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.coreReady = this.coreReady.bind(this);
    this.createCore = this.createCore.bind(this);
    this.loadState = this.loadState.bind(this);
    this.localStateChanged = this.localStateChanged.bind(this);
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
    if (!stateVariables) {
      this.cumulativeStateVariableChanges = {};
      variant = null;
    } else {
      this.cumulativeStateVariableChanges = JSON.parse(stateVariables, serializedComponentsReviver);
    }
    if (variant !== null) {
      this.requestedVariant = JSON.parse(variant, serializedComponentsReviver);
      this.requestedVariantFromDatabase = true;
    }
    this.coreId = nanoid();
    try {
      if (this.props.core) {
        new this.props.core({
          coreId: this.coreId,
          coreReadyCallback: this.coreReady,
          coreUpdatedCallback: this.update,
          doenetML: this.doenetML,
          externalFunctions: {
            localStateChanged: this.localStateChanged,
            recordSolutionView: this.recordSolutionView,
            recordEvent: this.recordEvent,
            contentIdsToDoenetMLs: this.contentIdsToDoenetMLs.bind(this)
          },
          flags: this.props.flags,
          requestedVariant: this.requestedVariant,
          stateVariableChanges: this.cumulativeStateVariableChanges
        });
      } else {
        new Core({
          coreId: this.coreId,
          coreReadyCallback: this.coreReady,
          coreUpdatedCallback: this.update,
          doenetML: this.doenetML,
          externalFunctions: {
            localStateChanged: this.localStateChanged,
            recordSolutionView: this.recordSolutionView,
            recordEvent: this.recordEvent,
            contentIdsToDoenetMLs: this.contentIdsToDoenetMLs.bind(this)
          },
          flags: this.props.flags,
          requestedVariant: this.requestedVariant,
          stateVariableChanges: this.cumulativeStateVariableChanges
        });
      }
    } catch (e) {
      if (this.props.setIsInErrorState) {
        this.props.setIsInErrorState(true);
      }
      this.setState({errMsg: e.message});
    }
  }
  coreReady(core) {
    this.core = core;
    this.generatedVariant = core.document.stateValues.generatedVariantInfo;
    this.itemVariantInfo = core.document.stateValues.itemVariantInfo;
    this.allPossibleVariants = [...core.document.sharedParameters.allPossibleVariants];
    if (this.props.generatedVariantCallback) {
      this.props.generatedVariantCallback(this.generatedVariant, this.allPossibleVariants);
    }
    let renderPromises = [];
    let rendererClassNames = [];
    for (let rendererClassName of core.rendererTypesInDocument) {
      rendererClassNames.push(rendererClassName);
      renderPromises.push(import(`./renderers/${rendererClassName}.js`));
    }
    renderersloadComponent(renderPromises, rendererClassNames).then((rendererClasses) => {
      this.rendererClasses = rendererClasses;
      let documentComponentInstructions = core.renderedComponentInstructions[core.documentName];
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
    if (this.allowSavePageState && Number.isInteger(this.attemptNumber) && this.savedUserAssignmentAttemptNumber !== this.attemptNumber) {
      if (!navigator.onLine) {
        this.props.toast("You're not connected to the internet. ", toastType.ERROR);
      }
      axios.post("/api/initAssignmentAttempt.php", {
        doenetId: this.props.doenetId,
        weights: this.core.scoredItemWeights,
        attemptNumber: this.attemptNumber,
        contentId: this.contentId,
        requestedVariant: JSON.stringify(this.requestedVariant, serializedComponentsReplacer),
        generatedVariant: JSON.stringify(this.generatedVariant, serializedComponentsReplacer),
        itemVariantInfo: this.itemVariantInfo.map((x) => JSON.stringify(x, serializedComponentsReplacer))
      }).then(({data}) => {
        if (!data.success) {
          if (this.props.setIsInErrorState) {
            this.props.setIsInErrorState(true);
          }
          this.setState({errMsg: data.message});
        }
        this.savedUserAssignmentAttemptNumber = this.attemptNumber;
      }).catch((errMsg) => {
        if (this.props.setIsInErrorState) {
          this.props.setIsInErrorState(true);
        }
        this.setState({errMsg: errMsg.message});
      });
    }
    if (this.props.onCoreReady) {
      this.props.onCoreReady();
    }
  }
  localStateChanged({
    newStateVariableValues,
    contentId,
    sourceOfUpdate,
    transient = false,
    itemsWithCreditAchieved
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
    let currentVariantString = JSON.stringify(this.core.document.stateValues.generatedVariantInfo, serializedComponentsReplacer);
    if (currentVariantString !== variantString) {
      this.generatedVariant = this.core.document.stateValues.generatedVariantInfo;
      variantString = currentVariantString;
      if (this.props.generatedVariantCallback) {
        this.props.generatedVariantCallback(this.generatedVariant, this.allPossibleVariants);
      }
    }
    const data = {
      contentId,
      stateVariables: changeString,
      attemptNumber: this.attemptNumber,
      doenetId: this.props.doenetId,
      variant: variantString
    };
    if (this.allowLocalPageState) {
      localStorage.setItem(`${contentId}${this.props.doenetId}${this.attemptNumber}`, JSON.stringify({stateVariables: changeString, variant: variantString}));
    }
    if (!this.allowSavePageState) {
      return;
    }
    if (!navigator.onLine) {
      this.props.toast("You're not connected to the internet. Changes are not saved. ", toastType.ERROR);
    }
    axios.post("/api/recordContentInteraction.php", data).then(({data: data2}) => {
      if (!data2.success) {
        this.props.toast(data2.message, toastType.ERROR);
      }
    });
    if (!this.allowSaveSubmissions) {
      return;
    }
    for (let itemNumber in itemsWithCreditAchieved) {
      let itemCreditAchieved = itemsWithCreditAchieved[itemNumber];
      const payload2 = {
        doenetId: this.props.doenetId,
        contentId: this.contentId,
        attemptNumber: this.attemptNumber,
        credit: itemCreditAchieved,
        itemNumber,
        stateVariables: changeString
      };
      axios.post("/api/saveCreditForItem.php", payload2).then((resp) => {
        if (!resp.data.success) {
          this.props.toast(resp.data.message, toastType.ERROR);
        }
        this.props.updateCreditAchievedCallback(resp.data);
        if (resp.data.viewedSolution) {
          this.props.toast("No credit awarded since solution was viewed.", toastType.INFO);
        }
        if (resp.data.timeExpired) {
          this.props.toast("No credit awarded since the time allowed has expired.", toastType.INFO);
        }
        if (resp.data.pastDueDate) {
          this.props.toast("No credit awarded since the due date has passed.", toastType.INFO);
        }
        if (resp.data.exceededAttemptsAllowed) {
          this.props.toast("No credit awarded since no more attempts are allowed.", toastType.INFO);
        }
        if (resp.data.databaseError) {
          this.props.toast("Credit not saved due to database error.", toastType.ERROR);
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
    let effectivePageStateSource = "pageState";
    if (this.props.pageStateSource) {
      effectivePageStateSource = this.props.pageStateSource;
    }
    const payload = {
      params: {
        contentId: this.contentId,
        attemptNumber: this.attemptNumber,
        doenetId: this.props.doenetId,
        userId: this.props.userId,
        pageStateSource: effectivePageStateSource
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
      if (this.props.setIsInErrorState) {
        this.props.setIsInErrorState(true);
      }
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
  async recordSolutionView({itemNumber, scoredComponent}) {
    const resp = await axios.post("/api/reportSolutionViewed.php", {
      doenetId: this.props.doenetId,
      itemNumber,
      attemptNumber: this.attemptNumber
    });
    return {allowView: true, message: "", scoredComponent};
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
    for (let contentId of contentIds) {
      promises.push(axios.get(`/media/${contentId}.doenet`));
    }
    function ErrorFromWithinCallback(originalError) {
      this.name = "ErrorFromWithinCallback";
      this.originalError = originalError;
    }
    Promise.all(promises).then((resps) => {
      newDoenetMLs = resps.map((x) => x.data);
      try {
        callBack({
          newDoenetMLs,
          newContentIds,
          success: true
        });
      } catch (e) {
        throw new ErrorFromWithinCallback(e);
      }
    }).catch((err) => {
      if (err.name === "ErrorFromWithinCallback") {
        throw err.originalError;
      }
      let message;
      if (newContentIds.length === 1) {
        message = `Could not retrieve contentId ${newContentIds[0]}`;
      } else {
        message = `Could not retrieve contentIds ${newContentIds.join(",")}`;
      }
      message += ": " + err.message;
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
      let errorIcon = /* @__PURE__ */ React.createElement("span", {
        style: {fontSize: "1em", color: "#C1292E"}
      }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
        icon: faExclamationCircle
      }));
      return /* @__PURE__ */ React.createElement("div", {
        style: {fontSize: "1.3em", marginLeft: "20px", marginTop: "20px"}
      }, errorIcon, " ", this.state.errMsg);
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
    if (typeof this.props.doenetML === "string" && !this.props.contentId) {
      this.doenetML = this.props.doenetML;
      if (this.doenetML !== this.state.doenetML) {
        this.contentId = sha256(this.props.doenetML).toString(CryptoJS.enc.Hex);
        this.needNewCoreFlag = true;
      }
    } else if (!this.props.doenetML && this.props.contentId) {
      this.contentId = this.props.contentId;
      if (this.contentId !== this.state.contentId) {
        this.needNewCoreFlag = true;
        try {
          axios.get(`/media/${this.contentId}.doenet`).then((resp) => {
            this.doenetML = resp.data;
            this.forceUpdate();
          });
        } catch (err) {
          return "Error Loading";
        }
        return null;
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
    return /* @__PURE__ */ React.createElement("div", {
      style: {maxWidth: "850px", paddingLeft: "20px", paddingRight: "20px", marginBottom: "200px"}
    }, this.documentRenderer);
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
  const toast = useToast();
  let newProps = {...props, toast};
  return /* @__PURE__ */ React.createElement(ErrorBoundary, null, /* @__PURE__ */ React.createElement(DoenetViewerChild, {
    ...newProps
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

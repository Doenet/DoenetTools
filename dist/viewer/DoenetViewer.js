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
import {rendererSVs} from "./renderers/useDoenetRenderer.js";
import {atomFamily, useRecoilCallback} from "../_snowpack/pkg/recoil.js";
const rendererUpdatesToIgnore = atomFamily({
  key: "rendererUpdatesToIgnore",
  default: {}
});
class DoenetViewerChild extends Component {
  constructor(props) {
    super(props);
    this.updateRenderers = this.updateRenderers.bind(this);
    this.coreReady = this.coreReady.bind(this);
    this.createCore = this.createCore.bind(this);
    this.loadState = this.loadState.bind(this);
    this.recordSolutionView = this.recordSolutionView.bind(this);
    this.recordEvent = this.recordEvent.bind(this);
    this.callAction = this.callAction.bind(this);
    this.rendererUpdateMethods = {};
    this.rendererStateValues = {};
    this.cumulativeStateVariableChanges = {};
    this.needNewCoreFlag = false;
    this.weightsStored = false;
    this.state = {
      doenetML: null,
      attemptNumber: null,
      contentId: null,
      errMsg: null
    };
    if (!this.props.useUnbundledCore) {
      this.coreWorker = new Worker("core/Core.js", {type: "module"});
    } else {
      this.coreWorker = new Worker("viewer/core.js", {type: "module"});
    }
    let viewer = this;
    this.coreCreated = false;
    this.coreWorker.onmessage = function(e) {
      if (e.data.messageType === "coreCreated") {
        viewer.coreCreated = true;
        if (viewer.coreInfo && JSON.stringify(viewer.coreInfo) === JSON.stringify(e.data.args)) {
          console.log("do we skip sending core ready since already have coreInfo?");
        } else {
          console.log("creating new core");
          viewer.coreReady(e.data.args);
        }
      } else if (e.data.messageType === "updateRenderers") {
        if (e.data.init && viewer.coreInfo) {
          console.log("do we skip initial render state values since already have coreInfo?");
        } else {
          viewer.updateRenderers(e.data.args);
        }
      } else if (e.data.messageType === "saveState") {
        viewer.saveState(e.data.args);
      } else if (e.data.messageType === "recordSolutionView") {
        viewer.recordSolutionView(e.data.args);
      } else if (e.data.messageType === "returnAllStateVariables") {
        console.log(e.data.args);
        viewer.resolveAllStateVariables(e.data.args);
      }
    };
    window.returnAllStateVariables = function() {
      this.coreWorker.postMessage({
        messageType: "returnAllStateVariables"
      });
      return new Promise((resolve, reject) => {
        viewer.resolveAllStateVariables = resolve;
      });
    }.bind(this);
    window.callAction = function({actionName, componentName, args}) {
      this.callAction({
        action: {actionName, componentName},
        args
      });
    }.bind(this);
  }
  callAction({action, args, baseVariableValue, name, rendererType}) {
    if (this.coreCreated || !this.rendererClasses?.[rendererType]?.ignoreActionsWithoutCore) {
      if (baseVariableValue !== void 0 && name) {
        let actionId = nanoid();
        this.props.updateRendererUpdatesToIgnore({
          componentName: name,
          baseVariableValue,
          actionId
        });
        args = {...args};
        args.actionId = actionId;
      }
      this.coreWorker.postMessage({
        messageType: "requestAction",
        args: {
          actionName: action.actionName,
          componentName: action.componentName,
          args
        }
      });
    }
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
      this.coreWorker.postMessage({
        messageType: "createCore",
        args: {
          coreId: this.coreId,
          doenetML: this.doenetML,
          flags: this.props.flags,
          requestedVariant: this.requestedVariant,
          stateVariableChanges: this.cumulativeStateVariableChanges
        }
      });
    } catch (e) {
      throw e;
      if (this.props.setIsInErrorState) {
        this.props.setIsInErrorState(true);
      }
      this.setState({errMsg: e.message});
    }
  }
  coreReady(coreInfo) {
    this.coreInfo = coreInfo;
    if (this.props.generatedVariantCallback) {
      this.props.generatedVariantCallback(this.coreInfo.generatedVariantInfo, this.coreInfo.allPossibleVariants);
    }
    let renderPromises = [];
    let rendererClassNames = [];
    for (let rendererClassName of coreInfo.rendererTypesInDocument) {
      rendererClassNames.push(rendererClassName);
      renderPromises.push(import(`./renderers/${rendererClassName}.js`));
    }
    let documentComponentInstructions = coreInfo.documentToRender;
    this.componentsToRender = {};
    this.initializeComponentsToRender(documentComponentInstructions);
    renderersloadComponent(renderPromises, rendererClassNames).then((rendererClasses) => {
      this.rendererClasses = rendererClasses;
      let documentRendererClass = this.rendererClasses[documentComponentInstructions.rendererType];
      this.documentRenderer = React.createElement(documentRendererClass, {
        key: documentComponentInstructions.componentName,
        componentInstructions: documentComponentInstructions,
        rendererClasses: this.rendererClasses,
        rendererUpdateMethods: this.rendererUpdateMethods,
        flags: this.props.flags,
        callAction: this.callAction
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
        weights: coreInfo.scoredItemWeights,
        attemptNumber: this.attemptNumber,
        contentId: this.contentId,
        requestedVariant: JSON.stringify(this.requestedVariant, serializedComponentsReplacer),
        generatedVariant: JSON.stringify(this.coreInfo.generatedVariantInfo, serializedComponentsReplacer),
        itemVariantInfo: this.coreInfo.itemVariantInfo.map((x) => JSON.stringify(x, serializedComponentsReplacer))
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
  }
  initializeComponentsToRender(componentToRender) {
    this.componentsToRender[componentToRender.componentName] = componentToRender;
    if (componentToRender.children) {
      for (let child of componentToRender.children) {
        if (child.componentName) {
          this.initializeComponentsToRender(child);
        }
      }
    }
  }
  saveState({
    newStateVariableValues,
    contentId,
    itemsWithCreditAchieved,
    currentVariant
  }) {
    if (!this.allowSavePageState && !this.allowLocalPageState) {
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
    let variantString = JSON.stringify(this.coreInfo.generatedVariantInfo, serializedComponentsReplacer);
    let currentVariantString = JSON.stringify(currentVariant, serializedComponentsReplacer);
    if (currentVariantString !== variantString) {
      this.coreInfo.generatedVariantInfo = currentVariant;
      variantString = currentVariantString;
      if (this.props.generatedVariantCallback) {
        this.props.generatedVariantCallback(this.coreInfo.generatedVariantInfo, this.coreInfo.allPossibleVariants);
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
      localStorage.setItem(`${contentId}${this.props.doenetId}${this.attemptNumber}`, JSON.stringify({
        stateVariables: changeString,
        variant: variantString,
        rendererStateValues: this.rendererStateValues,
        coreInfo: this.coreInfo
      }));
    }
    if (!this.allowSavePageState) {
      return;
    }
    if (!navigator.onLine) {
      this.props.toast("You're not connected to the internet. Changes are not saved. ", toastType.ERROR);
    }
    if (this.savePageStateTimeoutID) {
      clearTimeout(this.savePageStateTimeoutID);
    }
    this.savePageStateTimeoutID = setTimeout(() => {
      axios.post("/api/recordContentInteraction.php", data).then(({data: data2}) => {
        if (!data2.success) {
          this.props.toast(data2.message, toastType.ERROR);
        }
      });
    }, 1e3);
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
  async loadState() {
    if (!this.allowLoadPageState && !this.allowLocalPageState) {
      return {
        stateVariables: null,
        variant: null
      };
    }
    if (this.allowLocalPageState) {
      let localInfo = JSON.parse(localStorage.getItem(`${this.contentId}${this.props.doenetId}${this.attemptNumber}`));
      let stateVariables = null;
      let variant = null;
      let rendererStateValues = {};
      if (localInfo) {
        stateVariables = localInfo.stateVariables;
        variant = localInfo.variant;
        if (localInfo.rendererStateValues) {
          this.rendererStateValues = localInfo.rendererStateValues;
          console.log("loading renderer values");
          console.log(this.rendererStateValues);
          for (let componentName in this.rendererStateValues) {
            this.props.updateRendererSVsWithRecoil({
              componentName,
              stateValues: this.rendererStateValues[componentName]
            });
          }
        }
        this.coreInfo = localInfo.coreInfo;
        if (this.coreInfo) {
          console.log("pretending core ready from database");
          this.coreReady(this.coreInfo);
        }
      }
      return {
        stateVariables,
        variant
      };
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
    try {
      let resp = await axios.get("/api/loadContentInteractions.php", payload);
      if (!resp.data.success) {
        throw new Error(resp.data.message);
      }
      return {
        stateVariables: resp.data.stateVariables,
        variant: resp.data.variant
      };
    } catch (errMsg) {
      if (this.props.setIsInErrorState) {
        this.props.setIsInErrorState(true);
      }
      this.setState({errMsg: errMsg.message});
      return null;
    }
  }
  async updateRenderers(updateInstructions) {
    for (let instruction of updateInstructions) {
      if (instruction.instructionType === "updateStateVariable") {
        for (let {componentName, stateValues, rendererType} of instruction.stateValuesToUpdate) {
          this.props.updateRendererSVsWithRecoil({
            componentName,
            stateValues,
            sourceOfUpdate: instruction.sourceOfUpdate,
            baseStateVariable: this.rendererClasses?.[rendererType]?.baseStateVariable
          });
          this.rendererStateValues[componentName] = stateValues;
        }
      } else if (instruction.instructionType === "changeChildren") {
        this.componentsToRender[instruction.parentName].children = instruction.childrenToRender;
        this.props.updateRendererSVsWithRecoil({
          componentName: instruction.parentName,
          stateValues: instruction.stateValues,
          sourceOfUpdate: instruction.sourceOfUpdate,
          baseStateVariable: this.rendererClasses?.[instruction.rendererType]?.baseStateVariable
        });
        this.rendererStateValues[instruction.parentName] = instruction.stateValues;
      }
    }
  }
  async recordSolutionView({itemNumber, scoredComponent, messageId}) {
    const resp = await axios.post("/api/reportSolutionViewed.php", {
      doenetId: this.props.doenetId,
      itemNumber,
      attemptNumber: this.attemptNumber
    });
    this.coreWorker.postMessage({
      messageType: "allowSolutionView",
      args: {allowView: true, message: "", scoredComponent, messageId}
    });
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
      version: "0.1.0"
    };
    axios.post("/api/recordEvent.php", payload);
  }
  contentIdsToDoenetMLs(contentIds) {
    let promises = [];
    let newDoenetMLs = {};
    let newContentIds = contentIds;
    for (let contentId of contentIds) {
      promises.push(axios.get(`/media/${contentId}.doenet`));
    }
    return Promise.all(promises).then((resps) => {
      newDoenetMLs = resps.map((x) => x.data);
      return Promise.resolve({newDoenetMLs, newContentIds});
    }).catch((err) => {
      let message;
      if (newContentIds.length === 1) {
        message = `Could not retrieve contentId ${newContentIds[0]}`;
      } else {
        message = `Could not retrieve contentIds ${newContentIds.join(",")}`;
      }
      message += ": " + err.message;
      console.error(message);
      return Promise.reject(new Error(message));
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
      delete this.coreInfo;
      this.coreCreated = false;
      this.loadState().then((createCoreInfo) => {
        if (createCoreInfo) {
          this.createCore(createCoreInfo);
        }
      });
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
  const updateRendererSVsWithRecoil = useRecoilCallback(({snapshot, set}) => async ({componentName, stateValues, sourceOfUpdate, baseStateVariable}) => {
    let ignoreUpdate = false;
    if (baseStateVariable) {
      let sourceActionId = sourceOfUpdate?.sourceInformation?.[componentName]?.actionId;
      let updatesToIgnore = snapshot.getLoadable(rendererUpdatesToIgnore(componentName)).contents;
      if (Object.keys(updatesToIgnore).length > 0) {
        let valueFromRenderer = updatesToIgnore[sourceActionId];
        let valueFromCore = stateValues[baseStateVariable];
        if (valueFromRenderer === valueFromCore || Array.isArray(valueFromRenderer) && Array.isArray(valueFromCore) && valueFromRenderer.length == valueFromCore.length && valueFromRenderer.every((v, i) => valueFromCore[i] === v)) {
          ignoreUpdate = true;
          set(rendererUpdatesToIgnore(componentName), (was) => {
            let newUpdatesToIgnore = {...was};
            delete newUpdatesToIgnore[sourceActionId];
            return newUpdatesToIgnore;
          });
        } else {
          set(rendererUpdatesToIgnore(componentName), {});
        }
      }
    }
    set(rendererSVs(componentName), {stateValues, sourceOfUpdate, ignoreUpdate});
  });
  const updateRendererUpdatesToIgnore = useRecoilCallback(({snapshot, set}) => async ({componentName, baseVariableValue, actionId}) => {
    set(rendererUpdatesToIgnore(componentName), (was) => {
      let newUpdatesToIgnore = {...was};
      newUpdatesToIgnore[actionId] = baseVariableValue;
      return newUpdatesToIgnore;
    });
  });
  let newProps = {...props, toast, updateRendererSVsWithRecoil, updateRendererUpdatesToIgnore};
  return /* @__PURE__ */ React.createElement(ErrorBoundary, null, /* @__PURE__ */ React.createElement(DoenetViewerChild, {
    ...newProps
  }));
}
export default DoenetViewer;
export async function renderersloadComponent(promises, rendererClassNames) {
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

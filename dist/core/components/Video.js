import BlockComponent from './abstract/BlockComponent.js';
import { orderedPercentWidthMidpoints, orderedWidthMidpoints, widthsBySize, sizePossibilities } from '../utils/size.js';

export default class Video extends BlockComponent {
  static componentType = "video";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.width = {
      createComponentOfType: "_componentSize",
    };
    attributes.size = {
      createComponentOfType: "text",
    }
    attributes.aspectRatio = {
      createComponentOfType: "number",
    };

    // Note: height attribute is deprecated and will be removed in the future
    attributes.height = {
      createComponentOfType: "_componentSize",
    };

    attributes.displayMode = {
      createComponentOfType: "text",
      createStateVariable: "displayMode",
      validValues: ["block", "inline"],
      defaultValue: "block",
      forRenderer: true,
      public: true,
    }

    attributes.horizontalAlign = {
      createComponentOfType: "text",
      createStateVariable: "horizontalAlign",
      validValues: ["center", "left", "right"],
      defaultValue: "center",
      forRenderer: true,
      public: true,
    }

    attributes.youtube = {
      createComponentOfType: "text",
      createStateVariable: "youtube",
      defaultValue: null,
      public: true,
      forRenderer: true,
    };
    attributes.source = {
      createComponentOfType: "text",
      createStateVariable: "source",
      defaultValue: null,
      public: true,
      forRenderer: true,
    };

    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.size = {
      public: true,
      defaultValue: "full",
      hasEssential: true,
      shadowingInstructions: {
        createComponentOfType: "text"
      },
      returnDependencies: () => ({
        sizeAttr: {
          dependencyType: "attributeComponent",
          attributeName: "size",
          variableNames: ["value"],
        },
        widthAttr: {
          dependencyType: "attributeComponent",
          attributeName: "width",
          variableNames: ["componentSize"],
        },
      }),
      definition({ dependencyValues }) {
        const defaultSize = 'full';

        if (dependencyValues.sizeAttr) {
          let size = dependencyValues.sizeAttr.stateValues.value.toLowerCase();

          if (!sizePossibilities.includes(size)) {
            size = defaultSize;
          }
          return {
            setValue: { size }
          }
        } else if (dependencyValues.widthAttr) {
          let componentSize = dependencyValues.widthAttr.stateValues.componentSize;
          if (componentSize === null) {

            return {
              setValue: { size: defaultSize }
            }
          }
          let { isAbsolute, size: widthSize } = componentSize;
          let size;

          if (isAbsolute) {
            for (let [ind, pixels] of orderedWidthMidpoints.entries()) {
              if (widthSize <= pixels) {
                size = sizePossibilities[ind];
                break
              }
            }
            if (!size) {
              size = defaultSize
            }
          } else {
            for (let [ind, percent] of orderedPercentWidthMidpoints.entries()) {
              if (widthSize <= percent) {
                size = sizePossibilities[ind];
                break
              }
            }
            if (!size) {
              size = defaultSize
            }
          }
          return {
            setValue: { size }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { size: true }
          }
        }
      }

    }

    stateVariableDefinitions.width = {
      public: true,
      forRenderer: true,
      shadowingInstructions: {
        createComponentOfType: "_componentSize"
      },
      returnDependencies: () => ({
        size: {
          dependencyType: "stateVariable",
          variableName: "size",
        }
      }),
      definition({ dependencyValues }) {

        let width = { isAbsolute: true, size: widthsBySize[dependencyValues.size] }

        return {
          setValue: { width }
        }

      }

    }

    stateVariableDefinitions.aspectRatio = {
      public: true,
      forRenderer: true,
      defaultValue: "16 / 9",
      hasEssential: true,
      shadowingInstructions: {
        createComponentOfType: "number"
      },
      returnDependencies: () => ({
        aspectRatioAttr: {
          dependencyType: "attributeComponent",
          attributeName: "aspectRatio",
          variableNames: ["value"]
        },
        width: {
          dependencyType: "stateVariable",
          variableName: "width"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.aspectRatioAttr !== null) {
          let aspectRatio = dependencyValues.aspectRatioAttr.stateValues.value;
          if (!Number.isFinite(aspectRatio)) {
            aspectRatio = 1;
          }
          return {
            setValue: { aspectRatio }
          }
        } else {
          return {
            useEssentialOrDefaultValue: { aspectRatio: true }
          }
        }
      }
    }

    stateVariableDefinitions.state = {
      hasEssential: true,
      defaultValue: "initializing",
      forRenderer: true,
      public:true,
      shadowingInstructions: {
        createComponentOfType: "text"
      },
      returnDependencies: () => ({}),
      definition() {
        return { useEssentialOrDefaultValue: { state: true } }
      },
      inverseDefinition({ desiredStateVariableValues }) {
        let desiredState = desiredStateVariableValues.state.toLowerCase();
        let validValues = ["stopped", "playing"];
        if (!validValues.includes(desiredState)) {
          return { success: false }
        }
        return {
          success: true,
          instructions: [{
            setEssentialValue: "state",
            value: desiredState
          }]
        }
      }
    }

    stateVariableDefinitions.time = {
      hasEssential: true,
      defaultValue: 0,
      forRenderer: true,
      public:true,
      shadowingInstructions: {
        createComponentOfType: "number"
      },
      returnDependencies: () => ({}),
      definition() {
        return { useEssentialOrDefaultValue: { time: true } }
      },
      inverseDefinition({ desiredStateVariableValues }) {
        let desiredTime = desiredStateVariableValues.time;
        if(!(desiredTime >= 0)) {
          return { success: false }
        }
        return {
          success: true,
          instructions: [{
            setEssentialValue: "time",
            value: desiredTime
          }]
        }
      }
    }

    return stateVariableDefinitions;
  }



  recordVideoStarted({ beginTime, duration, rate }) {
    this.coreFunctions.requestRecordEvent({
      verb: "played",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
        duration: duration
      },
      context: {
        startingPoint: beginTime,
        rate: rate
      }
    })
    this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "state",
        value: "playing",
      }]
    })
  }

  recordVideoWatched({ beginTime, endTime, duration, rates }) {
    this.coreFunctions.requestRecordEvent({
      verb: "watched",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
        duration: duration
      },
      context: {
        startingPoint: beginTime,
        endingPoint: endTime,
        rates
      }
    })
  }

  recordVideoPaused({ endTime, duration }) {
    this.coreFunctions.requestRecordEvent({
      verb: "paused",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
        duration: duration
      },
      context: {
        endingPoint: endTime
      }
    })
    this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "state",
        value: "stopped",
      }]
    })
  }

  recordVideoSkipped({ beginTime, endTime, duration }) {
    this.coreFunctions.requestRecordEvent({
      verb: "skipped",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
        duration: duration
      },
      context: {
        startingPoint: beginTime,
        endingPoint: endTime
      }
    })
  }

  recordVideoCompleted({ duration }) {
    this.coreFunctions.requestRecordEvent({
      verb: "completed",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
        duration: duration
      },
    })
    this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "state",
        value: "stopped",
      }]
    })
  }

  recordVisibilityChange({ isVisible, actionId }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible }
    })
    this.coreFunctions.resolveAction({ actionId });
  }


  recordVideoReady() {
    this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "state",
        value: "stopped",
      }]
    })
  }

  playVideo() {
    this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "state",
        value: "playing",
      }]
    })
  }

  pauseVideo() {
    this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "state",
        value: "stopped",
      }]
    })
  }

  setTime({time}) {
    this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "time",
        value: time,
      }]
    })
  }

  actions = {
    recordVideoStarted: this.recordVideoStarted.bind(this),
    recordVideoWatched: this.recordVideoWatched.bind(this),
    recordVideoPaused: this.recordVideoPaused.bind(this),
    recordVideoSkipped: this.recordVideoSkipped.bind(this),
    recordVideoCompleted: this.recordVideoCompleted.bind(this),
    recordVisibilityChange: this.recordVisibilityChange.bind(this),
    recordVideoReady: this.recordVideoReady.bind(this),
    playVideo: this.playVideo.bind(this),
    pauseVideo: this.pauseVideo.bind(this),
    setTime: this.setTime.bind(this),
  }

}
import BlockComponent from './abstract/BlockComponent';
import { orderedPercentWidthMidpoints, orderedWidthMidpoints, widthsBySize, sizePossibilities } from '../utils/size';

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
      public: true,
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
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number"
      },
      returnDependencies: () => ({}),
      definition() {
        return { useEssentialOrDefaultValue: { time: true } }
      },
      inverseDefinition({ desiredStateVariableValues }) {
        let desiredTime = desiredStateVariableValues.time;
        if (!(desiredTime >= 0)) {
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

    stateVariableDefinitions.duration = {
      hasEssential: true,
      defaultValue: null,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number"
      },
      returnDependencies: () => ({}),
      definition: () => ({ useEssentialOrDefaultValue: { duration: true } }),
      inverseDefinition: ({ desiredStateVariableValues }) => ({
        success: true,
        instructions: [{
          setEssentialValue: "duration",
          value: desiredStateVariableValues.duration
        }]
      })
    }

    stateVariableDefinitions.segmentsWatched = {
      hasEssential: true,
      defaultValue: null,
      returnDependencies: () => ({}),
      definition: () => ({ useEssentialOrDefaultValue: { segmentsWatched: true } }),
      inverseDefinition: ({ desiredStateVariableValues }) => ({
        success: true,
        instructions: [{
          setEssentialValue: "segmentsWatched",
          value: desiredStateVariableValues.segmentsWatched
        }]
      })
    }

    stateVariableDefinitions.secondsWatched = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number"
      },
      returnDependencies: () => ({
        segmentsWatched: {
          dependencyType: "stateVariable",
          variableName: "segmentsWatched"
        }
      }),
      definition({ dependencyValues }) {
        let secondsWatched = 0;
        if (dependencyValues.segmentsWatched) {
          secondsWatched = dependencyValues.segmentsWatched.reduce((a, c) => a + c[1] - c[0], 0);
        }
        return { setValue: { secondsWatched } }
      }
    }

    stateVariableDefinitions.fractionWatched = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number"
      },
      returnDependencies: () => ({
        secondsWatched: {
          dependencyType: "stateVariable",
          variableName: "secondsWatched"
        },
        duration: {
          dependencyType: "stateVariable",
          variableName: "duration"
        }
      }),
      definition({ dependencyValues }) {
        return { setValue: { fractionWatched: dependencyValues.secondsWatched / dependencyValues.duration } }
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
      }],
    })
  }

  async recordVideoWatched({ beginTime, endTime, duration, rates }) {
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

    let previousSegments = await this.stateValues.segmentsWatched;
    let segmentsWatched;
    if (!previousSegments) {
      segmentsWatched = [[beginTime, endTime]]
    } else {
      segmentsWatched = [];
      let addedNew = false;

      // if merge new segment with previous segments if it almost overlaps
      // Note: include 0.2 buffer since there is variation in the timestamps youtube reports
      // when pause and then continue
      for (let [ind, seg] of previousSegments.entries()) {
        if (endTime < seg[0] - 0.2) {
          segmentsWatched.push([beginTime, endTime])
          segmentsWatched.push(...previousSegments.slice(ind));
          addedNew = true;
          break;
        } else if (beginTime > seg[1] + 0.2) {
          segmentsWatched.push(seg);
          continue;
        }
        // have overlap with segment
        beginTime = Math.min(seg[0], beginTime);
        endTime = Math.max(seg[1], endTime)
      }

      if (!addedNew) {
        segmentsWatched.push([beginTime, endTime])
      }
    }


    await this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "segmentsWatched",
        value: segmentsWatched,
      }],
      canSkipUpdatingRenderer: true,
    })

    return await this.coreFunctions.triggerChainedActions({
      componentName: this.componentName,
    });
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
      }],
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
      }],
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


  recordVideoReady({ duration }) {
    this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "state",
        value: "stopped",
      },
      {
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "duration",
        value: duration,
      }],
      doNotSave: true  // video actions don't count as changing page state
    })
  }

  playVideo() {
    this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "state",
        value: "playing",
      }],
    })
  }

  pauseVideo() {
    this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "state",
        value: "stopped",
      }],
    })
  }

  setTime({ time }) {
    this.coreFunctions.performUpdate({
      updateInstructions: [{
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "time",
        value: time,
      }],
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
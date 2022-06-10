import BlockComponent from './abstract/BlockComponent';

export default class Video extends BlockComponent {
  static componentType = "video";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.width = {
      createComponentOfType: "_componentSize",
    };
    attributes.height = {
      createComponentOfType: "_componentSize",
      // createStateVariable: "height",
      // defaultValue: null,
      // public: true,
      // forRenderer: true,
    };
    attributes.aspectRatio = {
      createComponentOfType: "number",
      // createStateVariable: "aspectRatio",
    };
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

    stateVariableDefinitions.width = {
      defaultValue: { size: 720, isAbsolute: true },
      public: true,
      hasEssential: true,
      shadowingInstructions: {
        createComponentOfType: "_componentSize",
      },
      forRenderer: true,
      additionalStateVariablesDefined: [{
        variableName: 'height',
        shadowingInstructions: {
          createComponentOfType: "_componentSize",
        },
        defaultValue: { size: 405, isAbsolute: true },
        public: true,
        forRenderer: true,
        hasEssential: true,

      },
      {
        variableName: 'aspectRatio',
        shadowingInstructions: {
          createComponentOfType: "number",
        },
        defaultValue: 16 / 9,
        public: true,
        forRenderer: true,
        hasEssential: true,
      }
      ],
      returnDependencies: () => ({
        widthAttr: {
          dependencyType: 'attributeComponent',
          attributeName: 'width',
          variableNames: ['componentSize'],
        },
        heightAttr: {
          dependencyType: 'attributeComponent',
          attributeName: 'height',
          variableNames: ['componentSize'],
        },
        aspectRatioAttr: {
          dependencyType: 'attributeComponent',
          attributeName: 'aspectRatio',
          variableNames: ['value'],
        }
      }),
      definition: ({ dependencyValues }) => {
        console.log("dependencyValues", dependencyValues)

        if (dependencyValues.widthAttr) {
          let width = dependencyValues.widthAttr.stateValues.componentSize;
          if (!width.isAbsolute) { throw Error("Have not implemented relative width for video") }
          if (dependencyValues.heightAttr) {
            //Have width and height so override aspectRatio even if it exists
            let height = dependencyValues.heightAttr.stateValues.componentSize;
            if (!height.isAbsolute) { throw Error("Have not implemented relative height for video") }
            let aspectRatio = width.size / height.size;
            return {
              setValue: {
                width,
                height,
                aspectRatio
              }
            }
          } else if (dependencyValues.aspectRatioAttr) {
            //Have width and aspectRatio but not height
            let aspectRatio = dependencyValues.aspectRatioAttr.stateValues.value;
            let height = { isAbsolute: true, size: width.size / aspectRatio }
            return {
              setValue: {
                width,
                height,
                aspectRatio
              }
            }
          } else {
            //Have width and not height or aspectRatio
            let height = { isAbsolute: true, size: width.size / (16 / 9) }
            return {
              setValue: {
                width,
                height
              },
              useEssentialOrDefaultValue: {
                aspectRatio: true,
              }
            }
          }
        } else {
          //Don't have width

          if (dependencyValues.heightAttr) {
            let height = dependencyValues.heightAttr.stateValues.componentSize;
            if (!height.isAbsolute) { throw Error("Have not implemented relative height for video") }

            if (dependencyValues.aspectRatioAttr) {
              //Have height and aspectRatio, No width
              let aspectRatio = dependencyValues.aspectRatioAttr.stateValues.value;
              let width = { isAbsolute: true, size: height.size * aspectRatio }
              return {
                setValue: {
                  width,
                  height,
                  aspectRatio
                }
              }
            } else {
              //Have height, no width, no aspectRatio
              let width = { isAbsolute: true, size: height.size * (16 / 9) }
              return {
                setValue: {
                  width,
                  height
                },
                useEssentialOrDefaultValue: {
                  aspectRatio: true,
                }
              }
            }
          } else {

            if (dependencyValues.aspectRatioAttr) {
              //Have aspectRatio, No height, no width
              let aspectRatio = dependencyValues.aspectRatioAttr.stateValues.value;
              let height = { isAbsolute: true, size: 720 / aspectRatio }
              return {
                setValue: {
                  aspectRatio,
                  height
                },
                useEssentialOrDefaultValue: {
                  width: true,
                }
              }
            } else {
              //No aspectRatio, No height, no width
              return {
                useEssentialOrDefaultValue: {
                  width: true,
                  height: true,
                  aspectRatio: true,
                }
              }
            }
          }


        }
      }

    }

    return stateVariableDefinitions;
  }


  actions = {
    recordVideoStarted: this.recordVideoStarted.bind(this),
    recordVideoWatched: this.recordVideoWatched.bind(this),
    recordVideoPaused: this.recordVideoPaused.bind(this),
    recordVideoSkipped: this.recordVideoSkipped.bind(this),
    recordVideoCompleted: this.recordVideoCompleted.bind(this),
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
  }

}
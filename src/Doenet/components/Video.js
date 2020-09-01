import BlockComponent from './abstract/BlockComponent';

export default class Video extends BlockComponent {
  static componentType = "video";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.width = { default: 500, forRenderer: true };
    properties.height = { default: 500, forRenderer: true };
    properties.youtube = { default: null, forRenderer: true };

    properties.source = { default: null, forRenderer: true };

    return properties;
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
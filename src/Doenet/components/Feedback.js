import ConditionalContent from './ConditionalContent';

export default class Feedback extends ConditionalContent {
  static componentType = "feedback";

  initializeRenderer(){
    if(this.renderer === undefined) {
      if(this.flags.showFeedback) {
        this.renderer = new this.availableRenderers.feedback({ key: this.componentName });
      }
    }
  }

}

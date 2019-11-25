import InlineComponent from './abstract/InlineComponent';

export class Ndash extends InlineComponent {
  static componentType = "ndash";

  initializeRenderer(){
    if(this.renderer === undefined) {
      this.renderer = new this.availableRenderers.ndash({key: this.componentName});
    }
  }

}

export class Mdash extends InlineComponent {
  static componentType = "mdash";

  initializeRenderer(){
    if(this.renderer === undefined) {
      this.renderer = new this.availableRenderers.mdash({key: this.componentName});
    }
  }

}

export class NBSP extends InlineComponent {
  static componentType = "nbsp";

  initializeRenderer(){
    if(this.renderer === undefined) {
      this.renderer = new this.availableRenderers.nbsp({key: this.componentName});
    }
  }

}
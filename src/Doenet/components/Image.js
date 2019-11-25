import BlockComponent from './abstract/BlockComponent';

export default class Image extends BlockComponent {
  static componentType = "image";

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.width = {default: undefined};
    properties.height = {default: undefined};
    properties.description = {default: undefined};
    properties.source = {required: true};
    return properties;
  }

  initializeRenderer(){
    if(this.renderer === undefined) {
      this.renderer = new this.availableRenderers.image({
        key: this.componentName,
        source: this.state.source,
        width: this.state.width,
        height: this.state.height,
        description: this.state.description,
      });
    }
  }

}

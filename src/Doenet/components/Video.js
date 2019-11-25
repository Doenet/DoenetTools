import BlockComponent from './abstract/BlockComponent';

export default class Video extends BlockComponent {
  static componentType = "video";

  static createPropertiesObject({standardComponentTypes}) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.width = {default: 500};
    properties.height = {default: 500};
    properties.youtube = {default: undefined};
    properties.sources = {isArray: true, singularName: "source"};
    return properties;
  }


  initializeRenderer(){
    if(this.renderer === undefined) {
      this.renderer = new this.availableRenderers.video({
        key: this.componentName,
        sources: this.state.sources,
        youtube: this.state.youtube,
        width: this.state.width,
        height: this.state.height,
      });
    }
  }

}
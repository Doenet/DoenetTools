import React from 'react';
import BaseRenderer from './BaseRenderer';

class ImageRenderer extends BaseRenderer{
  constructor({key, source, width, height, description}){
    super({key: key});
    this.source = source;
    this.width = width;
    this.height = height;
    this.description = description;
  }


  jsxCode(){
    if(this.description === undefined) {
      if(this.width === undefined) {
        if(this.height === undefined) {
          return <React.Fragment><a name={this._key} /><img id={this._key} src={this.source}/></React.Fragment>
        } else {
          return <React.Fragment><a name={this._key} /><img id={this._key} height={this.height} src={this.source}/></React.Fragment>
        }
      } else {
        if(this.height === undefined) {
          return <React.Fragment><a name={this._key} /><img id={this._key} width={this.width} src={this.source}/></React.Fragment>
        } else {
          return <React.Fragment><a name={this._key} /><img id={this._key} width={this.width} height={this.height} src={this.source}/></React.Fragment>
        }
      }
    } else {
      if(this.width === undefined) {
        if(this.height === undefined) {
          return <React.Fragment><a name={this._key} /><img id={this._key} src={this.source} alt={this.description}/></React.Fragment>
        } else {
          return <React.Fragment><a name={this._key} /><img id={this._key} height={this.height} src={this.source} alt={this.description}/></React.Fragment>
        }
      } else {
        if(this.height === undefined) {
          return <React.Fragment><a name={this._key} /><img id={this._key} width={this.width} src={this.source} alt={this.description}/></React.Fragment>
        } else {
          return <React.Fragment><a name={this._key} /><img id={this._key} width={this.width} height={this.height} src={this.source} alt={this.description}/></React.Fragment>
        }
      }
    }
  }

}

let AvailableRenderers = {
  image: ImageRenderer,
}

export default AvailableRenderers;

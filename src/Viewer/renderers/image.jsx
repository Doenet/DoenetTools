import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Image extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hidden) {
      return null;
    }

    if (this.doenetSvData.source) {

      let width = null;
      if (this.doenetSvData.width) {
        width = this.doenetSvData.width.size;
        if (!this.doenetSvData.width.isAbsolute) {
          width += "%"
        }
      }

      let height = null;
      if (this.doenetSvData.height) {
        height = this.doenetSvData.height.size;
        if (!this.doenetSvData.height.isAbsolute) {
          height += "%"
        }
      }

      return <React.Fragment>
        <a name={this.componentName} />
        <img id={this.componentName} src={this.doenetSvData.source} width={width} height={height} alt={this.doenetSvData.description} />
      </React.Fragment>

    }

    return null;

  }
}
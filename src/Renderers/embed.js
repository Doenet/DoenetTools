import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Video extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hide) {
      return null;
    }

    if (this.doenetSvData.geogebra) {
      return <div className="geogebra" id={this.componentName}>
        <a name={this.componentName} />
        <iframe scrolling="no" title="" src={`https://www.geogebra.org/material/iframe/id/${this.doenetSvData.geogebra}/width/${this.doenetSvData.width}/height/${this.doenetSvData.height}/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/false/rc/false/ld/false/sdz/false/ctl/false`} width={this.doenetSvData.width} height={this.doenetSvData.height} style={{ border: "0px" }}> </iframe>
      </div>
    }

    console.warn("Nothing specified to embed");
    return null;

  }
}
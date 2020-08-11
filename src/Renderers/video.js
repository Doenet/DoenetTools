import React from 'react';
import DoenetRenderer from './DoenetRenderer';

export default class Video extends DoenetRenderer {

  render() {

    if (this.doenetSvData.hide) {
      return null;
    }

    if (this.doenetSvData.youtube) {
      return <div className="video" id={this.componentName}>
        <a name={this.componentName} />
        <iframe width={this.doenetSvData.width} height={this.doenetSvData.height} src={`//www.youtube-nocookie.com/embed/${this.doenetSvData.youtube}?rel=0`} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>
    } else if (this.doenetSvData.source) {
      let extension = this.doenetSvData.source.split('/').pop().split('.').pop();
      let type;
      if (extension === "ogg") {
        type = "video/ogg";
      } else if (extension === "webm") {
        type = "video/webm";
      } else if (extension === "mp4") {
        type = "video/mp4";
      } else {
        console.warn("Haven't implemented video for any extension other than .ogg, .webm, .mp4");
      }
      if (type) {
        return <React.Fragment>
          <a name={this.componentName} />
          <video className="video" id={this.componentName} style={{ objectFit: "fill" }} controls={true} width={this.doenetSvData.width} height={this.doenetSvData.height}>
            <source src={this.doenetSvData.source} type={type} />
          Your browser does not support the &lt;video&gt; tag.
        </video>
        </React.Fragment>
      } else {
        return null;
      }
    }

    console.warn("No video returned youtube or no valid sources specified");
    return null;

  }
}
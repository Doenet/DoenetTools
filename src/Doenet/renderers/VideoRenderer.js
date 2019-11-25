import React from 'react';
import BaseRenderer from './BaseRenderer';

class VideoRenderer extends BaseRenderer {
  constructor({ key, sources, width, height, youtube }) {
    super({ key: key });
    this.sources = sources;
    this.width = width;
    this.height = height;
    this.youtube = youtube;
  }


  jsxCode() {
    if (this.youtube) {
      return <div className="video" id={this._key}>
        <a name={this._key} />
        <iframe width={this.width} height={this.height} src={`//www.youtube-nocookie.com/embed/${this.youtube}?rel=0`} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>
    } else if (this.sources) {
      let sourceJSX = [];
      for (let [i, source] of this.sources.entries()) {
        let extension = source.split('/').pop().split('.').pop();
        let type;
        if (extension === "ogg") {
          type = "video/ogg";
        } else if (extension === "webm") {
          type = "video/webm";
        } else if (extension === "mp4") {
          type = "video/mp4";
        } else {
          console.warn("Haven't implemented video for any extension other than .ogg, .webm, .mp4");
          break;
        }
        sourceJSX.push(<source src={source} type={type} key={i} />)
      }
      if (sourceJSX.length > 0) {
        return <React.Fragment>
          <a name={this._key} />
          <video className="video" id={this._key} style={{ objectFit: "fill" }} controls={true} width={this.width} height={this.height}>
            {sourceJSX}
            Your browser does not support the &lt;video&gt; tag.
          </video>
        </React.Fragment>
      }
    }

    console.warn("No video returned youtube or no valid sources specified");
    return null;
  }

}

let AvailableRenderers = {
  video: VideoRenderer,
}

export default AvailableRenderers;

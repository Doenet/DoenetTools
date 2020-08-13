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
    } else if(this.doenetSvData.fromMathInsight) {
      return <div className="geogebra" id={this.componentName}>
      <a name={this.componentName} />
      <iframe scrolling="no" title="" src={`http://mathinsight.org/applet/${this.doenetSvData.fromMathInsight}/bare`} width={this.doenetSvData.width} height={this.doenetSvData.height} style={{ border: "0px" }}> </iframe>
    </div>
    }
    
    
    else if(this.doenetSvData.encodedGeogebraContent) {
      console.log('found geogebra content')
      return <><div className="javascriptapplet" id={this.componentName}>
        <div className="geogebrawebapplet" id={"container_" + this.componentName}
         style={{minWidth: this.doenetSvData.width, minHeight: this.doenetSvData.height}} />
        </div>
        <script type="text/javascript"
        dangerouslySetInnerHTML={{__html:
          `alert("hello"); 
          console.log('where?');
          `
        }}
        />

        </>


  // script_string += 'var parameters%s = {"id":"%s","width":%s,"height":%s,%s,"ggbBase64":"%s","language":"en","country":"US","isPreloader":false,"screenshotGenerator":false,"preventFocus":false,"fixApplet":false,"prerelease":false,"playButtonAutoDecide":true,"playButton":false,"canary":false,"allowUpscale":false};\n' % \
  //                (applet_identifier, applet_identifier, width, height, applet_parameter_string, applet.encoded_content)
  // script_string += 'var applet%s = new GGBApplet( parameters%s, true);\n' % \
  //                  (applet_identifier, applet_identifier)
    
    }

    console.warn("Nothing specified to embed");
    return null;

  }
}
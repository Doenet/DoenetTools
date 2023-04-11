import React, { useEffect } from 'react';
import useDoenetRender from '../useDoenetRenderer';
import { sizeToCSS } from './utils/css';
import VisibilitySensor from 'react-visibility-sensor-v2';

export default React.memo(function Figure(props) {
  let { name, id, SVs, actions, callAction } = useDoenetRender(props);

  let onChangeVisibility = isVisible => {
    callAction({
      action: actions.recordVisibilityChange,
      args: { isVisible }
    })
  }

  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: { isVisible: false }
      })
    }
  }, [])

  useEffect(() => {

    if (SVs.encodedGeogebraContent) {

      let doenetSvData = SVs;

      let cName = id;

      let width = sizeToCSS(SVs.width);
      let height = sizeToCSS(SVs.height);

      window.MathJax.Hub.Register.StartupHook("End", function () {
        let parameters = {
          id: cName,
          width,
          height,
          showResetIcon: false,
          enableLabelDrags: false,
          useBrowserForJS: true,
          showMenubar: false,
          errorDialogsActive: true,
          showToolbar: false,
          showAlgebraicInput: false,
          enableShiftDragZoom: true,
          enableRightClick: true,
          showToolBarHelp: false,
          ggbBase64: doenetSvData.encodedGeogebraContent.trim(),
          language: "en",
          country: "US",
          isPreloader: false,
          screenshotGenerator: false,
          preventFocus: false,
          fixApplet: false,
          prerelease: false,
          playButtonAutoDecide: true,
          playButton: false,
          canary: false,
          allowUpscale: false
        };
        let applet = new window.GGBApplet(parameters, true);
        applet.setHTML5Codebase('/geogebra/HTML5/5.0/web/', 'true');
        applet.inject("container_" + cName, 'preferhtml5');
      });

    }
  }, [])


  if (SVs.hidden) {
    return null;
  }

  let width = sizeToCSS(SVs.width);
  let height = sizeToCSS(SVs.height);

  if (SVs.geogebra) {
    return <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <div className="geogebra" id={id}>
        <a name={id} />
        <iframe scrolling="no" title="" src={`https://www.geogebra.org/material/iframe/id/${SVs.geogebra}/width/${width}/height/${height}/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/false/rc/false/ld/false/sdz/false/ctl/false`} width={width} height={height} style={{ border: "0px" }}> </iframe>
      </div>
    </VisibilitySensor>
  } else if (SVs.encodedGeogebraContent) {
    return <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <div className="javascriptapplet" id={id}>
        <div className="geogebrawebapplet" id={"container_" + id}
          style={{ minWidth: width, minHeight: height }} />
      </div>
    </VisibilitySensor>
  }

  console.warn("Nothing specified to embed");
  return null;

})
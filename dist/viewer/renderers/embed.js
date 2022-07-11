import React, {useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import cssesc from "../../_snowpack/pkg/cssesc.js";
import {sizeToCSS} from "./utils/css.js";
import VisibilitySensor from "../../_snowpack/pkg/react-visibility-sensor-v2.js";
export default React.memo(function Figure(props) {
  let {name, SVs, actions, callAction} = useDoenetRender(props);
  let onChangeVisibility = (isVisible) => {
    callAction({
      action: actions.recordVisibilityChange,
      args: {isVisible}
    });
  };
  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: {isVisible: false}
      });
    };
  }, []);
  useEffect(() => {
    if (SVs.encodedGeogebraContent) {
      let doenetSvData = SVs;
      let cName = cssesc(name);
      let width2 = sizeToCSS(SVs.width);
      let height2 = sizeToCSS(SVs.height);
      window.MathJax.Hub.Register.StartupHook("End", function() {
        let parameters = {
          id: cName,
          width: width2,
          height: height2,
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
        applet.setHTML5Codebase("/media/geogebra/HTML5/5.0/web/", "true");
        applet.inject("container_" + cName, "preferhtml5");
      });
    }
  }, []);
  if (SVs.hidden) {
    return null;
  }
  let width = sizeToCSS(SVs.width);
  let height = sizeToCSS(SVs.height);
  if (SVs.geogebra) {
    return /* @__PURE__ */ React.createElement(VisibilitySensor, {
      partialVisibility: true,
      onChange: onChangeVisibility
    }, /* @__PURE__ */ React.createElement("div", {
      className: "geogebra",
      id: name
    }, /* @__PURE__ */ React.createElement("a", {
      name
    }), /* @__PURE__ */ React.createElement("iframe", {
      scrolling: "no",
      title: "",
      src: `https://www.geogebra.org/material/iframe/id/${SVs.geogebra}/width/${width}/height/${height}/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/false/rc/false/ld/false/sdz/false/ctl/false`,
      width,
      height,
      style: {border: "0px"}
    }, " ")));
  } else if (SVs.encodedGeogebraContent) {
    return /* @__PURE__ */ React.createElement(VisibilitySensor, {
      partialVisibility: true,
      onChange: onChangeVisibility
    }, /* @__PURE__ */ React.createElement("div", {
      className: "javascriptapplet",
      id: cssesc(name)
    }, /* @__PURE__ */ React.createElement("div", {
      className: "geogebrawebapplet",
      id: "container_" + cssesc(name),
      style: {minWidth: width, minHeight: height}
    })));
  }
  console.warn("Nothing specified to embed");
  return null;
});

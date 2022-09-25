import React, {useEffect} from "../../_snowpack/pkg/react.js";
import useDoenetRender from "./useDoenetRenderer.js";
import {HotTable} from "../../_snowpack/pkg/@handsontable/react.js";
import {HyperFormula} from "../../_snowpack/pkg/hyperformula.js";
import "../../_snowpack/pkg/handsontable/dist/handsontable.full.css.proxy.js";
import {sizeToCSS} from "./utils/css.js";
import {registerAllModules} from "../../_snowpack/pkg/handsontable/registry.js";
import VisibilitySensor from "../../_snowpack/pkg/react-visibility-sensor-v2.js";
registerAllModules();
export default React.memo(function SpreadsheetRenderer(props) {
  let {name, id, SVs, actions, callAction} = useDoenetRender(props);
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
  if (SVs.hidden) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(VisibilitySensor, {
    partialVisibility: true,
    onChange: onChangeVisibility
  }, /* @__PURE__ */ React.createElement("div", {
    id,
    style: {margin: "12px 0"}
  }, /* @__PURE__ */ React.createElement("a", {
    name: id
  }), /* @__PURE__ */ React.createElement(HotTable, {
    licenseKey: "non-commercial-and-evaluation",
    data: SVs.cells.map((x) => [...x]),
    colHeaders: SVs.columnHeaders,
    rowHeaders: SVs.rowHeaders,
    width: sizeToCSS(SVs.width),
    height: sizeToCSS(SVs.height),
    afterChange: (changes, source) => callAction({action: actions.onChange, args: {changes, source}}),
    formulas: {
      engine: HyperFormula
    },
    fixedRowsTop: SVs.fixedRowsTop,
    fixedColumnsLeft: SVs.fixedColumnsLeft,
    hiddenColumns: {
      columns: SVs.hiddenColumns.map((x) => x - 1),
      indicators: false
    },
    hiddenRows: {
      rows: SVs.hiddenRows.map((x) => x - 1),
      indicators: false
    },
    readOnly: SVs.disabled,
    disableVisualSelection: SVs.disabled,
    stretchH: "all"
  })));
});

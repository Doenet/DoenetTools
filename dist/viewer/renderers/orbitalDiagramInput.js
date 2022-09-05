import React, {createRef, useEffect, useState} from "../../_snowpack/pkg/react.js";
import useDoenetRenderer from "./useDoenetRenderer.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import VisibilitySensor from "../../_snowpack/pkg/react-visibility-sensor-v2.js";
const Box = styled.svg`
border: '2px solid red';
margin: 2px;
outline: none;
`;
export default React.memo(function orbitalDiagramInput(props) {
  let {name, id, SVs, actions, callAction} = useDoenetRenderer(props);
  let selectedRowIndex0 = SVs.selectedRowIndex - 1;
  let selectedBoxIndex0 = SVs.selectedBoxIndex - 1;
  orbitalDiagramInput.ignoreActionsWithoutCore = true;
  let fixed = createRef(SVs.fixed);
  fixed.current = SVs.fixed;
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
  function setSelectedRow(index) {
    if (!fixed.current) {
      callAction({
        action: actions.selectRow,
        args: {index: Number(index) + 1}
      });
    }
  }
  function setSelectedBox(index, rowNum) {
    if (!fixed.current) {
      if (rowNum !== void 0) {
        callAction({
          action: actions.selectRow,
          args: {index: Number(rowNum) + 1}
        });
      }
      callAction({
        action: actions.selectBox,
        args: {index: Number(index) + 1}
      });
    }
  }
  function updateRowText(newValue) {
    if (!fixed.current) {
      callAction({
        action: actions.updateRowText,
        args: {newValue}
      });
    }
  }
  function deselect(e) {
    if (e.relatedTarget?.id !== `orbitaladdrow${id}` && e.relatedTarget?.id !== `orbitalremoverow${id}` && e.relatedTarget?.id !== `orbitaladdbox${id}` && e.relatedTarget?.id !== `orbitaladduparrow${id}` && e.relatedTarget?.id !== `orbitaladddownarrow${id}` && e.relatedTarget?.id !== `orbitalremovearrow${id}` && e.relatedTarget?.id !== `orbitalremovebox${id}`) {
      if (e.relatedTarget?.id !== `OrbitalText${selectedRowIndex0}${id}` && e.relatedTarget?.id !== `OrbitalRow${selectedRowIndex0}${id}` && e.relatedTarget?.id.substring(0, 10 + id.length) !== `orbitalbox${id}`) {
        setSelectedRow(-1);
      }
      setSelectedBox(-1);
    }
  }
  let rowsJSX = [];
  for (let [index, row] of Object.entries(SVs.rows)) {
    let rowNumber = SVs.rows.length - index - 1;
    rowsJSX.push(/* @__PURE__ */ React.createElement(OrbitalRow, {
      key: `OrbitalRow${rowNumber}`,
      updateRowText,
      rowNumber,
      selectedRow: selectedRowIndex0,
      setSelectedRow,
      orbitalText: row.orbitalText,
      boxes: row.boxes,
      selectedBox: selectedBoxIndex0,
      setSelectedBox,
      deselect,
      name: id
    }));
  }
  let controls = null;
  if (!SVs.fixed) {
    controls = /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
      id: `orbitaladdrow${id}`,
      onBlur: (e) => {
        deselect(e);
      },
      onClick: () => {
        callAction({
          action: actions.addRow
        });
      }
    }, "Add Row"), /* @__PURE__ */ React.createElement("button", {
      id: `orbitalremoverow${id}`,
      onClick: () => {
        callAction({
          action: actions.removeRow
        });
      }
    }, "Remove Row"), /* @__PURE__ */ React.createElement("button", {
      id: `orbitaladdbox${id}`,
      onBlur: (e) => {
        deselect(e);
      },
      onClick: () => {
        callAction({
          action: actions.addBox
        });
      }
    }, "Add Box"), /* @__PURE__ */ React.createElement("button", {
      id: `orbitalremovebox${id}`,
      onBlur: (e) => {
        deselect(e);
      },
      onClick: () => {
        callAction({
          action: actions.removeBox
        });
      }
    }, "Remove Box"), /* @__PURE__ */ React.createElement("button", {
      id: `orbitaladduparrow${id}`,
      onBlur: (e) => {
        deselect(e);
      },
      onClick: () => {
        callAction({
          action: actions.addUpArrow
        });
      }
    }, "Add Up Arrow"), /* @__PURE__ */ React.createElement("button", {
      id: `orbitaladddownarrow${id}`,
      onBlur: (e) => {
        deselect(e);
      },
      onClick: () => {
        callAction({
          action: actions.addDownArrow
        });
      }
    }, "Add Down Arrow"), /* @__PURE__ */ React.createElement("button", {
      id: `orbitalremovearrow${id}`,
      onBlur: (e) => {
        deselect(e);
      },
      onClick: () => {
        callAction({
          action: actions.removeArrow
        });
      }
    }, "Remove Arrow"));
  }
  return /* @__PURE__ */ React.createElement(VisibilitySensor, {
    partialVisibility: true,
    onChange: onChangeVisibility
  }, /* @__PURE__ */ React.createElement(React.Fragment, null, controls, rowsJSX));
});
const OrbitalRow = React.memo(function OrbitalRow2({rowNumber, updateRowText, selectedRow, setSelectedRow, orbitalText, boxes, selectedBox, setSelectedBox, deselect, name}) {
  let rowStyle = {
    width: "800px",
    height: "44px",
    display: "flex",
    backgroundColor: "#E2E2E2",
    marginTop: "2px",
    marginBottom: "2px",
    padding: "2px",
    border: "white solid 2px"
  };
  if (selectedRow === rowNumber) {
    rowStyle["border"] = "#1A5A99 solid 2px";
  }
  let boxesJSX = [];
  for (let [index, code] of Object.entries(boxes)) {
    let isSelected = false;
    if (selectedRow == rowNumber && selectedBox == index) {
      isSelected = true;
    }
    boxesJSX.push(/* @__PURE__ */ React.createElement(OrbitalBox, {
      key: `OrbitalBox${rowNumber}-${index}`,
      boxNum: index,
      rowNumber,
      arrows: code,
      isSelected,
      setSelectedBox,
      name
    }));
  }
  return /* @__PURE__ */ React.createElement("div", {
    key: `OrbitalRow${rowNumber}`,
    id: `OrbitalRow${rowNumber}${name}`,
    tabIndex: "-1",
    onClick: () => {
      if (selectedRow !== rowNumber) {
        setSelectedRow(rowNumber);
      }
    },
    onBlur: (e) => {
      deselect(e);
    },
    style: rowStyle
  }, /* @__PURE__ */ React.createElement(OrbitalText, {
    orbitalText,
    rowNumber,
    updateRowText,
    name
  }), boxesJSX);
});
const OrbitalText = React.memo(function OrbitalText2({rowNumber, updateRowText, orbitalText, name}) {
  return /* @__PURE__ */ React.createElement("input", {
    id: `OrbitalText${rowNumber}${name}`,
    style: {marginRight: "4px", height: "14px"},
    type: "text",
    size: "4",
    value: orbitalText,
    onChange: (e) => {
      let newValue = e.target.value;
      updateRowText(newValue);
    }
  });
});
const OrbitalBox = React.memo(function OrbitalBox2({boxNum, arrows = "", setSelectedBox, isSelected, rowNumber, name}) {
  const firstUp = /* @__PURE__ */ React.createElement("polyline", {
    key: `orbitalboxfirstUp${boxNum}`,
    id: `firstUp${boxNum}`,
    points: "6,14 12,6 18,14 12,6 12,35",
    style: {fill: "none", stroke: "black", strokeWidth: "2"}
  });
  const firstDown = /* @__PURE__ */ React.createElement("polyline", {
    key: `orbitalboxfirstDown${boxNum}`,
    id: `firstDown${boxNum}`,
    points: "6,26 12,34 18,26 12,34 12,5",
    style: {fill: "none", stroke: "black", strokeWidth: "2"}
  });
  const secondUp = /* @__PURE__ */ React.createElement("polyline", {
    key: `orbitalboxsecondUp${boxNum}`,
    id: `secondUp${boxNum}`,
    points: "22,14 28,6 34,14 28,6 28,35",
    style: {fill: "none", stroke: "black", strokeWidth: "2"}
  });
  const secondDown = /* @__PURE__ */ React.createElement("polyline", {
    key: `orbitalboxsecondDown${boxNum}`,
    id: `secondDown${boxNum}`,
    points: "22,26 28,34 34,26 28,34 28,5",
    style: {fill: "none", stroke: "black", strokeWidth: "2"}
  });
  const thirdUp = /* @__PURE__ */ React.createElement("polyline", {
    key: `orbitalboxthirdUp${boxNum}`,
    id: `thirdUp${boxNum}`,
    points: "38,14 44,6 50,14 44,6 44,35",
    style: {fill: "none", stroke: "black", strokeWidth: "2"}
  });
  const thirdDown = /* @__PURE__ */ React.createElement("polyline", {
    key: `orbitalboxthirdDown${boxNum}`,
    id: `thirdDown${boxNum}`,
    points: "38,26 44,34 50,26 44,34 44,5",
    style: {fill: "none", stroke: "black", strokeWidth: "2"}
  });
  let arrowsJSX = [];
  let [first, second, third] = arrows.split("");
  if (first == "U") {
    arrowsJSX.push(firstUp);
  }
  if (first == "D") {
    arrowsJSX.push(firstDown);
  }
  if (second == "U") {
    arrowsJSX.push(secondUp);
  }
  if (second == "D") {
    arrowsJSX.push(secondDown);
  }
  if (third == "U") {
    arrowsJSX.push(thirdUp);
  }
  if (third == "D") {
    arrowsJSX.push(thirdDown);
  }
  let boxWidth = 40;
  if (third) {
    boxWidth = 56;
  }
  let boxColor = "black";
  let strokeWidth = "2px";
  if (isSelected) {
    boxColor = "#1A5A99";
    strokeWidth = "6px";
  }
  return /* @__PURE__ */ React.createElement(Box, {
    key: `orbitalbox${boxNum}`,
    id: `orbitalbox${name}${rowNumber}-${boxNum}`,
    tabIndex: "-1",
    onClick: (e) => {
      setSelectedBox(boxNum, rowNumber);
      e.stopPropagation();
    },
    width: boxWidth,
    height: "40"
  }, /* @__PURE__ */ React.createElement("rect", {
    x: "0",
    y: "0",
    rx: "4",
    ry: "4",
    width: boxWidth,
    height: "40",
    style: {fill: "white", stroke: boxColor, strokeWidth, fillOpacity: "1", strokeOpacity: "1"}
  }), arrowsJSX);
});

import React, {useState} from "../../_snowpack/pkg/react.js";
import useDoenetRenderer from "./useDoenetRenderer.js";
import styled from "../../_snowpack/pkg/styled-components.js";
const Box = styled.svg`
border: '2px solid red';
margin: 2px;
outline: none;
`;
export default function orbitalDiagramInput(props) {
  let {name, SVs, actions, callAction} = useDoenetRenderer(props);
  console.log("orbitalDiagramInput SVs ", SVs);
  orbitalDiagramInput.ignoreActionsWithoutCore = true;
  if (SVs.hidden) {
    return null;
  }
  function setSelectedRow(index) {
    callAction({
      action: actions.selectRow,
      args: index
    });
  }
  function setSelectedBox(index) {
    callAction({
      action: actions.selectBox,
      args: index
    });
  }
  function updateRowText(newValue) {
    callAction({
      action: actions.updateRowText,
      args: newValue
    });
  }
  function deselect(e) {
    if (e.relatedTarget?.id !== `orbitaladdrow${name}` && e.relatedTarget?.id !== `orbitalremoverow${name}` && e.relatedTarget?.id !== `orbitaladdbox${name}` && e.relatedTarget?.id !== `orbitaladduparrow${name}` && e.relatedTarget?.id !== `orbitaladddownarrow${name}` && e.relatedTarget?.id !== `orbitalremovearrow${name}` && e.relatedTarget?.id !== `orbitalremovebox${name}`) {
      if (e.relatedTarget?.id !== `OrbitalText${SVs.selectedRowIndex}${name}` && e.relatedTarget?.id !== `OrbitalRow${SVs.selectedRowIndex}${name}` && e.relatedTarget?.id.substring(0, 10 + name.length) !== `orbitalbox${name}`) {
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
      selectedRow: SVs.selectedRowIndex,
      setSelectedRow,
      orbitalText: row.orbitalText,
      boxes: row.boxes,
      selectedBox: SVs.selectedBoxIndex,
      setSelectedBox,
      deselect,
      name
    }));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
    id: `orbitaladdrow${name}`,
    onBlur: (e) => {
      deselect(e);
    },
    onClick: () => {
      callAction({
        action: actions.addRow
      });
    }
  }, "Add Row"), /* @__PURE__ */ React.createElement("button", {
    id: `orbitalremoverow${name}`,
    onClick: () => {
      callAction({
        action: actions.removeRow
      });
    }
  }, "Remove Row"), /* @__PURE__ */ React.createElement("button", {
    id: `orbitaladdbox${name}`,
    onBlur: (e) => {
      deselect(e);
    },
    onClick: () => {
      callAction({
        action: actions.addBox
      });
    }
  }, "Add Box"), /* @__PURE__ */ React.createElement("button", {
    id: `orbitalremovebox${name}`,
    onBlur: (e) => {
      deselect(e);
    },
    onClick: () => {
      callAction({
        action: actions.removeBox
      });
    }
  }, "Remove Box"), /* @__PURE__ */ React.createElement("button", {
    id: `orbitaladduparrow${name}`,
    onBlur: (e) => {
      deselect(e);
    },
    onClick: () => {
      callAction({
        action: actions.addUpArrow
      });
    }
  }, "Add Up Arrow"), /* @__PURE__ */ React.createElement("button", {
    id: `orbitaladddownarrow${name}`,
    onBlur: (e) => {
      deselect(e);
    },
    onClick: () => {
      callAction({
        action: actions.addDownArrow
      });
    }
  }, "Add Down Arrow"), /* @__PURE__ */ React.createElement("button", {
    id: `orbitalremovearrow${name}`,
    onBlur: (e) => {
      deselect(e);
    },
    onClick: () => {
      callAction({
        action: actions.removeArrow
      });
    }
  }, "Remove Arrow")), rowsJSX);
}
function OrbitalRow({rowNumber, updateRowText, selectedRow, setSelectedRow, orbitalText, boxes, selectedBox, setSelectedBox, deselect, name}) {
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
}
function OrbitalText({rowNumber, updateRowText, orbitalText, name}) {
  return /* @__PURE__ */ React.createElement("input", {
    id: `OrbitalText${rowNumber}${name}`,
    style: {marginRight: "4px", height: "14px"},
    type: "text",
    size: "4",
    value: orbitalText,
    onChange: (e) => {
      let newValue = e.target.value;
      console.log("newValue", newValue);
      updateRowText(newValue);
    }
  });
}
function OrbitalBox({boxNum, arrows = "", setSelectedBox, isSelected, rowNumber, name}) {
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
    onClick: () => {
      setSelectedBox(boxNum);
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
}

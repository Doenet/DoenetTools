import React, { createRef, useEffect, useState } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import Button from "../../_reactComponents/PanelHeaderComponents/Button";
import styled from "styled-components";
import VisibilitySensor from "react-visibility-sensor-v2";

// border: ${(props) => (props.alert ? '2px solid #C1292E' : '2px solid black')};

const Box = styled.svg`
  border: "2px solid red";
  margin: 2px;
  outline: none;
`;

export default React.memo(function orbitalDiagramInput(props) {
  let { name, id, SVs, actions, callAction } = useDoenetRenderer(props);
  // console.log("orbitalDiagramInput SVs ", SVs);

  let selectedRowIndex0 = SVs.selectedRowIndex - 1;
  let selectedBoxIndex0 = SVs.selectedBoxIndex - 1;

  orbitalDiagramInput.ignoreActionsWithoutCore = () => true;

  // use ref for fixed so changed value appears in callbacks
  let fixed = createRef(SVs.fixed);
  fixed.current = SVs.fixed;

  let onChangeVisibility = (isVisible) => {
    callAction({
      action: actions.recordVisibilityChange,
      args: { isVisible },
    });
  };

  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: { isVisible: false },
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
        args: { index: Number(index) + 1 },
      });
    }
  }

  function setSelectedBox(index, rowNum) {
    if (!fixed.current) {
      if (rowNum !== undefined) {
        callAction({
          action: actions.selectRow,
          args: { index: Number(rowNum) + 1 },
        });
      }
      callAction({
        action: actions.selectBox,
        args: { index: Number(index) + 1 },
      });
    }
  }

  function updateRowText(newValue) {
    if (!fixed.current) {
      callAction({
        action: actions.updateRowText,
        args: { newValue },
      });
    }
  }

  function deselect(e) {
    if (
      e.relatedTarget?.id !== `orbitaladdrow${id}` &&
      e.relatedTarget?.id !== `orbitalremoverow${id}` &&
      e.relatedTarget?.id !== `orbitaladdbox${id}` &&
      e.relatedTarget?.id !== `orbitaladduparrow${id}` &&
      e.relatedTarget?.id !== `orbitaladddownarrow${id}` &&
      e.relatedTarget?.id !== `orbitalremovearrow${id}` &&
      e.relatedTarget?.id !== `orbitalremovebox${id}`
    ) {
      if (
        e.relatedTarget?.id !== `OrbitalText${selectedRowIndex0}${id}` &&
        e.relatedTarget?.id !== `OrbitalRow${selectedRowIndex0}${id}` &&
        e.relatedTarget?.id.substring(0, 10 + id.length) !== `orbitalbox${id}`
      ) {
        setSelectedRow(-1);
      }
      setSelectedBox(-1);
    }
  }

  let rowsJSX = [];
  for (let [index, row] of Object.entries(SVs.rows)) {
    let rowNumber = SVs.rows.length - index - 1;
    rowsJSX.push(
      <OrbitalRow
        key={`OrbitalRow${rowNumber}`}
        updateRowText={updateRowText}
        rowNumber={rowNumber}
        selectedRow={selectedRowIndex0}
        setSelectedRow={setSelectedRow}
        orbitalText={row.orbitalText}
        boxes={row.boxes}
        selectedBox={selectedBoxIndex0}
        setSelectedBox={setSelectedBox}
        deselect={deselect}
        name={id}
      />,
    );
  }

  let controls = null;

  if (!SVs.fixed) {
    controls = (
      <div>
        <div style={{ display: "inline-block", marginRight: "4px" }}>
          <Button
            id={`orbitaladdrow${id}`}
            onBlur={(e) => {
              deselect(e);
            }}
            onClick={() => {
              callAction({
                action: actions.addRow,
              });
            }}
            value="Add Row"
          />
        </div>
        <div style={{ display: "inline-block", marginRight: "4px" }}>
          <Button
            id={`orbitalremoverow${id}`}
            onClick={() => {
              callAction({
                action: actions.removeRow,
              });
            }}
            value="Remove Row"
          />
        </div>

        <div style={{ display: "inline-block", marginRight: "4px" }}>
          <Button
            id={`orbitaladdbox${id}`}
            onBlur={(e) => {
              deselect(e);
            }}
            onClick={() => {
              callAction({
                action: actions.addBox,
              });
            }}
            value="Add Box"
          />
        </div>

        <div style={{ display: "inline-block", marginRight: "4px" }}>
          <Button
            id={`orbitalremovebox${id}`}
            onBlur={(e) => {
              deselect(e);
            }}
            onClick={() => {
              callAction({
                action: actions.removeBox,
              });
            }}
            value="Remove Box"
          />
        </div>

        <div style={{ display: "inline-block", marginRight: "4px" }}>
          <Button
            id={`orbitaladduparrow${id}`}
            onBlur={(e) => {
              deselect(e);
            }}
            onClick={() => {
              callAction({
                action: actions.addUpArrow,
              });
            }}
            value="Add Up Arrow"
          />
        </div>

        <div style={{ display: "inline-block", marginRight: "4px" }}>
          <Button
            id={`orbitaladddownarrow${id}`}
            onBlur={(e) => {
              deselect(e);
            }}
            onClick={() => {
              callAction({
                action: actions.addDownArrow,
              });
            }}
            value="Add Down Arrow"
          />
        </div>

        <div style={{ display: "inline-block", marginRight: "4px" }}>
          <Button
            id={`orbitalremovearrow${id}`}
            onBlur={(e) => {
              deselect(e);
            }}
            onClick={() => {
              callAction({
                action: actions.removeArrow,
              });
            }}
            value="Remove Arrow"
          />
        </div>
      </div>
    );
  }
  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <>
        {controls}
        {rowsJSX}
      </>
    </VisibilitySensor>
  );
});

const OrbitalRow = React.memo(function OrbitalRow({
  rowNumber,
  updateRowText,
  selectedRow,
  setSelectedRow,
  orbitalText,
  boxes,
  selectedBox,
  setSelectedBox,
  deselect,
  name,
}) {
  let rowStyle = {
    width: "800px",
    height: "44px",
    display: "flex",
    backgroundColor: "#E2E2E2",
    marginTop: "2px",
    marginBottom: "2px",
    padding: "2px",
    border: "white solid 2px",
  };
  if (selectedRow === rowNumber) {
    rowStyle["border"] = "#1A5A99 solid 2px";
    // rowStyle['backgroundColor'] = '#1A5A99';
  }

  //Make boxes
  let boxesJSX = [];
  for (let [index, code] of Object.entries(boxes)) {
    let isSelected = false;
    // console.log("selectedBox === index",selectedBox,index,selectedBox === index,selectedBox == index)
    if (selectedRow == rowNumber && selectedBox == index) {
      isSelected = true;
    }
    boxesJSX.push(
      <OrbitalBox
        key={`OrbitalBox${rowNumber}-${index}`}
        boxNum={index}
        rowNumber={rowNumber}
        arrows={code}
        isSelected={isSelected}
        setSelectedBox={setSelectedBox}
        name={name}
      />,
    );
  }

  return (
    <div
      key={`OrbitalRow${rowNumber}`}
      id={`OrbitalRow${rowNumber}${name}`}
      tabIndex="-1"
      onClick={() => {
        if (selectedRow !== rowNumber) {
          setSelectedRow(rowNumber);
        }
      }}
      onBlur={(e) => {
        deselect(e);
      }}
      style={rowStyle}
    >
      {/* <span style={{marginRight:"2px"}}>row {rowNumber + 1}</span> */}
      <OrbitalText
        orbitalText={orbitalText}
        rowNumber={rowNumber}
        updateRowText={updateRowText}
        name={name}
      />
      {boxesJSX}
    </div>
  );
});

const OrbitalText = React.memo(function OrbitalText({
  rowNumber,
  updateRowText,
  orbitalText,
  name,
}) {
  return (
    <input
      id={`OrbitalText${rowNumber}${name}`}
      style={{ marginRight: "4px", height: "14px" }}
      type="text"
      size="4"
      value={orbitalText}
      onChange={(e) => {
        let newValue = e.target.value;
        updateRowText(newValue);
      }}
    />
  );
});

const OrbitalBox = React.memo(function OrbitalBox({
  boxNum,
  arrows = "",
  setSelectedBox,
  isSelected,
  rowNumber,
  name,
}) {
  const firstUp = (
    <polyline
      key={`orbitalboxfirstUp${boxNum}`}
      id={`firstUp${boxNum}`}
      points="6,14 12,6 18,14 12,6 12,35"
      style={{ fill: "none", stroke: "black", strokeWidth: "2" }}
    />
  );
  const firstDown = (
    <polyline
      key={`orbitalboxfirstDown${boxNum}`}
      id={`firstDown${boxNum}`}
      points="6,26 12,34 18,26 12,34 12,5"
      style={{ fill: "none", stroke: "black", strokeWidth: "2" }}
    />
  );
  const secondUp = (
    <polyline
      key={`orbitalboxsecondUp${boxNum}`}
      id={`secondUp${boxNum}`}
      points="22,14 28,6 34,14 28,6 28,35"
      style={{ fill: "none", stroke: "black", strokeWidth: "2" }}
    />
  );
  const secondDown = (
    <polyline
      key={`orbitalboxsecondDown${boxNum}`}
      id={`secondDown${boxNum}`}
      points="22,26 28,34 34,26 28,34 28,5"
      style={{ fill: "none", stroke: "black", strokeWidth: "2" }}
    />
  );
  const thirdUp = (
    <polyline
      key={`orbitalboxthirdUp${boxNum}`}
      id={`thirdUp${boxNum}`}
      points="38,14 44,6 50,14 44,6 44,35"
      style={{ fill: "none", stroke: "black", strokeWidth: "2" }}
    />
  );
  const thirdDown = (
    <polyline
      key={`orbitalboxthirdDown${boxNum}`}
      id={`thirdDown${boxNum}`}
      points="38,26 44,34 50,26 44,34 44,5"
      style={{ fill: "none", stroke: "black", strokeWidth: "2" }}
    />
  );

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

  return (
    <Box
      key={`orbitalbox${boxNum}`}
      id={`orbitalbox${name}${rowNumber}-${boxNum}`}
      tabIndex="-1"
      onClick={(e) => {
        setSelectedBox(boxNum, rowNumber);
        e.stopPropagation();
      }}
      width={boxWidth}
      height="40"
    >
      <rect
        x="0"
        y="0"
        rx="4"
        ry="4"
        width={boxWidth}
        height="40"
        style={{
          fill: "white",
          stroke: boxColor,
          strokeWidth: strokeWidth,
          fillOpacity: "1",
          strokeOpacity: "1",
        }}
      />
      {arrowsJSX}
    </Box>
  );
});

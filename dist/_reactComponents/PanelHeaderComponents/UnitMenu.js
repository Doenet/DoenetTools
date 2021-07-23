import React, {useState, useEffect, useRef} from "../../_snowpack/pkg/react.js";
import styled, {css} from "../../_snowpack/pkg/styled-components.js";
import "./theme.css.proxy.js";
const Textfield = styled.input`
  border-radius: 5px;
  border: 2px solid black;
  z-index: 0;
  height: 24px;
  width: 48px;
  bottom: 10px;
  padding: 0px 36px 0px 2px;
  text-align: center;
  resize: none;
`;
const Label = styled.p`
  font-size: 14px;
  display: none;
  margin-right: 5px;
  text-align: center;
  ${(props) => props.visible === "True" && css`
      display: inline;
    `};
`;
const Container = styled.div`
  display: flex;
  align-items: center;
`;
const LabelContainer = styled.div`
    display: ${(props) => props.align};
`;
const Units = styled.button`
  background-color: #1a5a99;
  border-radius: 0px 3px 3px 0px;
  border: 2px hidden;
  height: 24px;
  width: 34px;
  position: relative;
  color: white;
  font-size: 12px;
  right: 36px;
  :hover {
    cursor: pointer;
  }
`;
const Unit = styled.div`
  display: none;
  position: relative;
  background-color: #e2e2e2;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  border: 2px black;
  border-radius: 5px;
  ${Units}:hover & {
    display: block;
  }
`;
const Unitoption = styled.button`
  background-color: #e2e2e2;
  display: block;
  width: 48px;
  height: 24px;
  border: 1px black solid;
  :hover {
    cursor: pointer;
  }
  ${(props) => props.selected === "True" && css`
      background: #8fb8de;
      color: black;
    `};
`;
export default function UnitMenu(props) {
  const listOfUnits = props.units;
  var listOfOptions = listOfUnits;
  var listOfDefaults;
  if (props.defaults) {
    listOfDefaults = props.defaults;
    listOfOptions = listOfUnits.concat(listOfDefaults);
  }
  const labelVisible = props.label ? "True" : "False";
  var labelvalue = "Label: ";
  const [unitIndex, setUnitIndex] = useState(-1);
  const [currentUnit, setCurrentUnit] = useState("-");
  const [currentValue, setCurrentValue] = useState("");
  const [moveCursor, setMoveCursor] = useState(false);
  let initialClickLabelPosition = useRef(null);
  var align = "flex";
  if (props.vertical) {
    align = "static";
  }
  const updateValueDuringDrag = (e) => {
    setCurrentValue(incrementUsingCurrentValue(e, initialClickLabelPosition, currentValue));
  };
  function incrementUsingCurrentValue(ev, initialClickLabelPosition2, currentValue2) {
    return Number(findNewValueDuringDrag(ev, initialClickLabelPosition2)) + Number(currentValue2);
  }
  function findNewValueDuringDrag(ev, initialClickLabelPosition2) {
    var abX = ev.clientX - initialClickLabelPosition2.current[0];
    var abY = ev.clientY - initialClickLabelPosition2.current[1];
    var calcDist = Math.sqrt(abX ** 2 + abY ** 2);
    if (calcDist > 100) {
      calcDist = calcDist * 1.5;
    }
    if (calcDist > 200) {
      calcDist = calcDist * 2;
    }
    if (calcDist > 500) {
      calcDist = calcDist * 2.5;
    }
    if (calcDist > 1e3) {
      calcDist = calcDist * 3;
    }
    if (calcDist > 1e4) {
      calcDist = calcDist * 4;
    }
    if (abX < 0) {
      var newVal = Math.round(calcDist * -1);
    } else {
      newVal = Math.round(calcDist);
    }
    return newVal;
  }
  function start() {
    setMoveCursor(true);
    window.addEventListener("mousemove", updateValueDuringDrag);
    window.addEventListener("mouseup", () => {
      window.removeEventListener("mouseup", updateValueDuringDrag);
      window.removeEventListener("mousemove", updateValueDuringDrag);
    });
  }
  function displayUnit(value) {
    if (listOfUnits.includes(value)) {
      setCurrentUnit(value);
      if (listOfDefaults && listOfDefaults.includes(currentValue)) {
        setCurrentValue("");
      }
    }
    if (listOfDefaults && listOfDefaults.includes(value)) {
      setCurrentUnit("-");
      setCurrentValue(value);
    }
    setUnitIndex(listOfOptions.indexOf(value));
  }
  function updateUnit() {
    var myRe = /^(\d*)\s*(\D*)$/m;
    var valueArray = myRe.exec(currentValue);
    var unit = valueArray[2].toLowerCase();
    if (listOfUnits.includes(unit.toUpperCase())) {
      displayUnit(unit.toUpperCase());
      setCurrentValue(valueArray[1]);
    }
    if (listOfDefaults && listOfDefaults.includes(unit.charAt(0).toUpperCase() + unit.slice(1))) {
      setCurrentUnit("-");
      setCurrentValue(unit.charAt(0).toUpperCase() + unit.slice(1));
      if (props.onChange)
        props.onChange("");
    }
  }
  function changeValue(e) {
    setCurrentValue(e.target.value);
    if (props.onChange)
      props.onChange(e.target.value + " " + currentUnit);
  }
  function enterKey(e, textfield) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code === 13) {
      updateUnit();
    }
  }
  if (props.label) {
    labelvalue = props.label;
  }
  var unitComponents = [];
  for (let i = 0; i < listOfOptions.length; i++) {
    unitComponents.push(/* @__PURE__ */ React.createElement(Unitoption, {
      id: i,
      onClick: () => {
        displayUnit(listOfOptions[i]);
      },
      selected: i === unitIndex ? "True" : "False"
    }, listOfOptions[i]));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(LabelContainer, {
    align
  }, /* @__PURE__ */ React.createElement(Label, {
    visible: labelVisible,
    onMouseDown: (e) => {
      initialClickLabelPosition.current = [e.clientX, e.clientY];
      start();
    },
    className: "noselect"
  }, labelvalue), /* @__PURE__ */ React.createElement(Container, null, /* @__PURE__ */ React.createElement(Textfield, {
    id: "text",
    type: "text",
    value: currentValue,
    onBlur: () => {
      updateUnit();
    },
    onKeyPress: () => {
      enterKey(event, this);
    },
    onChange: () => {
      changeValue(event);
    }
  }), /* @__PURE__ */ React.createElement(Units, null, currentUnit, /* @__PURE__ */ React.createElement(Unit, {
    id: "unit"
  }, unitComponents)))));
}

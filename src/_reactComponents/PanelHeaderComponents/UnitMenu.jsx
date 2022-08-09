import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import "./theme.css";

const Textfield = styled.input`
  border-radius: var(--mainBorderRadius);
  border: ${props => props.alert};
  z-index: 0;
  height: 24px;
  width: 48px;
  bottom: 10px;
  padding: 0px 36px 0px 2px;
  text-align: center;
  resize: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'auto'};
  &:focus {
    outline: ${props => props.alert};
    outline-offset: 2px;
  }
`;

const Label = styled.p`
  font-size: 14px;
  display: none;
  margin-right: 5px;
  text-align: center;
  ${(props) =>
    props.visible === "True" &&
    css`
      display: inline;
    `};
`;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const LabelContainer = styled.div`
    display: ${props => props.align};
`;

const Units = styled.button`
  background-color: ${props => props.disabled ? 'var(--mainGray)' : 'var(--mainBlue)'};
  border-radius: 0px 3px 3px 0px;
  border: 2px hidden;
  height: 24px;
  width: 34px;
  position: relative;
  color: ${props => props.disabled ? 'var(--canvastext)' : 'var(--canvas)'};
  font-size: 12px;
  right: 36px;

  &:hover { // Button color lightens on hover
    color: var(--canvastext);
    background-color: ${props => props.disabled ? 'none' : 'var(--lightBlue)'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  };

  &:focus {
    outline: ${props => props.alert};
    outline-offset: 4px;
  }
`;

const Unit = styled.div`
  display: none;
  position: relative;
  background-color: var(--mainGray);
  box-shadow: 0px 8px 16px 0px var(--mainGray);
  z-index: 9999;
  border: var(--mainBorder);
  border-radius: var(--mainBorderRadius);
  ${Units}:hover & {
    display: ${props => props.disabled ? 'none' : 'block'};
  };
`;

const Unitoption = styled.button`
  background-color: var(--mainGray);
  display: block;
  width: 48px;
  height: 24px;
  border: 1px var(--canvastext) solid;
  :hover {
    cursor: pointer;
  };
  ${(props) =>
    props.selected === "True" &&
    css`
      background: var(--solidLightBlue);
      color: var(--canvastext);
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
    const [currentValue, setCurrentValue] = useState(props.value ? props.value : '');
    const [moveCursor, setMoveCursor] = useState(false);
    let initialClickLabelPosition = useRef(null);

    var align = 'flex';
    if (props.vertical) {
      align = 'static';
    };

    const updateValueDuringDrag = (e) => {
      // setCurrentValue(findNewValueDuringDrag(e, initialClickLabelPosition));
      setCurrentValue(incrementUsingCurrentValue(e, initialClickLabelPosition, currentValue));
      // setMoveCursor(false);
    };

    function incrementUsingCurrentValue(ev, initialClickLabelPosition, currentValue) {
      return (Number(findNewValueDuringDrag(ev, initialClickLabelPosition)) + Number(currentValue));
    };

    function findNewValueDuringDrag(ev, initialClickLabelPosition) {
      var abX = ev.clientX - initialClickLabelPosition.current[0];
      var abY = ev.clientY - initialClickLabelPosition.current[1];
      var calcDist = Math.sqrt((abX ** 2) + (abY ** 2));
      if (calcDist > 100) {
        calcDist = calcDist * 1.5;
      };
      if (calcDist > 200) {
        calcDist = calcDist * 2;
      };
      if (calcDist > 500) {
        calcDist = calcDist * 2.5;
      };
      if (calcDist > 1000) {
        calcDist = calcDist * 3;
      };
      if (calcDist > 10000) {
        calcDist = calcDist * 4;
      };
      if (abX < 0) {
        var newVal = Math.round(calcDist * -1);
      } else {
        newVal = Math.round(calcDist);
      };
      return newVal;
    };

    function start() {
      setMoveCursor(true);
      window.addEventListener("mousemove", updateValueDuringDrag);
      window.addEventListener("mouseup", () => {
        window.removeEventListener("mouseup", updateValueDuringDrag);
        window.removeEventListener("mousemove", updateValueDuringDrag);
      });
    };
    
    function displayUnit(value) {
      if (listOfUnits.includes(value)) {
        setCurrentUnit(value);
        if (listOfDefaults && listOfDefaults.includes(currentValue)) {
            setCurrentValue('');
        };
      };
      if (listOfDefaults && listOfDefaults.includes(value)) {
        setCurrentUnit("-");
        setCurrentValue(value);
      };
      setUnitIndex(listOfOptions.indexOf(value));
    };
    
    function updateUnit() {
      //changes display based on user input
      var myRe = /^(\d*)\s*(\D*)$/m;
      var valueArray = myRe.exec(currentValue);
      var unit = valueArray[2].toLowerCase();
      if (listOfUnits.includes(unit.toUpperCase())) {
        displayUnit(unit.toUpperCase());
        setCurrentValue(valueArray[1]);
      };
      if (listOfDefaults && listOfDefaults.includes(unit.charAt(0).toUpperCase() + unit.slice(1))) {
        setCurrentUnit("-");
        setCurrentValue(unit.charAt(0).toUpperCase() + unit.slice(1));
        if (props.onChange) props.onChange('')
      };
    };
    
    function changeValue(e) {
      setCurrentValue(e.target.value);
      if (props.onChange) props.onChange(e.target.value + ' ' + currentUnit);
    };

    function enterKey(e, textfield) {
      var code = e.keyCode ? e.keyCode : e.which;
      if (code === 13) {
        updateUnit();
      };
    };
  
    if (props.label) {
      labelvalue = props.label;
    };
  
    var unitComponents = [];
    for (let i = 0; i < listOfOptions.length; i++) {
      unitComponents.push(
        <Unitoption
          id={i}
          onClick={() => {
            displayUnit(listOfOptions[i]);
          }}
          selected={i === unitIndex ? "True" : "False"}
        >
          {listOfOptions[i]}
        </Unitoption>
      );
    };

    var alert = 'var(--mainBorder)';
    if (props.alert) {
      alert = '2px solid var(--mainRed)';
    };

    var disabled = false;
    if (props.disabled) {
      disabled = true;
    };
  
    return (
      <>
        <LabelContainer align={align}>
          <Label
            id="unitmenu-label"
            visible={labelVisible}
            onMouseDown={(e) => {
              initialClickLabelPosition.current = [e.clientX, e.clientY]
              start()
            }}
            className='noselect'
          >
            {labelvalue}
          </Label>
          <Container>
            <Textfield
              aria-labelledby="unitmenu-label"
              aria-disabled={props.disabled ? true : false}
              disabled={disabled}
              id="text"
              type="text"
              value={currentValue}
              alert={alert}
              onBlur={() => {
                updateUnit();
              }}
              onKeyPress={() => {
                enterKey(event, this);
              }}
              onChange={() => {changeValue(event)}}
            ></Textfield>
              <Units aria-disabled={props.disabled ? true : false} disabled={disabled} alert={alert} aria-haspopup="true">
                {currentUnit}
                <Unit id="unit" disabled={disabled}>{unitComponents}</Unit>
              </Units>
            
          </Container>
        </LabelContainer>
      </>
    );
};
import styled, { css } from "styled-components";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

/*
Text input with increment and decrement buttons. Also has dropdown menu to select given values

USE:
For font:
<IncrementMenu font />

For numerical range (inclusive):
<IncrementMenu range={[0, 15]} />

For given values:
<IncrementMenu values={["A", "B", "C", "D", "F"]} />
*/

const Container = styled.div`
  position: relative;
  display: ${props => props.align};
  align-items: center;
  width: auto;
`;

const Textfield = styled.input`
  border-radius: 5px;
  border: ${props => props.alert ? '2px solid #C1292E' : '2px solid black'};
  z-index: 0;
  height: 24px;
  width: 46px;
  bottom: 10px;
  padding: 0px 36px 0px 36px;
  text-align: center;
  resize: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'default'}
`;

const IncreaseButton = styled.button`
  background-color: ${props => props.disabled ? '#e2e2e2' : '#1a5a99'};
  border-radius: 0px 3px 3px 0px;
  border: 2px hidden;
  height: 24px;
  width: 34px;
  position: relative;
  color: ${props => props.disabled ? 'black' : 'white'};
  font-size: 18px;
  right: 70px;
  :hover {
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  }
`;

const DecreaseButton = styled.button`
  background-color: ${props => props.disabled ? '#e2e2e2' : '#1a5a99'};
  border-radius: 3px 0px 0px 3px;
  border: 2px hidden;
  height: 24px;
  width: 34px;
  position: relative;
  color: ${props => props.disabled ? 'black' : 'white'};
  font-size: 18px;
  left: -120px;
  :hover {
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  }
`;

const Menu = styled.div`
  display: none;
  position: absolute;
  background-color: #e2e2e2;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  border: 2px black;
  border-radius: 5px;
  left: 38px;
  top: 30px;
`;

const MenuOptions = styled.button`
  background-color: #e2e2e2;
  display: block;
  width: 48px;
  height: 24px;
  border: 1px black solid;
  :hover {
    cursor: pointer;
  }
`;

const Label = styled.p`
  font-size: 12px;
  display: ${props => props.labelVisible};
  margin-right: 5px;
  margin-bottom: ${props => props.align == 'flex' ? 'none' : '0px'};
`


export default function Increment(props) {
  var values;
  var sizes;
  var menuComponents = [];
  const [currentValue, setCurrentValue] = useState(props.value ? props.value : "");
  var align = 'flex';
  //Button icons
  var decreaseIcon = "-";
  var increaseIcon = "+";
  if (props.values) {
    decreaseIcon = <FontAwesomeIcon icon={faAngleLeft} />;
    increaseIcon = <FontAwesomeIcon icon={faAngleRight} />;
  }

  function valueChange(data) {
    if (props.onChange) {
      props.onChange(data);
    }
    setCurrentValue(data);
  }

  //Creation of dropdown menus
  if (props.range) {
    for (let i = props.range[0]; i <= props.range[1]; i++) {
      menuComponents.push(
        <MenuOptions
          id={i}
          onClick={function (e) {
            valueChange(i);
            // setCurrentValue(i);
            // props.onValueChange(i);
          }}
        >
          {i}
        </MenuOptions>
      );
    }
  }
  if (props.font) {
    sizes = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96];
    for (let i = 0; i < sizes.length; i++) {
      menuComponents.push(
        <MenuOptions
          id={i}
          onClick={function (e) {
            // setCurrentValue(sizes[i]);
            // props.onValueChange(sizes[i]);
            valueChange(sizes[i]);
          }}
        >
          {sizes[i]}
        </MenuOptions>
      );
    }
  }
  if (props.values) {
    values = props.values;
    for (let i = 0; i < values.length; i++) {
      menuComponents.push(
        <MenuOptions
          id={i}
          onClick={function (e) {
            valueChange(values[i]);
            // setCurrentValue(values[i]);
            // props.onValueChange(values[i]);
          }}
        >
          {values[i]}
        </MenuOptions>
      );
    }
  }

  function changeValue(e) {
    valueChange(e.target.value);
    // setCurrentValue(e.target.value);
    // props.onValueChange(e.target.value);
  }

  function decrement() {
    if (props.values) {
      var index = values.indexOf(currentValue);
      // setCurrentIndex();
      if (index !== -1 && index !== 0 && index < values.length) {
        valueChange(values[index-1]);
        // setCurrentValue(values[index - 1]);
        // props.onValueChange(values[index - 1]);
      } else if (index === -1) {
        // setCurrentValue(values[0]);
        // props.onValueChange(values[0]);
        valueChange(values[0]);
      } else {
        // setCurrentValue(values[values.length - 1]);
        // props.onValueChange(values[values.length - 1]);
        valueChange(values[values.length - 1]);
      }
    } else if (props.range) {
      if (props.range[0] <= Number(currentValue) - 1) {
        // setCurrentValue(Number(currentValue) - 1);
        // props.onValueChange(Number(currentValue) - 1);
        valueChange(Number(currentValue) - 1);
      }
    } else {
      // setCurrentValue(Number(currentValue) - 1);
      // props.onValueChange(Number(currentValue) - 1);
      valueChange(Number(currentValue) - 1);
    }
  }

  function increment() {
    if (props.values) {
      // console.log(values.length);
      var index = values.indexOf(currentValue);
      // setCurrentIndex();
      // console.log(currentIndex);
      if (index !== -1 && index < values.length - 1) {
        // console.log("are you there?");
        // setCurrentValue(values[index + 1]);
        // props.onValueChange(values[index + 1]);
        valueChange(values[index + 1]);
      } else if (index === -1) {
        // setCurrentValue(values[values.length - 1]);
        // props.onValueChange(values[values.length - 1]);
        valueChange(values[values.length - 1]);
      } else {
        // setCurrentValue(values[0]);
        // props.onValueChange(values[0]);
        valueChange(values[0]);
      }
    } else if (props.range) {
      if (props.range[1] >= Number(currentValue) + 1) {
        valueChange(Number(currentValue) + 1);
        // setCurrentValue(Number(currentValue) + 1);
        // props.onValueChange(Number(currentValue) + 1);
      }
    } else {
      valueChange(Number(currentValue) + 1);
      // setCurrentValue(Number(currentValue) + 1);
      // props.onValueChange(Number(currentValue) + 1);
    }
  }

  function displayMenu() {
    document.getElementById("menu").style.display = "block";
  }

  function hideMenu() {
    document.getElementById("menu").style.display = "none";
  }

  const [labelVisible, setLabelVisible] = useState(props.label ? 'static' : 'none');
  var label = '';
  if (props.label) {
    label = props.label;
    if (props.vertical) {
      align = 'static';
    }
  }
  var alert = false; 
  if (props.alert) {
    alert = true;
  }
  var disabled = false;
  if (props.disabled) {
    disabled = true;
  }

  return (
    <>
      <Container align={align}>
        <Label labelVisible={labelVisible} align={align}>{label}</Label>
        <Textfield
          alert={alert}
          disabled={disabled}
          value={currentValue}
          onClick={() => {
            displayMenu();
          }}
          onChange={(data) => {
            changeValue(data);
            
          }}
        ></Textfield>

        <DecreaseButton
          disabled={disabled}
          onClick={() => {
            decrement();
          }}
        >
          {decreaseIcon}
        </DecreaseButton>

        <IncreaseButton
          disabled={disabled}
          onClick={() => {
            increment();
          }}
        >
          {increaseIcon}
        </IncreaseButton>

        <Menu
          id="menu"
          onMouseLeave={() => {
            hideMenu();
          }}
        >
          {menuComponents}
        </Menu>
      </Container>
    </>
  );
}

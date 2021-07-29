import styled, {css} from "../../_snowpack/pkg/styled-components.js";
import {faAngleRight, faAngleLeft} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import React, {useState} from "../../_snowpack/pkg/react.js";
const Container = styled.div`
  position: relative;
  display: ${(props) => props.align};
  align-items: center;
  width: auto;
`;
const Textfield = styled.input`
  border-radius: 5px;
  border: ${(props) => props.alert ? "2px solid #C1292E" : "2px solid black"};
  z-index: 0;
  height: 24px;
  width: 46px;
  bottom: 10px;
  padding: 0px 36px 0px 36px;
  text-align: center;
  resize: none;
  cursor: ${(props) => props.disabled ? "not-allowed" : "default"}
`;
const IncreaseButton = styled.button`
  background-color: ${(props) => props.disabled ? "#e2e2e2" : "#1a5a99"};
  border-radius: 0px 3px 3px 0px;
  border: 2px hidden;
  height: 24px;
  width: 34px;
  position: relative;
  color: ${(props) => props.disabled ? "black" : "white"};
  font-size: 18px;
  right: 70px;
  :hover {
    cursor: ${(props) => props.disabled ? "not-allowed" : "pointer"};
  }
`;
const DecreaseButton = styled.button`
  background-color: ${(props) => props.disabled ? "#e2e2e2" : "#1a5a99"};
  border-radius: 3px 0px 0px 3px;
  border: 2px hidden;
  height: 24px;
  width: 34px;
  position: relative;
  color: ${(props) => props.disabled ? "black" : "white"};
  font-size: 18px;
  left: -120px;
  :hover {
    cursor: ${(props) => props.disabled ? "not-allowed" : "pointer"};
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
  display: ${(props) => props.labelVisible};
  margin-right: 5px;
  margin-bottom: ${(props) => props.align == "flex" ? "none" : "0px"};
`;
export default function Increment(props) {
  var values;
  var sizes;
  var menuComponents = [];
  const [currentValue, setCurrentValue] = useState("");
  var align = "flex";
  var decreaseIcon = "-";
  var increaseIcon = "+";
  if (props.values) {
    decreaseIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faAngleLeft
    });
    increaseIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faAngleRight
    });
  }
  function valueChange(data) {
    if (props.onChange) {
      props.onChange(data);
    }
    setCurrentValue(data);
  }
  if (props.range) {
    for (let i = props.range[0]; i <= props.range[1]; i++) {
      menuComponents.push(/* @__PURE__ */ React.createElement(MenuOptions, {
        id: i,
        onClick: function(e) {
          valueChange(i);
        }
      }, i));
    }
  }
  if (props.font) {
    sizes = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96];
    for (let i = 0; i < sizes.length; i++) {
      menuComponents.push(/* @__PURE__ */ React.createElement(MenuOptions, {
        id: i,
        onClick: function(e) {
          valueChange(sizes[i]);
        }
      }, sizes[i]));
    }
  }
  if (props.values) {
    values = props.values;
    for (let i = 0; i < values.length; i++) {
      menuComponents.push(/* @__PURE__ */ React.createElement(MenuOptions, {
        id: i,
        onClick: function(e) {
          valueChange(values[i]);
        }
      }, values[i]));
    }
  }
  function changeValue(e) {
    valueChange(e.target.value);
  }
  function decrement() {
    if (props.values) {
      var index = values.indexOf(currentValue);
      if (index !== -1 && index !== 0 && index < values.length) {
        valueChange(values[index - 1]);
      } else if (index === -1) {
        valueChange(values[0]);
      } else {
        valueChange(values[values.length - 1]);
      }
    } else if (props.range) {
      if (props.range[0] <= Number(currentValue) - 1) {
        valueChange(Number(currentValue) - 1);
      }
    } else {
      valueChange(Number(currentValue) - 1);
    }
  }
  function increment() {
    if (props.values) {
      var index = values.indexOf(currentValue);
      if (index !== -1 && index < values.length - 1) {
        valueChange(values[index + 1]);
      } else if (index === -1) {
        valueChange(values[values.length - 1]);
      } else {
        valueChange(values[0]);
      }
    } else if (props.range) {
      if (props.range[1] >= Number(currentValue) + 1) {
        valueChange(Number(currentValue) + 1);
      }
    } else {
      valueChange(Number(currentValue) + 1);
    }
  }
  function displayMenu() {
    document.getElementById("menu").style.display = "block";
  }
  function hideMenu() {
    document.getElementById("menu").style.display = "none";
  }
  const [labelVisible, setLabelVisible] = useState(props.label ? "static" : "none");
  var label = "";
  if (props.label) {
    label = props.label;
    if (props.vertical) {
      align = "static";
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
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Container, {
    align
  }, /* @__PURE__ */ React.createElement(Label, {
    labelVisible,
    align
  }, label), /* @__PURE__ */ React.createElement(Textfield, {
    alert,
    disabled,
    value: currentValue,
    onClick: () => {
      displayMenu();
    },
    onChange: (data) => {
      changeValue(data);
    }
  }), /* @__PURE__ */ React.createElement(DecreaseButton, {
    disabled,
    onClick: () => {
      decrement();
    }
  }, decreaseIcon), /* @__PURE__ */ React.createElement(IncreaseButton, {
    disabled,
    onClick: () => {
      increment();
    }
  }, increaseIcon), /* @__PURE__ */ React.createElement(Menu, {
    id: "menu",
    onMouseLeave: () => {
      hideMenu();
    }
  }, menuComponents)));
}

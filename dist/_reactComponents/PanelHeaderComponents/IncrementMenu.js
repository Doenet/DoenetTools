import React, {useState, useEffect, useRef} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {faAngleRight, faAngleLeft} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96];
const Container = styled.div`
  display: ${(props) => props.label && !props.vertical && "flex"};
  align-items: ${(props) => props.label && !props.vertical && "center"};
`;
const IncrementBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20px;
  margin: 0;
  border-radius: 5px;
  border: ${(props) => props.alert ? "2px solid var(--mainRed)" : "var(--mainBorder)"};
  background-color: var(--canvas);
  `;
const IncrementContainer = styled.div`
  position: relative;
  width: ${(props) => props.width === "menu" ? "var(--menuWidth)" : props.width};
`;
const IncreaseButton = styled.button`
  background-color: ${(props) => props.disabled ? "var(--mainGray)" : "var(--mainBlue)"};
  border-radius: 0px 2px 2px 0px;
  height: 100%;
  padding: 8px 12px;
  color: ${(props) => props.disabled ? "black" : "white"};
  font-size: 18px;
  border: none;
  display: flex;
  justify-content:center;
  align-items: center;
  &:hover {
    cursor: ${(props) => props.disabled ? "not-allowed" : "pointer"};
    color: black;
    background-color: ${(props) => props.disabled ? "var(--mainGray)" : "var(--lightBlue)"};
  }
  &:focus {
    z-index: 10;
    border-radius: 2px; 
    outline: ${(props) => props.alert ? "3px solid var(--mainRed)" : "3px solid var(--mainBlue)"};
    outline-offset: 2.5px;
  }
`;
const DecreaseButton = styled.button`
  background-color: ${(props) => props.disabled ? "var(--mainGray)" : "var(--mainBlue)"};
  border-radius: 2px 0px 0px 2px;
  height: 100%;
  padding: 8px 14px;
  width: 36px;
  color: ${(props) => props.disabled ? "black" : "white"};
  font-size: 18px;
  border: none;
  display: flex;
  justify-content:center;
  align-items: center;
  &:hover {
    cursor: ${(props) => props.disabled ? "not-allowed" : "pointer"};
    color: black;
    background-color: ${(props) => props.disabled ? "var(--mainGray)" : "var(--lightBlue)"};
  }
  &:focus {
    z-index: 10;
    border-radius: 2px; 
    outline: ${(props) => props.alert ? "3px solid var(--mainRed)" : "3px solid var(--mainBlue)"};
    outline-offset: 2.5px;
  }
`;
const TextField = styled.input`
  width: 70%;
  text-align: center;
  resize: none;
  cursor: ${(props) => props.disabled ? "not-allowed" : "default"};
  outline: none;
  border: none;
  margin: 0 8px;
  &:focus {
    z-index: 10;
    border-radius: 2px; 
    outline: ${(props) => props.alert ? "3px solid var(--mainRed)" : "3px solid var(--mainBlue)"};
    outline-offset: 4px;
  }
`;
const Label = styled.span`
  font-size: 14px;
  margin-right: 5px;
`;
export default function Increment(props) {
  let increaseIcon = "+";
  let decreaseIcon = "-";
  if (props.values || props.font) {
    decreaseIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faAngleLeft
    });
    increaseIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faAngleRight
    });
  }
  ;
  const values = props.values || props.font && FONT_SIZES || [];
  const [value, setValue] = useState(props.value || 0);
  const [index, setIndex] = useState(0);
  const incrementRef = useRef(null);
  const textFieldRef = useRef(null);
  const decrementRef = useRef(null);
  const containerRef = useRef(null);
  useEffect(() => {
    if (props.placeholder && value === "") {
      setValue("");
    } else if ((props.font || !values.length) && !value) {
      setValue(0);
    }
    if ((values.includes(value) || typeof value === "number") && props.onChange) {
      props.onChange(value);
    }
  }, [value]);
  useEffect(() => {
    if (props.value !== void 0)
      setValue(props.value);
    else if (props.min !== void 0)
      setValue(props.min);
    else if (props.max !== void 0)
      setValue(props.max);
    else if (props.font)
      setValue(FONT_SIZES[4]);
    else if (props.values !== void 0)
      setValue(props.values[0]);
    else if (props.placeholder)
      setValue("");
    else
      setValue(0);
    if (props.value && props.values)
      setIndex(props.values.indexOf(props.value));
  }, [props.value]);
  const incrementOnClick = () => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
    if (values.length && index <= values.length - 1) {
      if (index == values.length - 1)
        return;
      setValue(values[index + 1]);
      setIndex(index + 1);
    } else if (props.max === void 0 || props.max !== void 0 && value < props.max) {
      setValue(props.placeholder && !value ? 1 : parseInt(value) + 1);
    }
  };
  const decrementOnClick = () => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
    if (values.length && index >= 0) {
      if (index == 0)
        return;
      setValue(values[index - 1]);
      setIndex(index - 1);
    } else if (props.min === void 0 || props.min !== void 0 && value > props.min) {
      setValue(props.placeholder && !value ? -1 : parseInt(value) - 1);
    }
  };
  const findClosestIndex = (arr, value2) => {
    if (arr === null) {
      return -1;
    }
    let closestIndex = 0;
    let minDist = !isNaN(value2) ? Math.abs(arr[0] - parseInt(value2)) : Math.abs(arr[0].charCodeAt(0) - value2.charCodeAt(0));
    for (let i = 1; i < arr.length; i++) {
      let curDist = !isNaN(value2) ? Math.abs(arr[i] - parseInt(value2)) : Math.abs(arr[i].charCodeAt(0) - value2.charCodeAt(0));
      if (curDist < minDist) {
        minDist = curDist;
        closestIndex = i;
      }
    }
    return closestIndex;
  };
  const validateValue = () => {
    if (!props.font && values.length) {
      let closestIdx = findClosestIndex(values, value);
      setIndex(closestIdx);
      setValue(values[closestIdx]);
      return;
    }
    let tempValue = parseInt(value[0] == "0" ? parseInt(value.substring(1)) : parseInt(value));
    if (props.min !== void 0 && tempValue < props.min) {
      tempValue = props.min;
    } else if (props.max !== void 0 && tempValue > props.max) {
      tempValue = props.max;
    } else if (props.font) {
      if (tempValue < FONT_SIZES[0])
        tempValue = FONT_SIZES[0];
      else if (tempValue > FONT_SIZES[FONT_SIZES.length - 1])
        tempValue = FONT_SIZES[FONT_SIZES.length - 1];
    }
    setValue(tempValue);
  };
  const containerOnBlur = (e) => {
    const currentTarget = e.currentTarget;
    requestAnimationFrame(() => {
      if (!currentTarget.contains(document.activeElement)) {
        props.onBlur && props.onBlur(!isNaN(value) ? parseInt(value) : value);
      }
    });
  };
  const onTextfieldKeyDown = (e) => {
    props.onKeyDown(e);
    if (e.key === "Enter" && textFieldRef.current) {
      textFieldRef.current.blur();
    }
    ;
  };
  let containerWidth = "210px";
  if (props.width) {
    containerWidth = props.width;
  }
  return /* @__PURE__ */ React.createElement(Container, {
    label: props.label,
    vertical: props.vertical
  }, props.label && /* @__PURE__ */ React.createElement(Label, {
    id: "increment-label"
  }, props.label), props.label && props.vertical && /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(IncrementContainer, {
    width: containerWidth
  }, /* @__PURE__ */ React.createElement(IncrementBox, {
    ref: containerRef,
    onBlur: containerOnBlur,
    alert: props.alert
  }, /* @__PURE__ */ React.createElement(DecreaseButton, {
    "aria-label": "Decrease",
    "aria-labelledby": "increment-label",
    "aria-disabled": props.disabled ? true : false,
    ref: decrementRef,
    alert: props.alert,
    disabled: props.disabled,
    onClick: decrementOnClick,
    "data-test": `Decrement ${props.dataTest}`
  }, decreaseIcon), /* @__PURE__ */ React.createElement(TextField, {
    "aria-labelledby": "increment-label",
    "aria-haspopup": "true",
    "aria-disabled": props.disabled ? true : false,
    placeholder: props.placeholder,
    value,
    "data-test": props.dataTest,
    ref: textFieldRef,
    alert: props.alert,
    disabled: props.disabled ? true : false,
    onChange: (e) => setValue(e.target.value),
    onBlur: validateValue,
    onKeyDown: props.onKeyDown && onTextfieldKeyDown
  }), /* @__PURE__ */ React.createElement(IncreaseButton, {
    alert: props.alert,
    ref: incrementRef,
    disabled: props.disabled,
    onClick: incrementOnClick,
    "aria-labelledby": "increment-label",
    "aria-label": "Increase",
    "aria-disabled": props.disabled ? true : false,
    "data-test": `Increment ${props.dataTest}`
  }, increaseIcon))));
}
;

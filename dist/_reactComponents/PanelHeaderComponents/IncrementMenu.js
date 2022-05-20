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
`;
const IncrementContainer = styled.div`
  position: relative;
  max-width: 210px;
`;
const IncreaseButton = styled.button`
  background-color: ${(props) => props.disabled ? "var(--mainGray)" : "var(--mainBlue)"};
  border-radius: 0px 2px 2px 0px;
  height: 100%;
  width: 36px;
  color: ${(props) => props.disabled ? "black" : "white"};
  font-size: 18px;
  border: none;
  &:hover {
    cursor: ${(props) => props.disabled ? "not-allowed" : "pointer"};
    color: black;
    background-color: ${(props) => props.disabled ? "var(--mainGray)" : "var(--lightBlue)"};
  }
`;
const DecreaseButton = styled.button`
  background-color: ${(props) => props.disabled ? "var(--mainGray)" : "var(--mainBlue)"};
  border-radius: 2px 0px 0px 2px;
  text-align: center;
  height: 100%;
  width: 36px;
  color: ${(props) => props.disabled ? "black" : "white"};
  font-size: 18px;
  border: none;
  &:hover {
    cursor: ${(props) => props.disabled ? "not-allowed" : "pointer"};
    color: black;
    background-color: ${(props) => props.disabled ? "var(--mainGray)" : "var(--lightBlue)"};
  }
`;
const TextField = styled.input`
  z-index: 0;
  width: 70%;
  text-align: center;
  resize: none;
  cursor: ${(props) => props.disabled ? "not-allowed" : "default"};
  outline: none;
  border: none;
`;
const Label = styled.span`
  font-size: 14px;
  margin-right: 5px;
`;
const Menu = styled.div`
  background-color: 'var(--mainGray)';
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  border: 'var(--mainBorder)';
  border-top: none;
  border-radius: 'var(--mainBorderRadius)';
  position: absolute;
  left: 0;
  right: 0;
  overflow: scroll;
  max-height: ${(props) => props.maxHeight};
  z-index: 100;
`;
const MenuOption = styled.button`
  background-color: 'var(--mainGray)';
  display: block;
  width: 100%;
  height: 24px;
  border: none;
  border-bottom: 1px black solid;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  :hover {
    cursor: pointer;
  }
`;
const findClosestIndex = (arr, value) => {
  if (arr === null) {
    return -1;
  }
  let closestIndex = 0;
  let minDist = Math.abs(arr[0] - value);
  for (let i = 1; i < arr.length; i++) {
    if (Math.abs(arr[i] - value) < minDist) {
      minDist = Math.abs(arr[i] - value);
      closestIndex = i;
    }
  }
  return closestIndex;
};
export default function Increment(props) {
  let increaseIcon = "+";
  let decreaseIcon = "-";
  if (props.values) {
    decreaseIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faAngleLeft
    });
    increaseIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faAngleRight
    });
  }
  ;
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState(props.value ?? "");
  const [menuToggle, setMenuToggle] = useState(false);
  const [values, setValues] = useState(props.values);
  const [numericValue, setNumericValues] = useState(false);
  const incrementRef = useRef(null);
  const textFieldRef = useRef(null);
  const decrementRef = useRef(null);
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  useEffect(() => {
    if (props.value) {
      setValue(props.value);
      if (values) {
        setIndex(values.indexOf(props.value));
      }
    } else {
      if (props.min !== void 0) {
        setValue(props.min);
      } else if (props.max !== void 0) {
        setValue(props.max);
      } else if (props.font) {
        setValue(FONT_SIZES[4]);
      } else if (values) {
        setValue(values[0]);
        setIndex(0);
      } else {
        setValue(0);
      }
    }
    ;
  }, [props.value]);
  useEffect(() => {
    if (props.values) {
      setIndex(props.values.indexOf(value));
      decreaseIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
        icon: faAngleLeft
      });
      increaseIcon = /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
        icon: faAngleRight
      });
      let numericFlag = true;
      for (let i = 0; i < props.values.length; i++) {
        if (props.values[i] === "" || isNaN(props.values[i])) {
          numericFlag = false;
          break;
        }
      }
      ;
      setNumericValues(numericFlag);
    }
    ;
    setValues(props.values);
  }, [props.values]);
  let menuOptions = null;
  const containerOnBlur = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (decrementRef.current && decrementRef.current.contains(e.relatedTarget)) {
    } else if (textFieldRef.current && textFieldRef.current.contains(e.relatedTarget)) {
    } else if (incrementRef.current && incrementRef.current.contains(e.relatedTarget)) {
    } else if (menuRef.current && menuRef.current.contains(e.relatedTarget)) {
    } else {
      setMenuToggle(false);
      if (values && props.restricted == true && index == -1) {
        setIndex(findClosestIndex(values, value));
        setValue(values[findClosestIndex(values, value)]);
      } else if (props.font && (value === "" || isNaN(value) || value < 0)) {
        setValue(FONT_SIZES[4]);
      } else if (props.min !== void 0 && (value === "" || isNaN(value) || value < props.min)) {
        setValue(props.min);
      } else if (props.max !== void 0 && (value === "" || isNaN(value) || value > props.max)) {
        setValue(props.max);
      }
      if (props.onBlur) {
        props.onBlur(value);
      }
    }
  };
  const incrementOnClick = (e) => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
    if (props.max !== void 0) {
      if (value < props.max) {
        if (value !== "" && !isNaN(value)) {
          if (props.onChange) {
            props.onChange(parseInt(value) + 1);
          }
          setValue(parseInt(value) + 1);
        }
      }
    } else if (values) {
      if (index === -1) {
        if (props.onChange) {
          props.onChange(values[findClosestIndex(values, value)]);
        }
        setIndex(findClosestIndex(values, value));
        setValue(values[findClosestIndex(values, value)]);
      } else if (index < values.length - 1) {
        if (props.onChange) {
          props.onChange(values[index + 1]);
        }
        setValue(values[index + 1]);
        setIndex(index + 1);
      }
    } else {
      if (value !== "" && !isNaN(value)) {
        if (props.onChange) {
          props.onChange(parseInt(value) + 1);
        }
        setValue(parseInt(value) + 1);
      }
    }
  };
  const decrementOnClick = (e) => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
    if (props.min !== void 0) {
      if (value > props.min) {
        if (value !== "" && !isNaN(value)) {
          if (props.onChange) {
            props.onChange(parseInt(value) - 1);
          }
          setValue(parseInt(value) - 1);
        }
      }
    } else if (values) {
      if (index === -1) {
        if (props.onChange) {
          props.onChange(values[findClosestIndex(values, value)]);
        }
        setIndex(findClosestIndex(values, value));
        setValue(values[findClosestIndex(values, value)]);
      } else if (index > 0) {
        if (props.onChange) {
          props.onChange(values[index - 1]);
        }
        setValue(values[index - 1]);
        setIndex(index - 1);
      }
    } else if (props.font) {
      if (value !== "" && !isNaN(value) && value > 0) {
        if (props.onChange) {
          props.onChange(parseInt(value) - 1);
        }
        setValue(parseInt(value) - 1);
      }
    } else {
      if (value !== "" && !isNaN(value)) {
        if (props.onChange) {
          props.onChange(parseInt(value) - 1);
        }
        setValue(parseInt(value) - 1);
      }
    }
  };
  const onTextFieldChange = (e) => {
    setValue(e.target.value);
    if (values) {
      setIndex(values.indexOf(e.target.value));
    }
    if (props.onChange) {
      props.onChange(e.target.value);
    }
  };
  const onTextFieldEnter = (e) => {
    if (textFieldRef.current) {
      textFieldRef.current.blur();
    }
  };
  const onMenuClick = (e) => {
    setValue(e.target.value);
    setMenuToggle(false);
    if (values) {
      setIndex(values.indexOf(e.target.value));
    }
    if (props.onChange) {
      props.onChange(e.target.value);
    }
    if (props.onBlur) {
      props.onBlur(e.target.value);
    }
  };
  if (props.font) {
    menuOptions = FONT_SIZES.map((size, index2) => /* @__PURE__ */ React.createElement(MenuOption, {
      key: index2,
      value: size,
      onClick: onMenuClick
    }, size));
  } else if (values) {
    menuOptions = values.map((value2, index2) => /* @__PURE__ */ React.createElement(MenuOption, {
      key: index2,
      value: value2,
      onClick: onMenuClick
    }, value2));
  } else {
    let generalChoices = [];
    let min = props.min !== void 0 ? props.min : 1;
    let max = props.max !== void 0 ? props.max : 100;
    let count = min;
    for (let i = 0; i <= max - min; i++) {
      generalChoices[i] = count;
      count++;
    }
    menuOptions = generalChoices.map((choice, index2) => /* @__PURE__ */ React.createElement(MenuOption, {
      key: index2,
      value: choice,
      onClick: onMenuClick
    }, choice));
  }
  return /* @__PURE__ */ React.createElement(Container, {
    label: props.label,
    vertical: props.vertical
  }, props.label && /* @__PURE__ */ React.createElement(Label, null, props.label), props.label && props.vertical && /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(IncrementContainer, null, /* @__PURE__ */ React.createElement(IncrementBox, {
    ref: containerRef,
    onBlur: containerOnBlur,
    alert: props.alert
  }, /* @__PURE__ */ React.createElement(DecreaseButton, {
    ref: decrementRef,
    disabled: props.disabled,
    onClick: decrementOnClick
  }, decreaseIcon), /* @__PURE__ */ React.createElement(TextField, {
    placeholder: props.placeholder,
    value,
    ref: textFieldRef,
    disabled: props.disabled ? props.disabled : false,
    onChange: onTextFieldChange,
    onClick: (e) => {
      setMenuToggle(true);
    },
    onKeyDown: (e) => {
      if (props.onKeyDown) {
        props.onKeyDown(e);
      }
      ;
      if (e.key === "Enter") {
        onTextFieldEnter(e);
      }
      ;
    }
  }), /* @__PURE__ */ React.createElement(IncreaseButton, {
    ref: incrementRef,
    disabled: props.disabled,
    onClick: incrementOnClick
  }, increaseIcon)), !props.deactivateDropdown && menuOptions && menuToggle && /* @__PURE__ */ React.createElement(Menu, {
    ref: menuRef,
    maxHeight: props.maxHeight ? props.maxHeight : "150px"
  }, menuOptions)));
}
;

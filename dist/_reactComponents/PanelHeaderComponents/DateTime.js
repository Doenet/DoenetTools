import React, {useCallback, useEffect, useState, useRef} from "../../_snowpack/pkg/react.js";
import Datetime from "../../_snowpack/pkg/react-datetime.js";
import "../../_snowpack/pkg/react-datetime/css/react-datetime.css.proxy.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import "./DateTime.css.proxy.js";
const Label = styled.div`
  font-size: 14px;
  width: fit-content;
  display: ${(props) => props.vertical ? "block" : "inline"};
  // margin: 4px;
`;
export default function DateTime(props) {
  const [value, setValue] = useState(props.value);
  const inputRef = useRef(null);
  const [cursorStart, setCursorStart] = useState(0);
  const [cursorEnd, setCursorEnd] = useState(0);
  let borderColor = props.alert ? "2px solid #C1292E" : "2px solid black";
  borderColor = props.disabled ? "2px solid #e2e2e2" : borderColor;
  let cursorStyle = props.disabled ? "not-allowed" : "auto";
  useEffect(() => {
    setValue(props.value);
  }, [props]);
  useEffect(() => {
    inputRef.current.selectionStart = cursorStart;
    inputRef.current.selectionEnd = cursorEnd;
  });
  let placeholder = "";
  if (props.datePicker !== false) {
    placeholder = "mm/dd/yyyy";
  }
  if (props.timePicker !== false && props.precision === "seconds") {
    placeholder += " hh:mm:ss";
  } else if (props.timePicker !== false) {
    placeholder += " hh:mm";
  }
  placeholder = props.placeholder ? props.placeholder : placeholder;
  let inputProps = {
    disabled: props.disabled === true ? true : false,
    placeholder
  };
  const renderInput = (propsRI, openCalendar, closeCalendar) => {
    return /* @__PURE__ */ React.createElement("div", {
      style: {width: "fit-content"}
    }, props.label ? /* @__PURE__ */ React.createElement(Label, {
      vertical: props.vertical
    }, props.label) : null, /* @__PURE__ */ React.createElement("input", {
      ...propsRI,
      style: {border: borderColor, cursor: cursorStyle},
      ref: inputRef,
      onChange: (e) => {
        setCursorStart(e.target.selectionStart);
        setCursorEnd(e.target.selectionEnd);
        propsRI.onChange(e);
      },
      onClick: (e) => {
        propsRI.onClick(e);
      },
      onKeyDown: (e) => {
        if (props.onKeyDown) {
          props.onKeyDown(e);
        }
        if (e.key === "Enter") {
          closeCalendar();
        }
      }
    }));
  };
  return /* @__PURE__ */ React.createElement(Datetime, {
    renderInput,
    value,
    dateFormat: props.datePicker === false ? false : true,
    timeFormat: props.precision === "seconds" && props.timePicker !== false ? "hh:mm:ss a" : props.timePicker === false ? false : true,
    inputProps,
    onChange: (dateObjectOrString) => {
      setValue(dateObjectOrString);
      if (props.onChange) {
        props.onChange({
          valid: typeof dateObjectOrString !== "string",
          value: dateObjectOrString
        });
      }
    },
    onClose: (_) => {
      if (props.onBlur) {
        props.onBlur({
          valid: typeof value !== "string",
          value
        });
      }
    }
  });
}

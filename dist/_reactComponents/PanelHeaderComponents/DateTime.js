import React, {useCallback, useEffect, useState, useRef} from "../../_snowpack/pkg/react.js";
import Datetime from "../../_snowpack/pkg/react-datetime.js";
import "../../_snowpack/pkg/react-datetime/css/react-datetime.css.proxy.js";
import "./DateTime.css.proxy.js";
export default function DateTime(props) {
  const [value, setValue] = useState(props.value);
  const inputRef = useRef(null);
  const [cursorStart, setCursorStart] = useState(0);
  const [cursorEnd, setCursorEnd] = useState(0);
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
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("input", {
      ...propsRI,
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

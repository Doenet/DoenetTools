import React, { useEffect, useState, useRef } from "react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import styled from "styled-components";
import "./DateTime.css";

const CssWrapper = styled.div`
  .rdtPicker {
    margin-left: ${(props) => (props.offset ? props.offset : "-50px")};
  }
`;

const Label = styled.div`
  font-size: 14px;
  width: fit-content;
  display: ${(props) => (props.vertical ? "block" : "inline")};
  // margin: 4px;
`;

export default function DateTime(props) {
  const [value, setValue] = useState(props.value);
  const [lastValid, setLastValid] = useState(props.value);
  const inputRef = useRef(null);
  const [cursorStart, setCursorStart] = useState(0);
  const [cursorEnd, setCursorEnd] = useState(0);

  let effectiveWidth = props.width;
  if (props.width == "menu" || !props.width) {
    effectiveWidth = "calc(var(--menuWidth) - 14px)";
  }
  // console.log('props.width ', props.width, "effectiveWidth",effectiveWidth);

  let borderColor = props.alert
    ? "2px solid var(--mainRed)"
    : "var(--mainBorder)";
  borderColor = props.disabled ? "2px solid var(--mainGray)" : borderColor;
  let cursorStyle = props.disabled ? "not-allowed" : "auto";

  var containerWidth = effectiveWidth;
  var inputWidth = effectiveWidth;
  if (props.label) {
    inputWidth = "100%";
  }

  useEffect(() => {
    //todo try lastValid update
    setLastValid(props.value);
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
    // disabled: props.disabled === true ? true : false,
    placeholder: placeholder,
  };

  const renderInput = (propsRI, openCalendar, closeCalendar) => {
    return (
      <div style={{ width: containerWidth }}>
        {props.label ? (
          <Label id="checkbox-label" vertical={props.vertical}>
            {props.label}
          </Label>
        ) : null}
        <input
          {...propsRI}
          style={{
            border: borderColor,
            cursor: cursorStyle,
            width: inputWidth,
            color: "var(--canvastext)",
            backgroundColor: "var(--canvas)",
            ...props.style,
          }}
          ref={inputRef}
          aria-labelledby="checkbox-label"
          aria-haspopup="true"
          data-test={props.dataTest}
          onChange={(e) => {
            setCursorStart(e.target.selectionStart);
            setCursorEnd(e.target.selectionEnd);
            propsRI.onChange(e);
          }}
          onClick={(e) => {
            propsRI.onClick(e);
          }}
          onKeyDown={(e) => {
            if (props.onKeyDown) {
              props.onKeyDown(e);
            }
            if (e.key === "Enter") {
              closeCalendar();
              e.target.blur();
            }
          }}
        />
      </div>
    );
  };

  if (props.disabled) {
    return (
      <div style={{ width: containerWidth }}>
        {props.label ? (
          <Label id="checkbox-label" vertical={props.vertical}>
            {props.label}
          </Label>
        ) : null}
        <input
          ref={inputRef}
          onClick={props.disabledOnClick}
          value={props.disabledText}
          readOnly
          data-test={props.dataTest}
          // disabled
          style={{
            cursor: "not-allowed",
            //cs color: 'var(--canvastext)',
            color: "var(--canvastext)",
            backgroundColor: "var(--canvas)",
            height: "18px",
            width: inputWidth,
            border: "2px solid var(--mainGray)",
            borderRadius: "var(--mainBorderRadius)",
            ...props.style,
          }}
        />
      </div>
    );
  }
  // console.log('value:', value);
  // console.log('lastValid:', lastValid);
  return (
    <CssWrapper offset={props.offset}>
      <Datetime
        renderInput={renderInput}
        value={value}
        dateFormat={props.datePicker === false ? false : true}
        timeFormat={
          props.precision === "seconds" && props.timePicker !== false
            ? "hh:mm:ss a"
            : props.timePicker === false
            ? false
            : true
        }
        inputProps={inputProps}
        onChange={(dateObjectOrString) => {
          setValue(dateObjectOrString);
          if (props.onChange) {
            props.onChange({
              valid: typeof dateObjectOrString !== "string",
              value: dateObjectOrString,
            });
          }
        }}
        onClose={(_) => {
          let valid = typeof value !== "string";
          if (valid) {
            setLastValid(value);
          } else {
            setValue(lastValid);
          }

          if (props.onBlur) {
            props.onBlur({
              valid: valid,
              value: value,
            });
          }
        }}
      />
    </CssWrapper>
  );
}

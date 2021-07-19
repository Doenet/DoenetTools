import React, {useState} from "../../_snowpack/pkg/react.js";
import {TimePicker, DateInput, TimePrecision} from "../../_snowpack/pkg/@blueprintjs/datetime.js";
import "../../_snowpack/pkg/@blueprintjs/datetime/lib/css/blueprint-datetime.css.proxy.js";
import "../../_snowpack/pkg/@blueprintjs/core/lib/css/blueprint.css.proxy.js";
export default function DateTime(props) {
  const [dateObjectState, setDateObjectState] = useState(null);
  const dateTimeToText = (date) => {
    return date.toLocaleString([], {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const dateSecondTimeToText = (date) => {
    return date.toLocaleString([], {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };
  const dateToText = (date) => {
    return date.toLocaleString([], {
      year: "numeric",
      month: "numeric",
      day: "numeric"
    });
  };
  const textToDate = (s) => {
    try {
      return new Date(s);
    } catch {
      return dateObjectState;
    }
  };
  const handleDateChange = (selectedDate, isUserChange) => {
    setDateObjectState(selectedDate);
    if (props.callBack) {
      props.callBack(selectedDate);
    }
  };
  const handleTimeChange = (newTime) => {
    setDateObjectState(newTime);
    if (props.callBack) {
      props.callBack(newTime);
    }
  };
  if (props.time && props.time !== true && props.time !== false) {
    console.log("time attribute can only take boolean values");
    return /* @__PURE__ */ React.createElement("input", null);
  }
  if (props.date && props.date !== true && props.date !== false) {
    console.log("date attribute can only take boolean values");
    return /* @__PURE__ */ React.createElement("input", null);
  }
  if (props.time === false && props.date === false) {
    console.log("Both time and date can't be false");
    return /* @__PURE__ */ React.createElement("input", null);
  }
  if (props.date === false) {
    return /* @__PURE__ */ React.createElement(TimePicker, {
      disabled: props.disabled === void 0 || props.disabled === null ? false : props.disabled,
      showArrowButtons: props.showArrowButtons === null || props.showArrowButtons === void 0 ? false : props.showArrowButtons,
      precision: props.precision === "second" ? TimePrecision.SECOND : TimePrecision.MINUTE,
      onChange: handleTimeChange,
      value: dateObjectState
    });
  }
  return /* @__PURE__ */ React.createElement(DateInput, {
    disabled: props.disabled === void 0 || props.disabled === null ? false : props.disabled,
    highlightCurrentDay: true,
    onChange: handleDateChange,
    placeholder: props.time === false ? "M/D/YYYY" : props.precision === "second" ? "M/D/YYYY, H:MM:SS" : "M/D/YYYY, H:MM",
    timePickerProps: props.time === false ? void 0 : {
      showArrowButtons: props.showArrowButtons === null || props.showArrowButtons === void 0 ? false : props.showArrowButtons,
      precision: props.precision === "second" ? TimePrecision.SECOND : TimePrecision.MINUTE
    },
    closeOnSelection: false,
    formatDate: props.time === false ? dateToText : props.precision === "second" ? dateSecondTimeToText : dateTimeToText,
    parseDate: textToDate,
    value: dateObjectState
  });
}

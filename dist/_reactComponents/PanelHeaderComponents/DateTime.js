import React, {useState} from "../../_snowpack/pkg/react.js";
import {DateInput} from "../../_snowpack/pkg/@blueprintjs/datetime.js";
import "../../_snowpack/pkg/@blueprintjs/datetime/lib/css/blueprint-datetime.css.proxy.js";
import "../../_snowpack/pkg/@blueprintjs/core/lib/css/blueprint.css.proxy.js";
import "./dateTime.css.proxy.js";
export default function DateTime(props) {
  const [dateState, setDateState] = useState(new Date(Date.now()));
  const timeProps = {
    showArrowButtons: true,
    useAmPm: true
  };
  const renderDate = (date) => {
    const dayMonthYear = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    const hours = date.getHours() % 12 === 0 ? 12 : date.getHours() % 12;
    const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes().toString();
    const time = hours + ":" + minutes;
    const amOrPm = date.getHours() < 12 ? "am" : "pm";
    return dayMonthYear + "  " + time + " " + amOrPm;
  };
  return /* @__PURE__ */ React.createElement(DateInput, {
    disabled: props.disabled === void 0 || props.disabled === null ? false : props.disabled,
    placeholder: "D/M/YYYY H:MM",
    highlightCurrentDay: true,
    closeOnSelection: false,
    formatDate: renderDate,
    parseDate: (str) => {
      try {
        return new Date(Date.parse(str));
      } catch {
        return dateState;
      }
    },
    timePickerProps: timeProps,
    maxDate: new Date(Date.now() + 60 * 60 * 24 * 365.25 * 1e4),
    defaultValue: new Date(Date.now()),
    value: dateState,
    onChange: (date) => {
      props.onDateChange(date);
      setDateState(date);
    }
  });
}

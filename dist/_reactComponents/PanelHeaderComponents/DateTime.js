import React, {useCallback, useState} from "../../_snowpack/pkg/react.js";
import Datetime from "../../_snowpack/pkg/react-datetime.js";
import "../../_snowpack/pkg/react-datetime/css/react-datetime.css.proxy.js";
import "./DateTime.css.proxy.js";
export default function DateTime(props) {
  const [value, setValue] = useState(props.value ? props.value : null);
  let placeholder = "";
  if (props.datePicker !== false) {
    placeholder = "mm/dd/yyyy";
  }
  if (props.timePicker !== false && props.precision === "seconds") {
    placeholder += " hh:mm:ss";
  } else if (props.timePicker !== false) {
    placeholder += " hh:mm";
  }
  let inputProps = {
    disabled: props.disabled === true ? true : false,
    placeholder
  };
  return /* @__PURE__ */ React.createElement(Datetime, {
    style: {minWidth: "0px", width: "200px"},
    value,
    dateFormat: props.datePicker === false ? false : true,
    timeFormat: props.precision === "seconds" && props.timePicker !== false ? "hh:mm:ss a" : props.timePicker === false ? false : true,
    inputProps,
    onChange: (dateObjectOrString) => {
      if (typeof dateObjectOrString === "string") {
        setValue(null);
      } else {
        setValue(dateObjectOrString.toDate());
      }
    },
    onClose: (_) => {
      if (value === null) {
        if (props.callback) {
          props.callback({valid: false, value});
        }
      } else {
        if (props.callback) {
          props.callback({
            valid: true,
            value
          });
        }
      }
    }
  });
}

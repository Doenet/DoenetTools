import React, {useState, useEffect} from "../_snowpack/pkg/react.js";
import {useSpring, animated} from "../_snowpack/pkg/@react-spring/web.js";
import styled from "../_snowpack/pkg/styled-components.js";
import {doenetComponentForegroundActive} from "./temp/theme.js";
const LABELCOLOR = "var(--mainBlue)";
const FONTFAMILY = "sans-serif";
const BACKGROUNDCOLOR = "var(--mainGray)";
const FOCUSBACKGROUNDCOLOR = "var(--mainBlue)";
function randomAlphaString(len) {
  let c = "abcdefghijklmnopqrstuvwxyz";
  let str = "";
  for (let i = 0; i < len; i++) {
    str += c[Math.round(Math.random() * 25)];
  }
  return str;
}
const labelStyles = {
  baseline: {
    fontFamily: FONTFAMILY,
    position: "absolute",
    top: "0.75em",
    fontSize: "1em",
    marginLeft: "0.7em",
    whiteSpace: "nowrap",
    MozUserSelect: "none",
    msUserSelect: "none",
    WebkitUserSelect: "none",
    WebkitTouchCallout: "none",
    config: {
      tension: 400
    }
  },
  empty: {
    color: LABELCOLOR,
    position: "absolute",
    top: "0.75em",
    fontSize: "1em"
  },
  inactive: {
    color: LABELCOLOR,
    position: "absolute",
    top: "0.75em",
    fontSize: "1em"
  },
  notEmpty: {
    color: LABELCOLOR,
    top: "0.3em",
    fontSize: "0.7em"
  },
  active: {
    color: "var(--mainGray)",
    top: "0.3em",
    fontSize: "0.7em"
  }
};
const inputStyles = {
  baseline: {
    fontSize: "1em",
    padding: "1em 0.5em 0.5em 0.5em",
    border: "none",
    backgroundColor: BACKGROUNDCOLOR,
    borderRadius: "0.33em",
    outline: "0",
    width: "calc(100% - 1em)"
  },
  inactive: {
    color: "var(--canvastext)",
    backgroundColor: BACKGROUNDCOLOR
  },
  active: {
    color: "var(--mainGray)",
    backgroundColor: FOCUSBACKGROUNDCOLOR
  }
};
const AnimatedLabel = animated.label;
const AnimatedInput = animated.input;
const AnimatedTextarea = animated.textarea;
const StyledInputContainer = styled.div`
  all: initial;
  font-size: 1em;
  display: block;
  position: relative;
  margin: 1em;
  width: calc(100% - 2em);
  overflow: hidden;
`;
const LengthIndicator = styled.p`
  position: absolute;
  bottom: 0;
  right: 1em;
  color: ${LABELCOLOR};
  font-family: sans-serif;
`;
export default function Textinput(props) {
  let area = props.area || false;
  let name = props.name || props.id;
  let id = props.id;
  if (!id) {
    id = randomAlphaString(20);
  }
  let [value, setValue] = useState(props.value || props.children || "");
  const [labelStyle, setLabelStyle] = useSpring(() => labelStyles.baseline);
  useEffect(() => {
    if (value) {
      setLabelStyle(labelStyles.notEmpty);
    }
  }, []);
  let inputStylesWithResize = {...inputStyles, baseline: {...inputStyles.baseline, resize: props.resize || (area ? "both" : "none")}};
  const [inputStyle, setInputStyle] = useSpring(() => inputStylesWithResize.baseline);
  function handleFocus(e) {
    setInputStyle(inputStyles.active);
    setLabelStyle(labelStyles.active);
  }
  function handleBlur(e) {
    setInputStyle(inputStyles.inactive);
    if (!value) {
      setLabelStyle(labelStyles.inactive);
    } else {
      setLabelStyle(labelStyles.notEmpty);
    }
  }
  if (area) {
    return /* @__PURE__ */ React.createElement(StyledInputContainer, {
      ...props,
      style: props.style,
      className: props.className,
      key: id + "-doenet-textinput-container"
    }, /* @__PURE__ */ React.createElement(AnimatedLabel, {
      key: id + "-doenet-textinput-label",
      style: labelStyle,
      htmlFor: id
    }, props.label), /* @__PURE__ */ React.createElement(AnimatedTextarea, {
      onFocus: handleFocus,
      onBlur: handleBlur,
      onChange: (e) => {
        setValue(e.target.value);
        props.onChange(e);
      },
      style: inputStyle,
      id,
      name,
      value,
      key: id + "-doenet-input",
      rows: props.rows,
      cols: props.cols,
      maxLength: props.maxlength
    }), /* @__PURE__ */ React.createElement(LengthIndicator, null, `${value.length}/${props.maxlength}`));
  }
  return /* @__PURE__ */ React.createElement(StyledInputContainer, {
    ...props,
    key: id + "-doenet-textinput-container"
  }, /* @__PURE__ */ React.createElement(AnimatedLabel, {
    key: id + "-doenet-textinput-label",
    style: labelStyle,
    htmlFor: id
  }, props.label), /* @__PURE__ */ React.createElement(AnimatedInput, {
    onFocus: handleFocus,
    onBlur: handleBlur,
    onChange: (e) => {
      setValue(e.target.value);
      props.onChange(e);
    },
    style: inputStyle,
    id,
    name,
    value,
    key: id + "-doenet-input"
  }));
}

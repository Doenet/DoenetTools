import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";

// PARAMETERS
const LABELCOLOR = "#555";
const FONTFAMILY = "sans-serif";
const BACKGROUNDCOLOR = "#eee";
const FOCUSBACKGROUNDCOLOR = "#BDF3FF";

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
    color: LABELCOLOR,
    position: "absolute",
    top: "0.75em",
    fontSize: "1em",
    marginLeft: "0.7em",
    whiteSpace: "nowrap",
    MozUserSelect: "none" /* Firefox */,
    msUserSelect: "none" /* Internet Explorer */,
    WebkitUserSelect: "none" /* Chrome, Safari, and Opera */,
    WebkitTouchCallout: "none" /* Disable Android and iOS callouts*/,
    config: {
      tension: 400
    }
  },
  empty: {
    position: "absolute",
    top: "0.75em",
    fontSize: "1em"
  },
  inactive: {
    position: "absolute",
    top: "0.75em",
    fontSize: "1em"
  },
  notEmpty: {
    top: "0.3em",
    fontSize: "0.7em"
  },
  active: {
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
    backgroundColor: BACKGROUNDCOLOR
  },
  active: {
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

export default function Textinput(props) {
  // props
  let area = props.area;
  let name = props.name || props.id;
  let id = props.id;
  if (!id) {
    // we must have an id
    id = randomAlphaString(20); // a random name and id will be chosen if there is no id name is specified.
  }

  // Section: states
  let [value, setValue] = useState(props.value || props.children || ""); // will be undefined if not specified which will show up like an empty string.

  // Section: spring animations
  const [labelStyle, setLabelStyle] = useSpring(() => labelStyles.baseline);
  if (value) {
    setLabelStyle(labelStyles.notEmpty);
  }

  const [inputStyle, setInputStyle] = useSpring(() => inputStyles.baseline);

  // Section: event handlers
  function handleFocus(e) {
    setInputStyle(inputStyles.active);
    setLabelStyle(labelStyles.active);
  }

  function handleBlur(e) {
    setInputStyle(inputStyles.inactive);
    if (!value) {
      setLabelStyle(labelStyles.inactive);
    }
  }

  if (area) {
    return (
      <StyledInputContainer
        style={props.style}
        className={props.className}
        key={id + "-doenet-textinput-container"}
      >
        <AnimatedLabel
          key={id + "-doenet-textinput-label"}
          style={labelStyle}
          htmlFor={id}
        >
          {props.label}
        </AnimatedLabel>
        <AnimatedTextarea
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={e => {
            setValue(e.target.value);
            props.onChange(e);
          }}
          style={inputStyle}
          id={id}
          name={name}
          value={value}
          key={id + "-doenet-input"}
        />
      </StyledInputContainer>
    );
  }

  return (
    <StyledInputContainer
      style={props.style}
      className={props.className}
      key={id + "-doenet-textinput-container"}
    >
      <AnimatedLabel
        key={id + "-doenet-textinput-label"}
        style={labelStyle}
        htmlFor={id}
      >
        {props.label}
      </AnimatedLabel>
      <AnimatedInput
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={e => {
          setValue(e.target.value);
          props.onChange(e);
        }}
        style={inputStyle}
        id={id}
        name={name}
        value={value}
        key={id + "-doenet-input"}
      />
    </StyledInputContainer>
  );
}

// separate out animatedinput??????

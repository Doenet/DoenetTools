import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  border: ${(props) =>
    props.alert ? "2px solid var(--mainRed)" : "var(--mainBorder)"};
  background-color: var(--canvas);
`;

const IncrementContainer = styled.div`
  position: relative;
  width: ${(props) =>
    props.width === "menu" ? "var(--menuWidth)" : props.width};
`;

const IncreaseButton = styled.button`
  background-color: ${(props) =>
    props.disabled ? "var(--mainGray)" : "var(--mainBlue)"};
  border-radius: 0px 2px 2px 0px;
  height: 100%;
  padding: 8px 12px;
  color: ${(props) => (props.disabled ? "black" : "white")};
  font-size: 18px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    color: black;
    background-color: ${(props) =>
      props.disabled ? "var(--mainGray)" : "var(--lightBlue)"};
  }
  &:focus {
    z-index: 10;
    border-radius: 2px;
    outline: ${(props) =>
      props.alert ? "3px solid var(--mainRed)" : "3px solid var(--mainBlue)"};
    outline-offset: 2.5px;
  }
`;

const DecreaseButton = styled.button`
  background-color: ${(props) =>
    props.disabled ? "var(--mainGray)" : "var(--mainBlue)"};
  border-radius: 2px 0px 0px 2px;
  height: 100%;
  padding: 8px 14px;
  width: 36px;
  color: ${(props) => (props.disabled ? "black" : "white")};
  font-size: 18px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    color: black;
    background-color: ${(props) =>
      props.disabled ? "var(--mainGray)" : "var(--lightBlue)"};
  }
  &:focus {
    z-index: 10;
    border-radius: 2px;
    outline: ${(props) =>
      props.alert ? "3px solid var(--mainRed)" : "3px solid var(--mainBlue)"};
    outline-offset: 2.5px;
  }
`;

const TextField = styled.input`
  width: 70%;
  text-align: center;
  resize: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "default")};
  outline: none;
  border: none;
  margin: 0 8px;
  &:focus {
    z-index: 10;
    border-radius: 2px;
    outline: ${(props) =>
      props.alert ? "3px solid var(--mainRed)" : "3px solid var(--mainBlue)"};
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
    decreaseIcon = <FontAwesomeIcon icon={faAngleLeft} />;
    increaseIcon = <FontAwesomeIcon icon={faAngleRight} />;
  }

  const values = props.values || (props.font && FONT_SIZES) || [];
  const [value, setValue] = useState(props.value || 0);
  const [index, setIndex] = useState(0);
  const incrementRef = useRef(null);
  const textFieldRef = useRef(null);
  const decrementRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // to handle placeholder issue
    if (props.placeholder && value === "") {
      setValue("");
    } else if ((props.font || !values.length) && !value) {
      setValue(0);
    }
    // make sure onChange doesn't fire on manual typing
    if (
      (values.includes(value) || typeof value === "number") &&
      props.onChange
    ) {
      props.onChange(value);
    }
  }, [value]);

  useEffect(() => {
    if (props.value !== undefined) setValue(props.value);
    else if (props.min !== undefined) setValue(props.min);
    else if (props.max !== undefined) setValue(props.max);
    else if (props.font) setValue(FONT_SIZES[4]);
    else if (props.values !== undefined) setValue(props.values[0]);
    else if (props.placeholder) setValue("");
    else setValue(0);

    if (props.value && props.values)
      setIndex(props.values.indexOf(props.value));
  }, [props.value]); //need to put this two as dependency because we might wanna change value manually from the parent component

  // useEffect(() => {
  //   console.log("value prop changed");
  //   setValue(props.value)
  // }, [props.value])

  const incrementOnClick = () => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
    if (values.length && index <= values.length - 1) {
      if (index == values.length - 1) return;
      setValue(values[index + 1]);
      setIndex(index + 1);
    } else if (
      props.max === undefined ||
      (props.max !== undefined && value < props.max)
    ) {
      //deal with the case where placeholder is empty
      setValue(props.placeholder && !value ? 1 : parseInt(value) + 1);
    }
  };

  const decrementOnClick = () => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
    if (values.length && index >= 0) {
      if (index == 0) return;
      setValue(values[index - 1]);
      setIndex(index - 1);
    } else if (
      props.min === undefined ||
      (props.min !== undefined && value > props.min)
    ) {
      //deal with the case where placeholder is empty
      setValue(props.placeholder && !value ? -1 : parseInt(value) - 1);
    }
  };

  const findClosestIndex = (arr, value) => {
    if (arr === null) {
      return -1;
    }
    //deals with closest string/number
    let closestIndex = 0;
    let minDist = !isNaN(value)
      ? Math.abs(arr[0] - parseInt(value))
      : Math.abs(arr[0].charCodeAt(0) - value.charCodeAt(0));

    for (let i = 1; i < arr.length; i++) {
      let curDist = !isNaN(value)
        ? Math.abs(arr[i] - parseInt(value))
        : Math.abs(arr[i].charCodeAt(0) - value.charCodeAt(0));
      if (curDist < minDist) {
        minDist = curDist;
        closestIndex = i;
      }
    }

    return closestIndex;
  };

  // validate the textfield input on textfield blur
  const validateValue = () => {
    if (!props.font && values.length) {
      let closestIdx = findClosestIndex(values, value);
      setIndex(closestIdx);
      setValue(values[closestIdx]);
      return;
    }

    let tempValue = parseInt(
      value[0] == "0" ? parseInt(value.substring(1)) : parseInt(value),
    );
    if (props.min !== undefined && tempValue < props.min) {
      // check min
      tempValue = props.min;
    } else if (props.max !== undefined && tempValue > props.max) {
      // check max
      tempValue = props.max;
    } else if (props.font) {
      //limit min and max of font
      if (tempValue < FONT_SIZES[0]) tempValue = FONT_SIZES[0];
      else if (tempValue > FONT_SIZES[FONT_SIZES.length - 1])
        tempValue = FONT_SIZES[FONT_SIZES.length - 1];
    }
    setValue(tempValue);
  };

  //execute when the whole increment container blurs
  const containerOnBlur = (e) => {
    const currentTarget = e.currentTarget;
    // Give browser time to focus the next element
    requestAnimationFrame(() => {
      // Check if the new focused element is a child of the original container
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
  };

  let containerWidth = "210px";
  if (props.width) {
    containerWidth = props.width;
  }

  return (
    <Container label={props.label} vertical={props.vertical}>
      {props.label && <Label id="increment-label">{props.label}</Label>}
      {props.label && props.vertical && <br />}
      <IncrementContainer width={containerWidth}>
        <IncrementBox
          ref={containerRef}
          onBlur={containerOnBlur}
          alert={props.alert}
        >
          <DecreaseButton
            aria-label="Decrease"
            aria-labelledby="increment-label"
            aria-disabled={props.disabled ? true : false}
            ref={decrementRef}
            alert={props.alert}
            disabled={props.disabled}
            onClick={decrementOnClick}
            data-test={`Decrement ${props.dataTest}`}
          >
            {decreaseIcon}
          </DecreaseButton>
          <TextField
            aria-labelledby="increment-label"
            aria-haspopup="true"
            aria-disabled={props.disabled ? true : false}
            placeholder={props.placeholder}
            value={value}
            data-test={props.dataTest}
            ref={textFieldRef}
            alert={props.alert}
            disabled={props.disabled ? true : false}
            onChange={(e) => setValue(e.target.value)}
            onBlur={validateValue}
            onKeyDown={props.onKeyDown && onTextfieldKeyDown}
          />
          <IncreaseButton
            alert={props.alert}
            ref={incrementRef}
            disabled={props.disabled}
            onClick={incrementOnClick}
            aria-labelledby="increment-label"
            aria-label="Increase"
            aria-disabled={props.disabled ? true : false}
            data-test={`Increment ${props.dataTest}`}
          >
            {increaseIcon}
          </IncreaseButton>
        </IncrementBox>
      </IncrementContainer>
    </Container>
  );
}

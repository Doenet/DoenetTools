import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96];

const Container = styled.div`
  display: flex;
  width: fit-content;
  margin: 0;
`;

const IncreaseButton = styled.button`
  background-color: ${(props) => (props.disabled ? '#e2e2e2' : '#1a5a99')};
  border-radius: 0px 5px 5px 0px;
  border: ${(props) => (props.alert ? '2px solid #C1292E' : '2px solid black')};
  border-left: none;
  height: 24px;
  width: 34px;
  color: ${(props) => (props.disabled ? 'black' : 'white')};
  font-size: 18px;
  :hover {
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  }
`;

const DecreaseButton = styled.button`
  background-color: ${(props) => (props.disabled ? '#e2e2e2' : '#1a5a99')};
  border-radius: 5px 0px 0px 5px;
  border: ${(props) => (props.alert ? '2px solid #C1292E' : '2px solid black')};
  border-right: none;
  height: 24px;
  width: 34px;
  color: ${(props) => (props.disabled ? 'black' : 'white')};
  font-size: 18px;
  :hover {
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  }
`;

const TextField = styled.input`
  border: ${(props) => (props.alert ? '2px solid #C1292E' : '2px solid black')};
  border-left: none;
  border-right: none;
  z-index: 0;
  height: 18px;
  width: 80px;
  text-align: center;
  resize: none;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'default')};
  outline: none;
`;

const Label = styled.div`
  font-size: 12px;
  margin: 4px;
`;

const Menu = styled.div`
  background-color: #e2e2e2;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  border: 2px solid black;
  border-top: none;
  border-radius: 5px;
  position: relative;
  overflow: scroll;
  max-height: ${(props) => props.maxHeight};
  width: fit-content;
`;

const MenuOption = styled.button`
  background-color: #e2e2e2;
  display: block;
  width: 146px;
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
  let increaseIcon = '+';
  let decreaseIcon = '-';

  if (props.values) {
    decreaseIcon = <FontAwesomeIcon icon={faAngleLeft} />;
    increaseIcon = <FontAwesomeIcon icon={faAngleRight} />;
  }

  const [index, setIndex] = useState(0);
  const [value, setValue] = useState(props.value);
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
      if (props.min !== undefined) {
        setValue(props.min);
      } else if (props.max !== undefined) {
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
  }, [props.value]);

  useEffect(() => {
    if (props.values) {
      setIndex(props.values.indexOf(value));
      decreaseIcon = <FontAwesomeIcon icon={faAngleLeft} />;
      increaseIcon = <FontAwesomeIcon icon={faAngleRight} />;

      let numericFlag = true;
      for (let i = 0; i < props.values.length; i++) {
        if (props.values[i] === '' || isNaN(props.values[i])) {
          numericFlag = false;
          break;
        }
      }

      setNumericValues(numericFlag);
      // console.log('>>> numericValues', numericFlag);
    }
    setValues(props.values);
  }, [props.values]);

  let menuOptions = null;

  const containerOnBlur = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (
      decrementRef.current &&
      decrementRef.current.contains(e.relatedTarget)
    ) {
      // console.log('>>> clicked inside the decrement');
    } else if (
      textFieldRef.current &&
      textFieldRef.current.contains(e.relatedTarget)
    ) {
      // console.log('>>> clicked inside the textfield');
    } else if (
      incrementRef.current &&
      incrementRef.current.contains(e.relatedTarget)
    ) {
      // console.log('>>> clicked inside the increment');
    } else if (menuRef.current && menuRef.current.contains(e.relatedTarget)) {
      // console.log('>>> clicked inside the menu');
    } else {
      setMenuToggle(false);
      if (values && props.restricted == true && index == -1) {
        setIndex(findClosestIndex(values, value));
        setValue(values[findClosestIndex(values, value)]);
      } else if (props.font && (value === '' || isNaN(value) || value < 0)) {
        setValue(FONT_SIZES[4]);
      } else if (
        props.min !== undefined &&
        (value === '' || isNaN(value) || value < props.min)
      ) {
        setValue(props.min);
      } else if (
        props.max !== undefined &&
        (value === '' || isNaN(value) || value > props.max)
      ) {
        setValue(props.max);
      }
      if (props.onBlur) {
        props.onBlur(value);
      }
    }
  };

  const incrementOnClick = (e) => {
    // console.log('props.max', props.max);
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }

    if (props.max !== undefined) {
      if (value < props.max) {
        if (value !== '' && !isNaN(value)) {
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
        // console.log('increment values', values, value, index);
        if (props.onChange) {
          props.onChange(values[index + 1]);
        }
        setValue(values[index + 1]);
        setIndex(index + 1);
      }
    } else {
      if (value !== '' && !isNaN(value)) {
        if (props.onChange) {
          props.onChange(parseInt(value) + 1);
        }
        setValue(parseInt(value) + 1);
      }
    }
  };

  const decrementOnClick = (e) => {
    // console.log('props.min', props.min);
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
    if (props.min !== undefined) {
      if (value > props.min) {
        if (value !== '' && !isNaN(value)) {
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
        // console.log('decrement values', values, value, index);
        if (props.onChange) {
          props.onChange(values[index - 1]);
        }
        setValue(values[index - 1]);
        setIndex(index - 1);
      }
    } else if (props.font) {
      if (value !== '' && !isNaN(value) && value > 0) {
        if (props.onChange) {
          props.onChange(parseInt(value) - 1);
        }
        setValue(parseInt(value) - 1);
      }
    } else {
      if (value !== '' && !isNaN(value)) {
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
      // console.log('changed index', values.indexOf(e.target.value));
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
    // console.log('onMenuClick clicked');
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
    menuOptions = FONT_SIZES.map((size, index) => (
      <MenuOption key={index} value={size} onClick={onMenuClick}>
        {size}
      </MenuOption>
    ));
  }

  if (values) {
    menuOptions = values.map((value, index) => (
      <MenuOption key={index} value={value} onClick={onMenuClick}>
        {value}
      </MenuOption>
    ));
  }

  // console.log('props.disabled', props.disabled);

  return (
    <div
      className="incrementcontainer"
      style={{ width: 'fit-content', ...props.style }}
    >
      {props.vertical && props.label ? <Label>{props.label}</Label> : null}
      <Container
        ref={containerRef}
        className="textfieldcontainer"
        onBlur={containerOnBlur}
      >
        {!props.vertical && props.label ? <Label>{props.label}</Label> : null}
        <DecreaseButton
          ref={decrementRef}
          alert={props.alert}
          disabled={props.disabled}
          onClick={decrementOnClick}
        >
          {decreaseIcon}
        </DecreaseButton>
        <TextField
          placeholder={props.placeholder}
          value={value}
          ref={textFieldRef}
          alert={props.alert}
          disabled={props.disabled ? props.disabled : false}
          onChange={onTextFieldChange}
          onClick={(e) => {
            setMenuToggle(true);
          }}
          onKeyDown={(e) => {
            if (props.onKeyDown) {
              props.onKeyDown(e);
            }
            if (e.key === 'Enter') {
              onTextFieldEnter(e);
            }
          }}
        />
        <IncreaseButton
          ref={incrementRef}
          alert={props.alert}
          disabled={props.disabled}
          onClick={incrementOnClick}
        >
          {increaseIcon}
        </IncreaseButton>
      </Container>
      {menuOptions && menuToggle && (
        <div style={{ display: 'flex' }}>
          {!props.vertical && props.label ? (
            <Label style={{ opacity: 0 }}>{props.label}</Label>
          ) : null}
          <Menu
            ref={menuRef}
            maxHeight={props.maxHeight ? props.maxHeight : '150px'}
          >
            {menuOptions}
          </Menu>
        </div>
      )}
    </div>
  );
}

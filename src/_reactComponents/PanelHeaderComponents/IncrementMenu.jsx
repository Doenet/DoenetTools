import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96];

const Container = styled.div`
  display: ${(props) => props.label && !props.vertical && 'flex' };
  align-items: ${(props) => props.label && !props.vertical && 'center' };
`

const IncrementBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20px;
  margin: 0;
  border-radius: 5px;
  border: ${(props) => (props.alert ? '2px solid var(--mainRed)' : 'var(--mainBorder)')};
`;

const IncrementContainer = styled.div`
  position: relative;
  width: ${(props) => (props.width === 'menu' ? '100%' : props.width ? props.width : '210px')};
`;

const IncreaseButton = styled.button`
  background-color: ${props => props.disabled ? 'var(--mainGray)' : 'var(--mainBlue)'};
  border-radius: 0px 2px 2px 0px;
  height: 100%;
  width: 36px;
  color: ${(props) => (props.disabled ? 'black' : 'white')};
  font-size: 18px;
  border: none;
  &:hover {
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    color: black;
    background-color: ${props => props.disabled ? 'var(--mainGray)' : 'var(--lightBlue)'};
  }
`;

const DecreaseButton = styled.button`
  background-color: ${props => props.disabled ? 'var(--mainGray)' : 'var(--mainBlue)'};
  border-radius: 2px 0px 0px 2px;
  text-align: center;
  height: 100%;
  width: 36px;
  color: ${(props) => (props.disabled ? 'black' : 'white')};
  font-size: 18px;
  border: none;
  &:hover {
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    color: black;
    background-color: ${props => props.disabled ? 'var(--mainGray)' : 'var(--lightBlue)'};
  }
`;

const TextField = styled.input`
  z-index: 0;
  width: 100%;
  text-align: center;
  resize: none;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'default')};
  outline: none;
  border: none;
`;

const Label = styled.span`
  font-size: 14px;
  margin-right: 5px;
`;

const Menu = styled.div`
  background-color: 'var(--mainGray)';
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  border: 'var(--mainBorder)';
  border-top: none;
  border-radius: 'var(--mainBorderRadius)';
  position: absolute;
  left: 0;
  right: 0;
  overflow: scroll;
  max-height: ${(props) => props.maxHeight};
  z-index: 100;
`;

const MenuOption = styled.button`
  background-color: 'var(--mainGray)';
  display: block;
  width: 100%;
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
  };

  const [index, setIndex] = useState(0);
  const [value, setValue] = useState(props.value ?? '');
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
    };
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
      };

      setNumericValues(numericFlag);
      // console.log('>>> numericValues', numericFlag);
    };
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
  } else if (values) {
    menuOptions = values.map((value, index) => (
      <MenuOption key={index} value={value} onClick={onMenuClick}>
        {value}
      </MenuOption>
    ));
  } else {
    let generalChoices = []
    let min = props.min !== undefined ? props.min : 1;
    let max = props.max !== undefined ? props.max : 100;
    let count = min;
    for (let i=0; i <= max-min; i++) {
      generalChoices[i] = count;
      count++;
    }
    menuOptions =  generalChoices.map((choice, index) => (
      <MenuOption key={index} value={choice} onClick={onMenuClick}>
        {choice}
      </MenuOption>
    ));
  }

  console.log(props.menuOptions);

  return (
    <Container label={props.label} vertical={props.vertical}>
      {props.label && <Label>{props.label}</Label> }
      {props.label && props.vertical && <br /> }
      <IncrementContainer width={props.width}>
        <IncrementBox
          ref={containerRef}
          onBlur={containerOnBlur}
          alert={props.alert}
        >
          <DecreaseButton
            ref={decrementRef}
            disabled={props.disabled}
            onClick={decrementOnClick}
          >
            {decreaseIcon}
          </DecreaseButton>
          <TextField
            placeholder={props.placeholder}
            value={value}
            ref={textFieldRef}
            disabled={props.disabled ? props.disabled : false}
            onChange={onTextFieldChange}
            onClick={(e) => {
              setMenuToggle(true);
            }}
            onKeyDown={(e) => {
              if (props.onKeyDown) {
                props.onKeyDown(e);
              };
              if (e.key === 'Enter') {
                onTextFieldEnter(e);
              };
            }}
          />
          <IncreaseButton
            ref={incrementRef}
            disabled={props.disabled}
            onClick={incrementOnClick}
          >
            {increaseIcon}
          </IncreaseButton>
        </IncrementBox>
        {!props.deactivateDropdown && menuOptions && menuToggle && (
          <Menu
            ref={menuRef}
            maxHeight={props.maxHeight ? props.maxHeight : '150px'}
          >
            {menuOptions}
          </Menu>
        )}
      </IncrementContainer>
      
    </Container>
  );
};

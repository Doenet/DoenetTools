import React, { useCallback, useEffect, useState, useRef } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import styled from 'styled-components';
import './DateTime.css';

const Label = styled.div`
  font-size: 14px;
  width: fit-content;
  display: ${(props) => (props.vertical ? 'block' : 'inline')};
  // margin: 4px;
`;

export default function DateTime(props) {
  //console.log('props', props);
  const [value, setValue] = useState(props.value);
  const [lastValid, setLastValid] = useState(props.value);
  const inputRef = useRef(null);
  const [cursorStart, setCursorStart] = useState(0);
  const [cursorEnd, setCursorEnd] = useState(0);

  let borderColor = props.alert ? '2px solid #C1292E' : '2px solid black';
  borderColor = props.disabled ? '2px solid #e2e2e2' : borderColor;
  let cursorStyle = props.disabled ? 'not-allowed' : 'auto';

  useEffect(() => {
    //todo try lastValid update
    setLastValid(props.value);
    setValue(props.value);
  }, [props]);

  useEffect(() => {
    // console.log('triggered', cursorStart, cursorEnd);
    inputRef.current.selectionStart = cursorStart;
    inputRef.current.selectionEnd = cursorEnd;
  });

  let placeholder = '';

  if (props.datePicker !== false) {
    placeholder = 'mm/dd/yyyy';
  }

  if (props.timePicker !== false && props.precision === 'seconds') {
    placeholder += ' hh:mm:ss';
  } else if (props.timePicker !== false) {
    placeholder += ' hh:mm';
  }

  placeholder = props.placeholder ? props.placeholder : placeholder;

  let inputProps = {
    // disabled: props.disabled === true ? true : false,
    placeholder: placeholder,
  };

  const renderInput = (propsRI, openCalendar, closeCalendar) => {
    //console.log('propRI', propsRI);
    return (
      <div style={{ width: 'fit-content' }}>
        {props.label ? (
          <Label vertical={props.vertical}>{props.label}</Label>
        ) : null}
        <input
          {...propsRI}
          style={{ border: borderColor, cursor: cursorStyle }}
          ref={inputRef}
          onChange={(e) => {
            // console.log(e.target.selectionStart, e.target.selectionEnd);
            setCursorStart(e.target.selectionStart);
            setCursorEnd(e.target.selectionEnd);
            propsRI.onChange(e);
          }}
          onClick={(e) => {
            //console.log('clicked');
            propsRI.onClick(e);
          }}
          onKeyDown={(e) => {
            if (props.onKeyDown) {
              props.onKeyDown(e);
            }
            if (e.key === 'Enter') {
              closeCalendar();
              e.target.blur();
            }
          }}
        />
      </div>
    );
  };

  // console.log(
  //   'placeholder',
  //   placeholder,
  //   'value: ',
  //   value,
  //   ' props.value: ',
  //   props.value,
  // );

  if (props.disabled === true) {
    return (
      <input
        ref={inputRef}
        onClick={props.disabledOnClick}
        value={props.disabledText}
        // disabled
        style={{
          cursor: 'not-allowed',
          color: '#545454',
          height: '18px',
          width: '177px',
          border: '2px solid #e2e2e2',
          borderRadius: '5px',
        }}
      />
    );
  }

  return (
    <Datetime
      renderInput={renderInput}
      value={value}
      dateFormat={props.datePicker === false ? false : true}
      timeFormat={
        props.precision === 'seconds' && props.timePicker !== false
          ? 'hh:mm:ss a'
          : props.timePicker === false
          ? false
          : true
      }
      inputProps={inputProps}
      onChange={(dateObjectOrString) => {
        // console.log('onChange', typeof dateObjectOrString, dateObjectOrString);
        setValue(dateObjectOrString);
        if (props.onChange) {
          props.onChange({
            valid: typeof dateObjectOrString !== 'string',
            value: dateObjectOrString,
          });
        }
      }}
      onClose={(_) => {
        //console.log('onBlur', dateObjectOrString.toDate());
        let valid = typeof value !== 'string';
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
  );
}

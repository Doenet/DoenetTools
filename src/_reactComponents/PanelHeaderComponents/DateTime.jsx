import React, { useCallback, useEffect, useState, useRef } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import './DateTime.css';

export default function DateTime(props) {
  //console.log('props', props);
  const [value, setValue] = useState(props.value);
  const inputRef = useRef(null);
  const [cursorStart, setCursorStart] = useState(0);
  const [cursorEnd, setCursorEnd] = useState(0);

  useEffect(() => {
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
    disabled: props.disabled === true ? true : false,
    placeholder: placeholder,
  };

  const renderInput = (propsRI, openCalendar, closeCalendar) => {
    //console.log('propRI', propsRI);
    return (
      <div>
        <input
          {...propsRI}
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
            if (e.key === 'Enter') {
              closeCalendar();
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
        if (props.onBlur) {
          props.onBlur({
            valid: typeof value !== 'string',
            value: value,
          });
        }
      }}
    />
  );
}

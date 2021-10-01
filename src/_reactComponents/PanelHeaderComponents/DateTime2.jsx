import React, { useCallback, useState } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import './DateTime.css';

export default function DateTime(props) {
  const [value, setValue] = useState(props.value ? props.value : null);

  let placeholder = '';

  if (props.datePicker !== false) {
    placeholder = 'mm/dd/yyyy';
  }

  if (props.timePicker !== false && props.precision === 'seconds') {
    placeholder += ' hh:mm:ss';
  } else if (props.timePicker !== false) {
    placeholder += ' hh:mm';
  }

  let inputProps = {
    disabled: props.disabled === true ? true : false,
    placeholder: placeholder,
  };

  //console.log('>>> placeholder', placeholder);

  return (
    <Datetime
      style={{ minWidth: '0px', width: '200px' }}
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
        if (typeof dateObjectOrString === 'string') {
          console.log('>>> value changed', dateObjectOrString);
          setValue(null);
        } else {
          console.log('>>> value changed', dateObjectOrString);
          setValue(dateObjectOrString.toDate());
        }
      }}
      onClose={(_) => {
        if (value === null) {
          console.log('>>> value updated', value);
          if (props.callback) {
            props.callback({ valid: false, value: value });
          }
        } else {
          console.log('>>> value updated', value);
          if (props.callback) {
            props.callback({
              valid: true,
              value: value,
            });
          }
        }
        // if (props.callback) {
        //   if (typeof dateObjectOrString === 'string') {
        //     console.log('>>> string', dateObjectOrString);
        //     props.callback(false, dateObjectOrString);
        //   } else {
        //     console.log(
        //       '>>> object',
        //       dateObjectOrString,
        //       dateObjectOrString.toDate(),
        //     );
        //     props.callback(true, dateObjectOrString.toDate());
        //   }
        // }
      }}
    />
  );
}

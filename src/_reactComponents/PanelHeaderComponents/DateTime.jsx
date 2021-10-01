import React, { useState } from 'react';
import { TimePicker, DateInput, TimePrecision } from '@blueprintjs/datetime';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import '@blueprintjs/core/lib/css/blueprint.css';

//props
//showArrowButtons - true/false - arrow buttons for time
//precision - minute/second - precision of time picker
//date - true/false - want calendar or not
//time - true/false - want time selector or not
//callBack - (newDate) => () - function to be called when time/date is changed

export default function DateTime(props) {
  const [dateObjectState, setDateObjectState] = useState(null);

  const dateTimeToText = (date) => {
    return date.toLocaleString([], {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const dateSecondTimeToText = (date) => {
    return date.toLocaleString([], {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const dateToText = (date) => {
    return date.toLocaleString([], {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };

  const textToDate = (s) => {
    try {
      return new Date(s);
    } catch {
      return dateObjectState;
    }
  };

  const handleDateChange = (selectedDate, isUserChange) => {
    setDateObjectState(selectedDate);
    if (props.callBack) {
      props.callBack(selectedDate);
    }
  };

  const handleTimeChange = (newTime) => {
    setDateObjectState(newTime);
    if (props.callBack) {
      props.callBack(newTime);
    }
  };

  if (props.time && props.time !== true && props.time !== false) {
    console.log('time attribute can only take boolean values');
    return <input />;
  }

  if (props.date && props.date !== true && props.date !== false) {
    console.log('date attribute can only take boolean values');
    return <input />;
  }

  if (props.time === false && props.date === false) {
    console.log("Both time and date can't be false");
    return <input />;
  }

  if (props.date === false) {
    return (
      <TimePicker
        disabled={
          props.disabled === undefined || props.disabled === null
            ? false
            : props.disabled
        }
        showArrowButtons={
          props.showArrowButtons === null ||
          props.showArrowButtons === undefined
            ? false
            : props.showArrowButtons
        }
        precision={
          props.precision === 'second'
            ? TimePrecision.SECOND
            : TimePrecision.MINUTE
        }
        onChange={handleTimeChange}
        value={dateObjectState}
      />
    );
  }

  return (
    <DateInput
      disabled={
        props.disabled === undefined || props.disabled === null
          ? false
          : props.disabled
      }
      highlightCurrentDay={true}
      onChange={handleDateChange}
      placeholder={
        props.time === false
          ? 'M/D/YYYY'
          : props.precision === 'second'
          ? 'M/D/YYYY, H:MM:SS'
          : 'M/D/YYYY, H:MM'
      }
      timePickerProps={
        props.time === false
          ? undefined
          : {
              showArrowButtons:
                props.showArrowButtons === null ||
                props.showArrowButtons === undefined
                  ? false
                  : props.showArrowButtons,
              precision:
                props.precision === 'second'
                  ? TimePrecision.SECOND
                  : TimePrecision.MINUTE,
            }
      }
      closeOnSelection={false}
      formatDate={
        props.time === false
          ? dateToText
          : props.precision === 'second'
          ? dateSecondTimeToText
          : dateTimeToText
      }
      parseDate={textToDate}
      value={dateObjectState}
    />
  );
}

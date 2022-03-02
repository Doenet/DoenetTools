import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarPlus,
  faCalendarTimes,
  faCheck,
  faBan,
} from '@fortawesome/free-solid-svg-icons';
import React, { useRef } from 'react';
import styled from 'styled-components';
import { doenetMainBlue } from './theme';

const Button = styled.button`
  height: 24px;
  border: 2px solid;
  border-color: ${(props) => props.color};
  border-radius: 5px;
  color: #fff;
  background-color: ${(props) => props.color};
`;

export default function CalendarButton(props) {
  let checkedIcon = props.checkedIcon ? (
    props.checkedIcon
  ) : (
    <FontAwesomeIcon icon={faCheck} />
  );
  let uncheckedIcon = props.uncheckedIcon ? (
    props.uncheckedIcon
  ) : (
    <FontAwesomeIcon icon={faBan} />
  );
  const icon = props.checked ? checkedIcon : uncheckedIcon;
  const color = props.checked ? doenetMainBlue : '#e2e2e2';
  const buttonRef = useRef(null);

  // console.log(checkedIcon, props.checkedIcon);

  return (
    <Button
      style={props.style}
      color={color}
      ref={buttonRef}
      onClick={(e) => {
        // console.log('contains click', buttonRef.current.contains(e.target));
        props.onClick(e);
      }}
    >
      {icon}
    </Button>
  );
}

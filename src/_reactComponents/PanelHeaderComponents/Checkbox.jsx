import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faBan,
} from '@fortawesome/free-solid-svg-icons';
import React, { useRef } from 'react';
import styled from 'styled-components';

const Button = styled.button`
  height: 24px;
  border: 2px solid;
  border-color: ${(props) => props.color};
  border-radius: var(--mainBorderRadius);
  color: #fff;
  background-color: ${(props) => props.color};
  
  &:hover {
    color: ${props =>(props.disabled ? 'white' : 'black')};
    background-color: ${props => props.alert ? 'var(--lightRed)' : (props.disabled ? 'var(--mainGray)' : 'var(--lightBlue)')};
  }
`;

export default function Checkbox(props) {

  let checkedIcon = props.checkedIcon ? props.checkedIcon : <FontAwesomeIcon icon={faCheck} />
  let uncheckedIcon = props.uncheckedIcon ? props.uncheckedIcon : <FontAwesomeIcon icon={faBan} />

  // const icon = props.checked ? checkedIcon : uncheckedIcon;
  // const color = props.checked ? 'var(--mainBlue)' : 'var(--mainGray)';
  const buttonRef = useRef(null);

  return (
    <Button
      alert={props.alert}
      disabled={props.disabled}
      color={props.checked ? (props.alert ? 'var(--mainRed)' : 'var(--mainBlue)') : 'var(--mainGray)'}
      ref={buttonRef}
      onClick={(e) => props.onClick && props.onClick(e)}
    >
      {props.checked ? checkedIcon : uncheckedIcon}
    </Button>
  );
}

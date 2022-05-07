import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faBan,
} from '@fortawesome/free-solid-svg-icons';
import React, { useRef } from 'react';
import styled from 'styled-components';

const CheckboxContainer = styled.div`
  display: ${props => props.label ? 'flex' : 'inline-block'};
  align-items: ${props => props.label && 'center'};
`

const Label = styled.span`
  font-size: 14px;
  margin-left: 5px;
`;

const StyledCheckbox = styled.button`
  height: 24px;
  border: 2px solid;
  border-color: ${(props) => props.checked ? (props.alert ? 'var(--mainRed)' : 'var(--mainBlue)') : 'var(--mainGray)'};
  border-radius: var(--mainBorderRadius);
  color: white;
  background-color: ${(props) => props.checked ? (props.alert ? 'var(--mainRed)' : 'var(--mainBlue)') : 'var(--mainGray)'};
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
    <CheckboxContainer label={props.label} >
      <StyledCheckbox
        alert={props.alert}
        disabled={props.disabled}
        checked={props.checked}
        ref={buttonRef}
        onClick={(e) => props.onClick && props.onClick(e)}
      >
        {props.checked ? checkedIcon : uncheckedIcon}
      </StyledCheckbox>
      {props.label && <Label>{props.label}</Label>}
    </CheckboxContainer>
    
  );
}

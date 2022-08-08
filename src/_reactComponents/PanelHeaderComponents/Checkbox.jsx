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
  color: ${(props) => props.textColor};
  background-color: ${(props) => props.color};
  cursor: ${(props) => props.cursor};
  &:hover {
    color: black;
    background-color: ${props => props.alert ? 'var(--lightRed)' : (props.disabled ? 'var(--mainGray)' : 'var(--lightBlue)')};
  }
`;
const Label = styled.p`
  font-size: 14px;
  display: ${(props) => props.labelVisible};
  margin-right: 5px;
  margin-bottom: ${(props) => props.align == 'flex' ? 'none' : '2px'}
`
 
const Container = styled.div`
  display: ${(props) => props.align};
  width: auto;
  align-items: center;
` 

export default function CheckboxButton(props) {
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
  const color = props.checked ? 'var(--mainBlue)' : 'var(--mainGray)';
  const textColor = props.checked ? 'white' : 'black';
  const buttonRef = useRef(null);
  const cursor = props.disabled ? 'not-allowed' : 'pointer';
  const labelVisible = props.label ? 'static' : 'none';
  const align = props.vertical ? 'static' : 'flex';
  const disabled = props.disabled ? true : false;
  let labelValue = "Label:";
  if (props.label) {
    labelValue = props.label;
  };

  return (
    <Container 
      align={align}
    >
      <Label
        align={align}
        labelVisible={labelVisible}
      >
        {labelValue}
      </Label>
      <Button
      style={props.style}
      color={color}
      textColor={textColor}
      ref={buttonRef}
      disabled={disabled}
      cursor={cursor}
      onClick={(e) => {
        // console.log('contains click', buttonRef.current.contains(e.target));
        if (props.onClick){
          props.onClick(e);
        }
      }}
    >
      {icon}
    </Button>
    </Container>
  );
}

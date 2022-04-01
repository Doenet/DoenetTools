import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Button = styled.button`
  margin: ${(props) => props.theme.margin};
  height: 24px;
  border: ${props => props.alert ? '2px solid var(--mainRed)' : (props.disabled ? '2px solid var(--mainGray)' : '2px solid var(--mainBlue)')};
  border-width: 2px;
  color: ${props => props.alert ? 'var(--mainRed)' : (props.disabled ? 'var(--mainGray)' : 'var(--mainBlue)')};
  background-color: white;
  border-radius: ${(props) => props.theme.borderRadius};
  padding: ${(props) => props.theme.padding};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 12px;
  text-align: center;

  &:hover { // Button color lightens on hover
    color: ${props => props.disabled ? 'var(--mainGray)' : 'black'};
    background-color: ${props => props.alert ? 'var(--lightRed)' : (props.disabled ? 'none' : 'var(--lightBlue)')};
  };
`;

Button.defaultProps = {
  theme: {
    margin: '0px',
    borderRadius: 'var(--mainBorderRadius)',
    padding: '0px 10px 0px 10px',
  },
};

// const Label = styled.p`
//   font-size: 12px;
//   display: ${props => props.labelVisible};
//   margin-right: 5px;
//   margin-bottom: ${props => props.align == 'flex' ? 'none' : '2px'};
// `
// const Container = styled.div`
//   display: ${props => props.align};
//   width: auto;
//   align-items: center;
// `

export default function ToggleButton(props) {
  const [isSelected, setSelected] = useState(props.isSelected ? props.isSelected : false);
  const labelVisible = props.label ? 'static' : 'none';
  const align = props.vertical ? 'static' : 'flex';
  const alert = props.alert ? props.alert : null;
  const disabled = props.disabled ? props.disabled : null;

  useEffect(() => {
    setSelected(props.isSelected);
  }, [props.isSelected]);
  //Assume small
  var toggleButton = {
    value: 'Toggle Button',
  };

  var icon = '';
  var label = {
    value: 'Label:',
    fontSize: '14px',
    display: `${labelVisible}`,
    marginRight: '5px',
    marginBottom: `${align == 'flex' ? 'none' : '2px'}`,
  };

  var container = {
    display: `${align}`,
    width: 'auto',
    alignItems: 'center',
  };

  if (props.value || props.icon) {
    if (props.value && props.icon) {
      icon = props.icon;
      toggleButton.value = props.value;
    } else if (props.value) {
      toggleButton.value = props.value;
    } else if (props.icon) {
      icon = props.icon;
      toggleButton.value = '';
    }
  };

  if (isSelected === true) {
    if (!props.disabled) {
      if (!props.alert) {
        toggleButton.backgroundColor = 'var(--mainBlue)';
      } else {
        toggleButton.backgroundColor = 'var(--mainRed)';
      }
      toggleButton.color = '#FFF';
      if (props.switch_value) toggleButton.value = props.switch_value;
    }
  };

  function handleClick() {
    if (props.onClick)
      props.onClick(
        props.index !== null && props.index !== undefined ? props.index : null,
      );
  };

  if (props.label) {
    label.value = props.label;
  };

  if (props.width) {
    if (props.width === 'menu') {
      toggleButton.width = '235px';
      if (props.label) {
        container.width = '235px';
        toggleButton.width = '100%';
      }
    }
  };

  if (props.num === 'first') {
    toggleButton.borderRadius = '5px 0px 0px 5px';
  };

  if (props.num === 'last') {
    toggleButton.borderRadius = '0px 5px 5px 0px';
  };

  if (props.num === 'first_vert') {
    toggleButton.borderRadius = '5px 5px 0px 0px';
  };

  if (props.num === 'last_vert') {
    toggleButton.borderRadius = '0px 0px 5px 5px';
  };

  return (
    <>
      <div style={container}>
        <p style={label}>{label.value}</p>
        <Button
          id="toggleButton"
          style={toggleButton}
          disabled={disabled}
          alert={alert}
          onClick={() => {
            handleClick();
          }}
        >
          {icon} {toggleButton.value}
        </Button>
      </div>
    </>
  );
};

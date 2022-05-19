import React from 'react';
import styled from "styled-components";

const StyledButton = styled.button`
  height: 24px;
  border-style: hidden;
  color: ${props => props.disabled ? 'black' : 'white'};
  background-color: ${props => props.alert ? 'var(--mainRed)' : props.disabled ? 'var(--mainGray)' : 'var(--mainBlue)'};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.padding};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 12px;
  border-radius: 20px;
  width: ${props => props.width === "menu" ? '100%' : props.width ? props.width : 'auto'};
  &:hover {
    background-color: ${props => props.alert ? 'var(--lightRed)' : props.disabled ? 'var(--mainGray)' : 'var(--lightBlue)'};
    color: black;
  };
`;

const Label = styled.span`
  font-size: 14px;
  margin-right: 5px;
`;

const Container = styled.div`
  display: ${ props => props.label && !props.vertical && 'flex' };
  align-items: ${props => props.label && !props.vertical && 'center'};
  margin: ${props => props.theme.margin}
`;

StyledButton.defaultProps = {
  theme: {
    margin: 0,
    borderRadius: 'var(--mainBorderRadius)',
    padding: '0 10px'
  }
};

export default function Button(props) {
  //Assume small
  // var container = {};
  // var align = 'flex';
  // var button = {
  //   value: 'Button',
  // };
  // var button = {
  //       margin: '0px',
  //       height: '24px',
  //       border: `hidden`,
  //       backgroundColor: `${doenetComponentForegroundActive}`,
  //       fontFamily: 'Arial',
  //       color: '#FFFFFF',
  //       borderRadius: '20px',
  //       value: 'Button',
  //       padding: '0px 10px 0px 10px',
  //       cursor: 'pointer',
  //       fontSize: '12px'
  //     };
  // if (props.width) {
  //   if (props.width === "menu") {
  //     button.width = '100%';
  //     if (props.label) {
  //       container.width = 'menu';
  //       button.width = '100%';
  //     }
  //   } 
  // };

  // const [labelVisible, setLabelVisible] = useState(props.label ? 'static' : 'none');
  // var label = '';
  // if (props.label) {
  //   label = props.label;
  //   if (props.vertical) {
  //     align = 'static';
  //   }
  // };

  // var icon = '';
  // if (props.value || props.icon){
  //   if (props.value && props.icon){
  //       icon = props.icon;
  //       button.value = props.value
  //   }
  //   else if (props.value){
  //       button.value = props.value
  //   }
  //   else if (props.icon){
  //       icon = props.icon;
  //       button.value = ''
  //   }
  // };

  // if (props.alert) {
  //   button.backgroundColor = 'var(--mainRed)'
  // }

  // if (props.disabled) {
  //   button.backgroundColor = 'var(--mainGray)';
  //   button.color = 'black';
  //   button.cursor = 'not-allowed';
  // };

  // if (props.value) {
  //     button.value = props.value;
  // };
 
  // function handleClick(e) {
  //   if (props.onClick) props.onClick(e)
  // };

  return (
    <Container 
      label={props.label} 
      vertical={props.vertical} 
      theme={props.theme}
    >
      { props.label && <Label>{props.label}</Label> }
      { props.label && props.vertical && <br />}
      <StyledButton 
        theme={props.theme}
        disabled={props.disabled} 
        alert={props.alert} 
        width={props.width} 
        onClick={(e) => props.onClick && props.onClick(e)}
      >
        {props.icon && props.icon}  
        {(props.icon ? " " : "" ) + (props.value ? props.value : "Button")} 
      </StyledButton>
    </Container>
  )
};
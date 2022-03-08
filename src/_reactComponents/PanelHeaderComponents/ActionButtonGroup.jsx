import React from 'react';
import styled, { ThemeProvider } from 'styled-components';

const Container = styled.div`
  display: ${(props) => props.vertical || props.verticalLabel ? 'static' : 'flex'};
  // margin: 2px 0px 2px 0px
`;

const Label = styled.p`
  font-size: 14px;
  display: ${props => props.labelVisible};
  margin-right: 5px;
  margin-left: 4px;
  margin-bottom: ${props => props.align == 'flex' ? 'none' : '2px'};
`;

const actionGroup = {
  margin: '0px -2px 0px -2px',
  borderRadius: '0',
  padding: '0px 12px 0px 10px',
  border: '1px solid lightGray' // Adds a light border around each button in the group
};

const verticalActionGroup = {
  margin: '-2px 4px -2px 4px',
  borderRadius: '0',
  padding: '0px 10px 0px 10px',
  border: '1px solid lightGray'
}; 

const ActionButtonGroup = (props) => {
  // if (props.width) {
  //   if (props.width === "menu") {
  //     actionGroup.width = '235px'
  //   } else {
  //     actionGroup.width = props.width
  //   }
  // }
  let first_prop = props.vertical ? 'first_vert' : 'first';
  let last_prop = props.vertical ? 'last_vert' : 'last';
  let elem = React.Children.toArray(props.children);
  if (elem.length > 1) {
    elem = [React.cloneElement(elem[0], {num: first_prop})]
      .concat(elem.slice(1,-1))
      .concat(React.cloneElement(elem[elem.length - 1], {num: last_prop}));
  };

  const labelVisible = props.label ? 'static' : 'none';
  var label = '';
  var align = 'flex';
  if (props.label) {
    label = props.label;
    if (props.verticalLabel) {
      align = 'static'; // isn't working
    };
  };

  return (
    <Container vertical={props.vertical} align={align}>
      <Label labelVisible={labelVisible} align={align}>{label}</Label>
      <ThemeProvider theme={props.vertical ? verticalActionGroup : actionGroup}>{elem}</ThemeProvider>
    </Container>
  )
}

export default ActionButtonGroup;


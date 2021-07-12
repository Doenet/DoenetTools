import React from 'react';
import styled, { ThemeProvider } from 'styled-components';

const actionGroup = {
  margin: "0px -2px 0px -2px",
  borderRadius: '0',
  padding: '0px 12px 0px 10px',
};

const ActionButtonGroup = (props) => {
  // if (props.width) {
  //   if (props.width === "menu") {
  //     actionGroup.width = '235px'
  //   } else {
  //     actionGroup.width = props.width
  //   }
  // }
  let elem = React.Children.toArray(props.children);
  if (elem.length > 1) {
    elem = [React.cloneElement(elem[0], {num: 'first'})]
      .concat(elem.slice(1,-1))
      .concat(React.cloneElement(elem[elem.length - 1], {num: 'last'}));
  }
  return (
    <div style={{display: 'flex'}}>
      <ThemeProvider theme={actionGroup}>{elem}</ThemeProvider>
    </div>
  )
}

export default ActionButtonGroup;


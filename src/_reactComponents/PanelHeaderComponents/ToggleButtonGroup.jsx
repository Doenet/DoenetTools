import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';

const Container = styled.div`
  display: ${(props) => (props.vertical ? 'static' : 'flex')};
  // height: 'fit-content';
  // margin: 2px 0px 2px 0px ;
`;

const toggleGroup = {
  margin: '0px -2px 0px -2px',
  borderRadius: '0',
  padding: '0px 12px 0px 10px',
};

const verticalToggleGroup = {
  margin: '-2px 4px -2px 4px',
  borderRadius: '0',
  padding: '0px 10px 0px 10px',
};

const ToggleButtonGroup = (props) => {
  // if (props.width) {
  //   if (props.width === "menu") {
  //     actionGroup.width = '235px'
  //   } else {
  //     actionGroup.width = props.width
  //   }
  // }
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleClick = (index) => {
    setSelectedIndex(index);
    if (props.onClick) {
      props.onClick(index);
    }
  };

  let first_prop = props.vertical ? 'first_vert' : 'first';
  let last_prop = props.vertical ? 'last_vert' : 'last';

  let elem = React.Children.toArray(props.children);

  let modElem = elem.map((element, index) => {
    let props = {
      index,
      isSelected: index === selectedIndex,
      onClick: handleClick,
    };

    if (index === 0) {
      props['num'] = first_prop;
    } else if (index === elem.length - 1) {
      props['num'] = last_prop;
    };

    return React.cloneElement(element, props);
  });

  return (
    <Container style={{ height: 'fit-content' }} vertical={props.vertical} role="group">
      <ThemeProvider theme={props.vertical ? verticalToggleGroup : toggleGroup}>
        {modElem}
      </ThemeProvider>
    </Container>
  );
};

export default ToggleButtonGroup;

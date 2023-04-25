import React from "react";
import styled, { ThemeProvider } from "styled-components";

const Container = styled.div`
  /* margin-left: 3px; */
  display: ${(props) => (props.vertical ? "static" : "flex")};
  overflow: auto;
  min-width: 0;
  /* flex-wrap: wrap; */
`;

const LabelContainer = styled.div`
  display: ${(props) => props.align};
  width: ${(props) => (props.width == "menu" ? "var(--menuWidth)" : "")};
  align-items: ${(props) => props.alignItems};
`;

const Label = styled.p`
  font-size: 14px;
  display: ${(props) => props.labelVisible};
  margin-right: 5px;
  margin-bottom: ${(props) => (props.align == "flex" ? "none" : "2px")};
`;

const actionGroup = {
  // margin: '0px -2px 0px -2px',
  borderRadius: "0",
  padding: "0px 12px 0px 10px",
  border: "1px solid var(--mainGray)", // Adds a light border around each button in the group
  outlineOffset: "-6px",
};

const verticalActionGroup = {
  margin: "0px 4px 0px 4px",
  borderRadius: "0",
  padding: "0px 10px 0px 10px",
  border: "1px solid var(--mainGray)",
  outlineOffset: "-6px",
};

const ActionButtonGroup = (props) => {
  let first_prop = props.vertical ? "first_vert" : "first";
  let last_prop = props.vertical ? "last_vert" : "last";
  let overflow_prop = props.width ? "no_overflow" : "overflow";
  let elem = React.Children.toArray(props.children);
  if (elem.length > 1) {
    elem = [
      React.cloneElement(elem[0], { num: first_prop, overflow: overflow_prop }),
    ]
      .concat(
        elem
          .slice(1, -1)
          .map((x) => React.cloneElement(x, { overflow: overflow_prop })),
      )
      .concat(
        React.cloneElement(elem[elem.length - 1], {
          num: last_prop,
          overflow: overflow_prop,
        }),
      );
  }

  const labelVisible = props.label ? "static" : "none";
  var label = "";
  var align = "flex";
  var alignItems = "center";

  if (props.label) {
    label = props.label;
    if (props.verticalLabel) {
      align = "static";
    }
  }

  return (
    <>
      <LabelContainer align={align} alignItems={alignItems} width={props.width}>
        <Label labelVisible={labelVisible} align={align}>
          {label}
        </Label>
        <Container vertical={props.vertical}>
          <ThemeProvider
            theme={props.vertical ? verticalActionGroup : actionGroup}
          >
            {elem}
          </ThemeProvider>
        </Container>
      </LabelContainer>
    </>
  );
};

export default ActionButtonGroup;

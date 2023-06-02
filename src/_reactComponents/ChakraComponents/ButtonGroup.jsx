import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { ButtonGroup as ChakraButtonGroup } from "@chakra-ui/react";

export default function ButtonGroup(props) {
  let elem = React.Children.toArray(props.children);

  return <ChakraButtonGroup {...props}>{elem}</ChakraButtonGroup>;
}

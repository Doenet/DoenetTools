import React, { useState } from "react";
import styled from "styled-components";
import { MathJax } from "better-react-mathjax";
import { Button as ChakraButton } from "@chakra-ui/react";

export default function Button(props) {
  return <ChakraButton {...props}></ChakraButton>;
}

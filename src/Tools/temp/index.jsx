import React from "react";
import { createRoot } from "react-dom/client";
import Button from "../../_reactComponents/ChakraComponents/Button";
import ButtonGroup from "../../_reactComponents/ChakraComponents/ButtonGroup";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "/home/node/workspace/src/theme.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";

const root = createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider theme={theme}>Test code goes here!</ChakraProvider>,
);

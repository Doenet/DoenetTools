import React from "react";
import { createRoot } from "react-dom/client";
import ChakraButton from "../../_reactComponents/ChakraComponents/Button.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "/home/node/workspace/src/index.jsx";

const root = createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider theme={theme}>
    <ChakraButton>Hello</ChakraButton>
  </ChakraProvider>,
);

import React from "react";
import { createRoot } from "react-dom/client";
import Button from "../../_reactComponents/ChakraComponents/Button";
import ButtonGroup from "../../_reactComponents/ChakraComponents/ButtonGroup";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "/home/node/workspace/src/index.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";

const root = createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider theme={theme}>
    <Button variant="outline" onClick={() => console.log("Hello!")}>
      Hello
    </Button>

    <Button variant="outline">Hello</Button>
    <Button isLoading>Hello</Button>
    <Button variant="solid" isDisabled>
      Hello
    </Button>
    <Button variant="outline" isDisabled>
      Hello
    </Button>
    <Button variant="ghost" isDisabled>
      Hello
    </Button>

    <Button>
      <FontAwesomeIcon icon={faCode} />
    </Button>

    <ButtonGroup isAttached margin="4px">
      <Button>Hello</Button>
      <Button>World</Button>
    </ButtonGroup>

    <ButtonGroup margin="4px">
      <Button>Hello</Button>
      <Button>World</Button>
    </ButtonGroup>
  </ChakraProvider>,
);

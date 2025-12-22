import { useCallback, useEffect, useRef, useState } from "react";
import { useLoaderData, useOutletContext } from "react-router";
import { DoenetmlVersion } from "../types";
import { DoenetEditor } from "@doenet/doenetml-iframe";
import axios from "axios";
import defaultSource from "../assets/scratchPadDefault.doenet?raw";
import multipleChoice from "../assets/multipleChoiceExamples.doenet?raw";
import mathAnswers from "../assets/mathAnswerExamples.doenet?raw";
import graphicalAnswers from "../assets/graphicalAnswerExamples.doenet?raw";

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { SiteContext } from "./SiteHeader";

export async function loader() {
  const {
    data: { defaultDoenetmlVersion },
  } = await axios.get(`/api/info/getDefaultDoenetMLVersion`);

  let source = "";
  try {
    source = localStorage.getItem("scratchPad") || defaultSource;
  } catch (_e) {
    // Ignoring errors
  }

  return {
    doenetmlVersion: defaultDoenetmlVersion,
    source,
  };
}

/**
 * This page allows you edit a scratch pad of DoenetML to explore the features of DoenetML.
 */
export function ScratchPad() {
  const { doenetmlVersion, source } = useLoaderData() as {
    doenetmlVersion: DoenetmlVersion;
    source: string;
  };

  const [initialSource, setInitialSource] = useState(source);
  const [resetNum, setResetNum] = useState(0);

  const { user } = useOutletContext<SiteContext>();

  const loadButton = (
    <Menu>
      <MenuButton
        as={Button}
        size="sm"
        colorScheme="blue"
        data-test="Load Button"
      >
        <Text>Load</Text>
      </MenuButton>
      <MenuList>
        <MenuItem
          data-test="Add Default Button"
          onClick={() => {
            localStorage.removeItem("scratchPad");
            setInitialSource(defaultSource);
            // We update reset num to make sure editor updates.
            // If started with defaultSource and then we try to reset it back to defaultSource
            // no change is detected in initialSource even though we want to reset
            setResetNum((was) => was + 1);
          }}
        >
          Scratch Pad Welcome
        </MenuItem>
        <MenuItem
          data-test="Add Multiple Choice Examples Button"
          onClick={() => {
            setInitialSource(multipleChoice);
            // We update reset num to make sure editor updates.
            setResetNum((was) => was + 1);
          }}
        >
          Multiple Choice Examples
        </MenuItem>
        <MenuItem
          data-test="Add Math Answer Examples Button"
          onClick={() => {
            setInitialSource(mathAnswers);
            // We update reset num to make sure editor updates.
            setResetNum((was) => was + 1);
          }}
        >
          Math Answer Examples
        </MenuItem>
        <MenuItem
          data-test="Add Graphical Answer Examples Button"
          onClick={() => {
            setInitialSource(graphicalAnswers);
            // We update reset num to make sure editor updates.
            setResetNum((was) => was + 1);
          }}
        >
          Graphical Answer Examples
        </MenuItem>
      </MenuList>
    </Menu>
  );

  const saveScratchPad = user && (
    <Button
      data-test="Save to Document"
      colorScheme="blue"
      size="sm"
      marginLeft="10px"
      onClick={() => {}}
    >
      Save to Document
    </Button>
  );

  const scratchPadMessage = (
    <Alert status="warning" height="40px">
      <AlertIcon />
      <AlertTitle lineHeight="1em">Scratch Pad</AlertTitle>
      <AlertDescription>
        <Flex alignItems="center" lineHeight="1em">
          <Box>Note: scratch pad is not permanently saved.</Box>
        </Flex>
      </AlertDescription>
    </Alert>
  );

  return (
    <>
      <Box
        position="fixed"
        top="40px"
        height="40px"
        background="doenet.canvas"
        width="100%"
        zIndex="300"
        borderBottom="1px solid"
        borderColor="doenet.mediumGray"
      >
        <Flex
          backgroundColor="var(--chakra-colors-orange-100);"
          alignItems="center"
          paddingRight="15px"
        >
          {scratchPadMessage}

          {loadButton}
          {saveScratchPad}
        </Flex>
      </Box>
      <Box
        position="absolute"
        top={"80px"}
        left="0"
        right="0"
        bottom="0"
        background="doenet.lightBlue"
        overflow="auto"
      >
        <DocumentEditor
          source={initialSource}
          doenetmlVersion={doenetmlVersion}
          key={resetNum}
        />
      </Box>
    </>
  );
}

function DocumentEditor({
  source,
  doenetmlVersion,
}: {
  source: string;
  doenetmlVersion: DoenetmlVersion;
}) {
  const textEditorDoenetML = useRef(source);
  const savedDoenetML = useRef(source);

  const handleSaveDoc = useCallback(async () => {
    if (savedDoenetML.current === textEditorDoenetML.current) {
      return;
    }

    const newDoenetML = textEditorDoenetML.current;

    try {
      //Save in localStorage
      localStorage.setItem("scratchPad", newDoenetML);

      savedDoenetML.current = newDoenetML;
    } catch (_e) {
      // ignoring errors
    }
  }, []);

  // save draft when leave page
  useEffect(() => {
    return () => {
      handleSaveDoc();
    };
  }, [handleSaveDoc]);

  const baseUrl = window.location.protocol + "//" + window.location.host;
  const doenetViewerUrl = `${baseUrl}/activityViewer`;

  return (
    <DoenetEditor
      height="100%"
      width="100%"
      doenetML={textEditorDoenetML.current}
      doenetmlChangeCallback={() => {
        handleSaveDoc();
      }}
      immediateDoenetmlChangeCallback={(newDoenetML: string) => {
        textEditorDoenetML.current = newDoenetML;
      }}
      doenetmlVersion={doenetmlVersion.fullVersion}
      border="none"
      doenetViewerUrl={doenetViewerUrl}
    />
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import {
  redirect,
  useLoaderData,
  useOutletContext,
  useNavigate,
  useFetcher,
} from "react-router";
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
  Button,
  Flex,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  Tooltip,
  HStack,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { SiteContext } from "./SiteHeader";
import { SaveDoenetmlAndReportFinish } from "../popups/SaveDoenetmlAndReportFinish";
import { LuCircleHelp } from "react-icons/lu";
import { getDiscourseUrl } from "../utils/discourse";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);

  const doenetML = url.searchParams.get("doenetml");
  if (doenetML) {
    try {
      // Save requested DoenetML in localStorage
      // and then reload page without doenetml param
      // so that reloading the page won't reset to the original DoenetML
      localStorage.setItem("scratchPad", doenetML);
      return redirect(`/scratchPad`);
    } catch (e) {
      console.error(e);
    }
  }

  const contentId = url.searchParams.get("contentId");
  if (contentId) {
    try {
      const { data } = await axios.get(
        `/api/activityEditView/getContentSource/${contentId}`,
      );

      // Save DoenetML source from the contentId in localStorage
      // and then reload page without contentId param
      // so that reloading the page won't reset to the original DoenetML
      localStorage.setItem("scratchPad", data.source);
      return redirect(`/scratchPad`);
    } catch (e) {
      console.error(e);
    }
  }

  const {
    data: { defaultDoenetmlVersion },
  } = await axios.get(`/api/info/getDefaultDoenetmlVersion`);

  let source = "";
  try {
    source = localStorage.getItem("scratchPad") || defaultSource;
  } catch (e) {
    console.error(e);
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

  useEffect(() => {
    document.title = `Scratch pad - Doenet`;
  }, []);

  const { user, setAddTo } = useOutletContext<SiteContext>();
  const discussHref = getDiscourseUrl(user);

  const navigate = useNavigate();
  const fetcher = useFetcher();

  const [initialSource, setInitialSource] = useState(source);
  const [resetNum, setResetNum] = useState(0);

  const {
    isOpen: saveDialogIsOpen,
    onOpen: saveDialogOnOpen,
    onClose: saveDialogOnClose,
  } = useDisclosure();

  const saveDocumentDialog = user && (
    <SaveDoenetmlAndReportFinish
      isOpen={saveDialogIsOpen}
      onClose={saveDialogOnClose}
      DoenetML={initialSource}
      documentName={"Scratch Pad Document"}
      navigate={navigate}
      user={user}
      setAddTo={setAddTo}
      fetcher={fetcher}
    />
  );

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
            try {
              localStorage.setItem("scratchPad", multipleChoice);
            } catch (e) {
              console.error(e);
            }
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
            try {
              localStorage.setItem("scratchPad", mathAnswers);
            } catch (e) {
              console.error(e);
            }
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
            try {
              localStorage.setItem("scratchPad", graphicalAnswers);
            } catch (e) {
              console.error(e);
            }
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

  const helpButton = (
    <Menu>
      <Tooltip label="Help" openDelay={300} placement="bottom-end">
        <MenuButton
          size="sm"
          colorScheme="blue"
          as={IconButton}
          icon={<LuCircleHelp fontSize="1.2rem" />}
          aria-label="Help"
        />
      </Tooltip>
      <MenuList>
        <MenuItem as={ChakraLink} href="https://docs.doenet.org" isExternal>
          Documentation
        </MenuItem>
        <MenuItem as={ChakraLink} href={discussHref} isExternal>
          Ask a question
        </MenuItem>
      </MenuList>
    </Menu>
  );

  const saveButton = user && (
    <Button
      data-test="Save to Document"
      colorScheme="blue"
      size="sm"
      marginLeft="10px"
      onClick={() => {
        saveDialogOnOpen();
      }}
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
          <Box>Your changes are not permanently saved.</Box>
        </Flex>
      </AlertDescription>
    </Alert>
  );

  return (
    <>
      {saveDocumentDialog}
      <HStack
        position="fixed"
        top="40px"
        height="40px"
        background="orange.100"
        width="100%"
        pr="10px"
        zIndex="300"
      >
        {scratchPadMessage}
        <ButtonGroup spacing="5px">
          {helpButton}
          {loadButton}
          {saveButton}
        </ButtonGroup>
      </HStack>
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
    } catch (e) {
      console.error(e);
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

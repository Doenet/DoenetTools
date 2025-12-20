import { useCallback, useEffect, useRef } from "react";
import { useLoaderData } from "react-router";
import { DoenetmlVersion } from "../types";
import { DoenetEditor } from "@doenet/doenetml-iframe";
import axios from "axios";
import defaultSource from "../assets/scratchPadDefault.doenet?raw";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from "@chakra-ui/react";

export async function loader() {
  const {
    data: { defaultDoenetmlVersion },
  } = await axios.get(`/api/info/getDefaultDoenetMLVersion`);

  let source = "";
  try {
    source = localStorage.getItem("scratchPad") || defaultSource;
  } catch (e) {}

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

  const scratchPadMessage = (
    <Alert status="warning" height="40px">
      <AlertIcon />
      <AlertTitle>Scratch Pad</AlertTitle>
      <AlertDescription>
        Contents of the scratch pad are not permanently saved. Save to a
        document anything you want to keep.
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
        {scratchPadMessage}
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
        <DocumentEditor source={source} doenetmlVersion={doenetmlVersion} />
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
    } catch (error) {}
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

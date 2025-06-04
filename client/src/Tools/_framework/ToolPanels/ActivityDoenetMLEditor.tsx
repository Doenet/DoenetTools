import { Box, Grid, GridItem } from "@chakra-ui/react";
import { DoenetEditor, DoenetViewer } from "@doenet/doenetml-iframe";
import React, { useCallback, useEffect, useRef } from "react";
import {
  AssignmentStatus,
  ContentRevision,
  DoenetmlVersion,
} from "../../../_utils/types";
import { FetcherWithComponents, useLocation, useNavigate } from "react-router";
import axios, { AxiosError } from "axios";
import {
  doenetMLHistoryActions,
  DoenetMLHistoryDrawer,
} from "./DoenetMLHistoryDrawer";

export async function activityDoenetMLEditorActions({
  formObj,
}: {
  [k: string]: any;
}) {
  const resultDMLH = await doenetMLHistoryActions({ formObj });
  if (resultDMLH) {
    return resultDMLH;
  }

  return null;
}

export function ActivityDoenetMLEditor({
  doenetML,
  doenetmlVersion,
  assignmentStatus = "Unassigned",
  asViewer,
  contentId,
  mode,
  headerHeight,
  historyIsOpen = false,
  historyOnClose,
  fetcher,
  activityName = "",
  revisions = [],
}: {
  doenetML: string;
  doenetmlVersion: DoenetmlVersion;
  assignmentStatus?: AssignmentStatus;
  asViewer?: boolean;
  contentId: string;
  mode: "Edit" | "View";
  headerHeight: string;
  historyIsOpen?: boolean;
  historyOnClose?: () => void;
  fetcher?: FetcherWithComponents<any>;
  activityName?: string;
  revisions?: ContentRevision[];
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const textEditorDoenetML = useRef(doenetML);
  const savedDoenetML = useRef(doenetML);

  const numVariants = useRef(1);
  const documentStructureChanged = useRef(false);

  const readOnly = asViewer || assignmentStatus !== "Unassigned";
  const readOnlyRef = useRef(readOnly);
  readOnlyRef.current = readOnly;

  const initialWarnings = doenetmlVersion.deprecated
    ? [
        {
          level: 1,
          message: `DoenetML version
            ${doenetmlVersion.displayedVersion} is deprecated.
            ${doenetmlVersion.deprecationMessage}`,
          doenetMLrange: {},
        },
      ]
    : [];

  const inTheMiddleOfSaving = useRef(false);
  const postponedSaving = useRef(false);

  const handleSaveDoc = useCallback(async () => {
    if (
      readOnlyRef.current ||
      (savedDoenetML.current === textEditorDoenetML.current &&
        !documentStructureChanged.current)
    ) {
      // do not attempt to save doenetml if assigned
      return;
    }

    const newDoenetML = textEditorDoenetML.current;
    if (inTheMiddleOfSaving.current) {
      postponedSaving.current = true;
    } else {
      inTheMiddleOfSaving.current = true;

      //Save in localStorage
      // localStorage.setItem(cid,doenetML)

      try {
        const params = {
          doenetML: newDoenetML,
          contentId,
          numVariants: numVariants.current,
        };
        await axios.post("/api/updateContent/saveDoenetML", params);
        savedDoenetML.current = newDoenetML;
        documentStructureChanged.current = false;
      } catch (error) {
        if (error instanceof AxiosError) {
          alert(error.message);
        }
      }

      inTheMiddleOfSaving.current = false;

      //If we postponed then potentially
      //some changes were saved again while we were saving
      //so save again
      if (postponedSaving.current) {
        postponedSaving.current = false;
        handleSaveDoc();
      }
    }
  }, [contentId]);

  // save draft when leave page
  useEffect(() => {
    return () => {
      handleSaveDoc();
    };
  }, [handleSaveDoc]);

  const doenetmlHistoryDrawer = historyOnClose && fetcher && revisions && (
    <DoenetMLHistoryDrawer
      doenetML={textEditorDoenetML.current}
      doenetmlChangeCallback={handleSaveDoc}
      immediateDoenetmlChangeCallback={(newDoenetML: string) => {
        textEditorDoenetML.current = newDoenetML;
      }}
      documentStructureCallback={(x: any) => {
        if (Array.isArray(x.args?.allPossibleVariants)) {
          numVariants.current = x.args.allPossibleVariants.length;
        }
        documentStructureChanged.current = true;
      }}
      doenetmlVersion={doenetmlVersion}
      isOpen={historyIsOpen}
      onClose={historyOnClose}
      fetcher={fetcher}
      activityName={activityName}
      contentId={contentId}
      revisions={revisions}
    />
  );

  return (
    <>
      {doenetmlHistoryDrawer}
      {mode == "Edit" && (
        <DoenetEditor
          height={`calc(100vh - ${headerHeight})`}
          width="100%"
          doenetML={textEditorDoenetML.current}
          doenetmlChangeCallback={handleSaveDoc}
          immediateDoenetmlChangeCallback={(newDoenetML: string) => {
            textEditorDoenetML.current = newDoenetML;
          }}
          documentStructureCallback={(x: any) => {
            if (Array.isArray(x.args?.allPossibleVariants)) {
              numVariants.current = x.args.allPossibleVariants.length;
            }
            documentStructureChanged.current = true;
          }}
          doenetmlVersion={doenetmlVersion.fullVersion}
          initialWarnings={initialWarnings}
          border="none"
          readOnly={readOnly}
        />
      )}
      {mode == "View" && (
        <Grid
          width="100%"
          templateAreas={`"leftGutter viewer rightGutter"`}
          templateColumns={`1fr minmax(300px,850px) 1fr`}
        >
          <GridItem
            area="leftGutter"
            background="doenet.lightBlue"
            width="100%"
            paddingTop="10px"
            alignSelf="start"
          ></GridItem>
          <GridItem
            area="rightGutter"
            background="doenet.lightBlue"
            width="100%"
            paddingTop="10px"
            alignSelf="start"
          />
          <GridItem
            area="viewer"
            width="100%"
            placeSelf="center"
            minHeight="100%"
            maxWidth="850px"
            overflow="hidden"
          >
            <Box
              background="var(--canvas)"
              padding="0px 0px 20px 0px"
              flexGrow={1}
              w="100%"
              id="viewer-container"
            >
              <DoenetViewer
                doenetML={textEditorDoenetML.current}
                doenetmlVersion={doenetmlVersion.fullVersion}
                flags={{
                  showCorrectness: true,
                  solutionDisplayMode: "button",
                  showFeedback: true,
                  showHints: true,
                  autoSubmit: false,
                  allowLoadState: false,
                  allowSaveState: false,
                  allowLocalState: false,
                  allowSaveEvents: false,
                }}
                attemptNumber={1}
                location={location}
                navigate={navigate}
                linkSettings={{
                  viewURL: "/activityViewer",
                  editURL: "/codeViewer",
                }}
                includeVariantSelector={true}
              />
            </Box>
          </GridItem>
        </Grid>
      )}
    </>
  );
}

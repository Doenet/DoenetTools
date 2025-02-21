import { Box, Grid, GridItem } from "@chakra-ui/react";
import { DoenetEditor, DoenetViewer } from "@doenet/doenetml-iframe";
import React, { useCallback, useEffect, useRef } from "react";
import { AssignmentStatus, DoenetmlVersion } from "../../../_utils/types";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";

export function ActivityDoenetMLEditor({
  doenetML,
  doenetmlVersion,
  assignmentStatus = "Unassigned",
  asViewer,
  docId,
  mode,
  headerHeight,
}: {
  doenetML: string;
  doenetmlVersion: DoenetmlVersion;
  assignmentStatus?: AssignmentStatus;
  asViewer?: boolean;
  docId: string;
  mode: "Edit" | "View";
  headerHeight: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const textEditorDoenetML = useRef(doenetML);
  const savedDoenetML = useRef(doenetML);

  const numVariants = useRef(1);
  const baseComponentCounts = useRef<string>("{}");
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
          docId,
          numVariants: numVariants.current,
          baseComponentCounts: baseComponentCounts.current,
        };
        await axios.post("/api/updateContent/saveDoenetML", params);
        savedDoenetML.current = newDoenetML;
        documentStructureChanged.current = false;
      } catch (error) {
        alert(error.message);
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
  }, [docId]);

  // save draft when leave page
  useEffect(() => {
    return () => {
      handleSaveDoc();
    };
  }, [handleSaveDoc]);

  return (
    <>
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
            if (typeof x.args?.baseComponentCounts === "object") {
              baseComponentCounts.current = JSON.stringify(
                x.args.baseComponentCounts,
              );
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

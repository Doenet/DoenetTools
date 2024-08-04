import React, { useEffect, useRef } from "react";
import {
  useLoaderData,
  useNavigate,
  useLocation,
  useOutletContext,
} from "react-router";

import { DoenetEditor } from "@doenet/doenetml-iframe";

import {
  Button,
  Center,
  Grid,
  GridItem,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { BsPlayBtnFill } from "react-icons/bs";
import { CopyActivityAndReportFinish } from "../ToolPanels/CopyActivityAndReportFinish";
import axios from "axios";
import { ContentStructure, DoenetmlVersion } from "./ActivityEditor";

export async function loader({ params, request }) {
  const url = new URL(request.url);
  const queryParamDoenetML = url.searchParams.get("doenetml");

  if (!params.activityId) {
    return {
      doenetML: queryParamDoenetML,
    };
  }
  const { data: activityData } = await axios.get(
    `/api/getPublicEditorData/${params.activityId}`,
  );

  let docId = Number(params.docId);
  if (!docId) {
    // If docId was not supplied in the url,
    // then use the first docId from the activity.
    // TODO: what happens if activity has no documents?
    docId = activityData.documents[0].id;
  }

  // If docId isn't in the activity, use the first docId
  let docInOrder = activityData.documents.map((x) => x.id).indexOf(docId);
  if (docInOrder === -1) {
    docInOrder = 0;
    docId = activityData.documents[docInOrder].id;
  }

  const doenetML = activityData.documents[docInOrder].source;
  const doenetmlVersion: DoenetmlVersion =
    activityData.documents[docInOrder].doenetmlVersion;

  return {
    activityData,
    doenetML,
    doenetmlVersion,
  };
}

export function PublicEditor() {
  const { doenetML, doenetmlVersion, activityData } = useLoaderData() as {
    doenetML: string;
    doenetmlVersion?: DoenetmlVersion;
    activityData?: ContentStructure;
  };

  const {
    isOpen: copyActivityIsOpen,
    onOpen: copyActivityOnOpen,
    onClose: copyActivityOnClose,
  } = useDisclosure();

  //@ts-ignore
  const { signedIn } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();

  const label = activityData?.name ?? "Public Editor";

  useEffect(() => {
    document.title = `${label} - Doenet`;
  }, [label]);

  return (
    <>
      {activityData ? (
        <CopyActivityAndReportFinish
          isOpen={copyActivityIsOpen}
          onClose={copyActivityOnClose}
          activityData={activityData}
        />
      ) : null}
      <Grid
        background="doenet.lightBlue"
        minHeight="calc(100vh - 40px)" //40px header height
        templateAreas={`"header"
      "centerContent"
      `}
        templateRows="70px auto"
        position="relative"
      >
        <GridItem
          area="header"
          position="fixed"
          height="70px"
          background="doenet.canvas"
          width="100%"
          zIndex="500"
        >
          <>
            <Grid
              templateAreas={`"leftControls label rightControls"`}
              templateColumns="1fr 400px 1fr"
              width="100%"
              height="40px"
            >
              <GridItem area="leftControls">
                <HStack ml="10px" mt="4px">
                  {activityData !== undefined ? (
                    <Button
                      data-test="View Navigation Button"
                      ml="10px"
                      size="sm"
                      variant="outline"
                      leftIcon={<BsPlayBtnFill />}
                      onClick={() => {
                        navigate(`/activityViewer/${activityData.id}`);
                      }}
                    >
                      View
                    </Button>
                  ) : null}
                </HStack>
              </GridItem>
              <GridItem area="label">
                <Text width="400px" mt="8px" textAlign="center">
                  {label}
                </Text>
              </GridItem>
              <GridItem
                area="rightControls"
                display="flex"
                justifyContent="flex-end"
              >
                {/* <HStack mr="10px">
                
                </HStack> */}
              </GridItem>
            </Grid>
            <Center mt="2px" h="30px" background="doenet.mainGray">
              <HStack>
                {/*
                Assume if there is an activity ID, the user is exploring a longer and uneditable community activity. 
                The user should copy the activity into their Activities page to edit.

                Assume if there is no activity ID, the user is exploring a short and editable example and will not be saved.
                */}
                {!activityData ? (
                  <Center background="orange.100" pl="10px" pr="6px">
                    <WarningIcon color="orange.500" mr="6px" />

                    <Text size="xs" pl="4px" pr="4px">
                      Your code is not being saved in this view. Copy to one of
                      your activities to save changes.
                    </Text>
                  </Center>
                ) : (
                  <>
                    <Center background="orange.100" pl="10px" pr="6px">
                      <WarningIcon color="orange.500" mr="6px" />

                      <Text size="xs" pl="4px" pr="4px">
                        Copy to Activities to make your own edits.
                      </Text>
                    </Center>
                    {signedIn ? (
                      <Button
                        data-test="Copy to Activities Button"
                        size="xs"
                        colorScheme="blue"
                        onClick={async () => {
                          copyActivityOnOpen();
                        }}
                      >
                        Copy to Activities
                      </Button>
                    ) : (
                      <Button
                        data-test="Nav to signIn"
                        size="xs"
                        colorScheme="blue"
                        onClick={() => {
                          navigate("/signIn");
                        }}
                      >
                        Sign In To Copy to Activities
                      </Button>
                    )}
                  </>
                )}
              </HStack>
            </Center>
          </>
        </GridItem>

        <GridItem area="centerContent">
          <DoenetEditor
            height={`calc(100vh - 110px)`}
            width="100%"
            doenetML={doenetML}
            readOnly={activityData !== undefined}
            doenetmlVersion={doenetmlVersion?.fullVersion}
            border="none"
          />
        </GridItem>
      </Grid>
    </>
  );
}

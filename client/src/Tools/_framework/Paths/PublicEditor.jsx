import React, { useEffect, useRef } from "react";
import {
  useLoaderData,
  useNavigate,
  useLocation,
  useOutletContext,
} from "react-router";

import { DoenetEditor } from "@doenet/doenetml-iframe";

import { Button, Center, Grid, GridItem, HStack, Text } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { BsPlayBtnFill } from "react-icons/bs";
import axios from "axios";

export async function loader({ params, request }) {
  try {
    const url = new URL(request.url);
    const queryParamDoenetML = url.searchParams.get("doenetml");

    //Win, Mac or Linux
    let platform = "Linux";
    if (navigator.platform.indexOf("Win") != -1) {
      platform = "Win";
    } else if (navigator.platform.indexOf("Mac") != -1) {
      platform = "Mac";
    }

    if (!params.activityId) {
      return {
        platform,
        activityData: { name: "Public Editor" },
        // lastKnownCid,
        doenetML: queryParamDoenetML,
      };
    }
    const { data: activityData } = await axios.get(
      `/api/getActivityEditorData/${params.activityId}`,
    );

    let activityId = Number(params.activityId);
    let docId = Number(params.docId);
    if (!docId) {
      // If docId was not supplied in the url,
      // then use the first docId from the activity.
      // TODO: what happens if activity has no documents?
      docId = activityData.documents[0].docId;
    }

    // If docId isn't in the activity, use the first docId
    let docInOrder = activityData.documents.map((x) => x.docId).indexOf(docId);
    if (docInOrder === -1) {
      docInOrder = 0;
      docId = activityData.documents[docInOrder].docId;
    }

    const doenetML = activityData.documents[docInOrder].content;
    const doenetmlVersion =
      activityData.documents[docInOrder].doenetmlVersion.fullVersion;

    const supportingFileResp = await axios.get(
      `/api/loadSupportingFileInfo/${params.activityId}`,
    );

    let supportingFileData = supportingFileResp.data;

    return {
      activityData,
      docId,
      doenetML,
      doenetmlVersion,
      activityId,
      supportingFileData,
    };
  } catch (e) {
    return { success: false, message: e.response.data.message };
  }
}

export function PublicEditor() {
  const { activityId, doenetML, doenetmlVersion, docId, activityData } =
    useLoaderData();

  const { signedIn } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();

  let navigateTo = useRef("");

  if (navigateTo.current != "") {
    const newHref = navigateTo.current;
    navigateTo.current = "";
    location.href = newHref;
  }

  useEffect(() => {
    document.title = `${activityData.name} - Doenet`;
  }, [activityData.name]);

  return (
    <>
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
                  <Button
                    data-test="View Navigation Button"
                    ml="10px"
                    size="sm"
                    variant="outline"
                    leftIcon={<BsPlayBtnFill />}
                    onClick={() => {
                      navigate(`/activityViewer/${activityId}`);
                    }}
                  >
                    View
                  </Button>
                </HStack>
              </GridItem>
              <GridItem area="label">
                <Text width="400px" mt="8px" textAlign="center">
                  {activityData.name}
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
                {!activityId ? (
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
                          let { data } = await axios.post(
                            `/api/duplicateActivity`,
                            {
                              activityId,
                            },
                          );
                          const { newActivityId } = data;

                          // TODO: do not navigate to editor
                          // Instead, navigate to Activities page with newly created activity highlighted
                          navigate(`/activityEditor/${newActivityId}`);
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
                          navigateTo.current = "/signIn";
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
            readOnly={Boolean(activityId)}
            doenetmlVersion={doenetmlVersion}
            border="none"
          />
        </GridItem>
      </Grid>
    </>
  );
}

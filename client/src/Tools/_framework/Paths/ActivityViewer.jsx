import React, { useEffect, useRef } from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useLocation,
} from "react-router";
import styled from "styled-components";
import { DoenetViewer } from "@doenet/doenetml-iframe";

import { checkIfUserClearedOut } from "../../../_utils/applicationUtils";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import ContributorsMenu from "../ChakraBasedComponents/ContributorsMenu";
import { useFetcher } from "react-router-dom";

export async function action({ params, request }) {
  // TODO: it is confusing that the one "action" of this viewer is to duplicate.

  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  if (formObj._action == "copy to activities") {
    let { data } = await axios.post(`/api/duplicateActivity`, {
      activityId: Number(params.activityId),
    });

    const { newActivityId } = data;

    // TODO: do not navigate to editor
    // Instead, navigate to activities with newly created activity highlighted
    return redirect(`/activityEditor/${newActivityId}`);
  } else if (formObj?._action == "create assignment") {
    const { data } = await axios.post(`/api/assignActivity`, {
      activityId: Number(params.activityId),
    });
    return redirect(`/assignments`);
  }

  return null;
}

export async function loader({ params }) {
  //Check if signedIn
  const profileInfo = await checkIfUserClearedOut();
  let signedIn = true;
  if (profileInfo.cookieRemoved) {
    signedIn = false;
  }
  try {
    const { data: activityData } = await axios.get(
      `/api/getActivityView/${params.activityId}`,
    );

    let activityId = Number(params.activityId);
    let docId = Number(params.docId);
    if (!docId) {
      // If docId was not supplied in the url,
      // then use the first docId from the activity.
      // TODO: what happens if activity has no documents?
      docId = activityData.activity.documents[0].docId;
    }

    const doenetML = activityData.activity.documents[0].content;

    return {
      activityId,
      doenetML,
      signedIn,
      name: activityData.activity.name,
      owner: activityData.activity.owner,
      contributorHistory: activityData.doc.contributorHistory,
      docId,
      doenetmlVersion:
        activityData.activity.documents[0].doenetmlVersion.fullVersion,
    };
  } catch (e) {
    if (e.response.status === 404) {
      throw Error("Activity not found");
    } else {
      throw e;
    }
  }
}

const HeaderSectionRight = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export function ActivityViewer() {
  const {
    doenetML,
    signedIn,
    name,
    activityId,
    docId,
    owner,
    contributorHistory,
    doenetmlVersion,
  } = useLoaderData();

  const fetcher = useFetcher();

  const navigate = useNavigate();
  const location = useLocation();

  let navigateTo = useRef("");

  if (navigateTo.current != "") {
    const newHref = navigateTo.current;
    navigateTo.current = "";
    location.href = newHref;
  }

  useEffect(() => {
    document.title = `${name} - Doenet`;
  }, [name]);

  return (
    <>
      <VStack spacing={0}>
        <Flex
          background="doenet.lightBlue"
          alignItems="center"
          width="100%"
          direction="column"
        >
          <Grid
            templateAreas={`"header"
      "centerContent"
      `}
            templateRows="100px calc(100% - 100px)"
            width="100%"
            maxWidth="850px"
          >
            <GridItem area="header" height="100px" background="doenet.mainGray">
              <Grid
                width="100%"
                height="100px"
                templateAreas={`"leftHeader headerContent rightHeader"`}
                templateColumns={`1fr minmax(100px,800px) 1fr`}
                background="doenet.mainGray"
              >
                <GridItem
                  area="leftHeader"
                  paddingLeft="10px"
                  background="doenet.mainGray"
                ></GridItem>
                <GridItem
                  area="rightHeader"
                  paddingRight="10px"
                  background="doenet.mainGray"
                ></GridItem>
                <GridItem area="headerContent" maxWidth="800px" width="100%">
                  <Flex justifyContent="space-between">
                    <Flex
                      flexDirection="column"
                      alignItems="flex-start"
                      mt="10px"
                    >
                      <Text
                        fontSize="1.4em"
                        fontWeight="bold"
                        maxWidth="500px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                      >
                        {name}
                      </Text>
                      <Box mt="10px">
                        <ContributorsMenu
                          owner={owner}
                          contributorHistory={contributorHistory}
                        />
                      </Box>
                    </Flex>
                    <VStack mt="20px" alignItems="flex-end" spacing="4">
                      <Button
                        size="xs"
                        colorScheme="blue"
                        data-test="See Inside"
                        onClick={() => {
                          navigate(`/publicEditor/${activityId}/${docId}`);
                        }}
                      >
                        See Inside
                      </Button>
                      {signedIn ? (
                        <HeaderSectionRight>
                          <Button
                            data-test="Copy to Activities Button"
                            size="xs"
                            colorScheme="blue"
                            marginRight="10px"
                            onClick={() => {
                              fetcher.submit(
                                {
                                  _action: "copy to activities",
                                },
                                { method: "post" },
                              );
                            }}
                          >
                            Copy to Activities
                          </Button>

                          <Button
                            data-test="Create Assignment"
                            size="xs"
                            colorScheme="blue"
                            onClick={() => {
                              fetcher.submit(
                                {
                                  _action: "create assignment",
                                },
                                { method: "post" },
                              );
                            }}
                          >
                            Create Assignment
                          </Button>
                        </HeaderSectionRight>
                      ) : (
                        <Button
                          dataTest="Nav to signIn"
                          colorScheme="blue"
                          size="xs"
                          onClick={() => {
                            navigateTo.current = "/signIn";
                          }}
                        >
                          Sign In To Copy to Activities
                        </Button>
                      )}
                    </VStack>
                  </Flex>
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem area="centerContent">
              <Box
                background="var(--canvas)"
                borderWidth="1px"
                borderStyle="solid"
                borderColor="doenet.mediumGray"
                width="100%"
                height="100%"
              >
                <DoenetViewer
                  key={`HPpageViewer`}
                  doenetML={doenetML}
                  doenetmlVersion={doenetmlVersion}
                  // cid={"bafkreibfz6m6pt4vmwlch7ok5y5qjyksomidk5f2vn2chuj4qqeqnrfrfe"}
                  flags={{
                    showCorrectness: true,
                    solutionDisplayMode: "button",
                    showFeedback: true,
                    showHints: true,
                    autoSubmit: false,
                    allowLoadState: false,
                    allowSaveState: false,
                    allowLocalState: false,
                    allowSaveSubmissions: false,
                    allowSaveEvents: false,
                  }}
                  attemptNumber={1}
                  idsIncludeActivityId={false}
                  // setIsInErrorState={setIsInErrorState}
                  location={location}
                  navigate={navigate}
                  linkSettings={{
                    viewURL: "/activityViewer",
                    editURL: "/publicEditor",
                  }}
                  includeVariantSelector={true}
                />
              </Box>
            </GridItem>
          </Grid>
        </Flex>
        <Box
          width="100%"
          height="50vh"
          background="doenet.lightBlue"
          padding="0px"
          margin="0px"
        />
      </VStack>
    </>
  );
}

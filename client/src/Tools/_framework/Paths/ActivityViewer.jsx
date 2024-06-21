import React, { useEffect, useRef, useState } from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useLocation,
} from "react-router";
import styled from "styled-components";
import { DoenetMLIframe } from "@doenet/doenetml-iframe";

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
import VariantSelect from "../ChakraBasedComponents/VariantSelect";
import ContributorsMenu from "../ChakraBasedComponents/ContributorsMenu";
import { useFetcher } from "react-router-dom";

export async function action({ params, request }) {
  // TODO: it is confusing that the one "action" of this viewer is to duplicate.

  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);

  if (formObj._action == "copy to portfolio") {
    let { data } = await axios.post(`/api/duplicateActivity`, {
      activityId: Number(params.activityId),
    });

    const { newActivityId } = data;

    // TODO: do not navigate to editor
    // Instead, navigate to portfolio with newly created activity highlighted
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
      doenetmlVersion: activityData.doc.doenetmlVersion.fullVersion,
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
  margin: 5px;
  height: 30px;
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

  const [variants, setVariants] = useState({
    index: 1,
    numVariants: 1,
    allPossibleVariants: ["a"],
  });

  return (
    <>
      <Grid
        background="doenet.lightBlue"
        minHeight="calc(100vh - 40px)" //40px header height
        templateAreas={`"header header header"
      "leftGutter centerContent rightGutter"
      `}
        templateRows="100px auto"
        templateColumns=".06fr 1fr .06fr"
        position="relative"
      >
        <GridItem
          area="header"
          height="100px"
          zIndex="500"
          background="doenet.mainGray"
        >
          <Grid
            width="100%"
            height="100px"
            templateAreas={`"leftHeader headerContent rightHeader"`}
            templateColumns={`1fr minmax(400px,800px) 1fr`}
            overflow="hidden"
            background="doenet.mainGray"
          >
            <GridItem area="leftHeader" background="doenet.mainGray"></GridItem>
            <GridItem
              area="rightHeader"
              background="doenet.mainGray"
            ></GridItem>
            <GridItem
              area="rightHeader"
              background="doenet.mainGray"
            ></GridItem>
            <GridItem area="headerContent" maxWidth="800px" width="100%">
              <Flex justifyContent="space-between">
                <Flex flexDirection="column" alignItems="flex-start" mt="10px">
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
                        data-test="Copy to Portfolio Button"
                        size="xs"
                        colorScheme="blue"
                        onClick={() => {
                          fetcher.submit(
                            {
                              _action: "copy to portfolio",
                            },
                            { method: "post" },
                          );
                        }}
                      >
                        Copy to Portfolio
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
                      Sign In To Copy to Portfolio
                    </Button>
                  )}
                </VStack>
              </Flex>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem area="leftGutter" background="doenet.lightBlue"></GridItem>
        <GridItem area="rightGutter" background="doenet.lightBlue"></GridItem>
        <GridItem area="centerContent">
          <Grid
            width="100%"
            height="calc(100vh - 140px)"
            templateAreas={`"leftViewer viewer rightViewer"`}
            templateColumns={`1fr minmax(400px,850px) 1fr`}
            overflow="hidden"
          >
            <GridItem
              area="leftViewer"
              background="doenet.lightBlue"
              width="100%"
              paddingTop="10px"
              alignSelf="start"
            ></GridItem>
            <GridItem
              area="rightViewer"
              background="doenet.lightBlue"
              width="100%"
              paddingTop="10px"
              alignSelf="start"
            />

            <GridItem
              area="viewer"
              width="100%"
              maxWidth="850px"
              placeSelf="center"
              minHeight="100%"
              overflow="hidden"
            >
              <VStack
                margin="10px 0px 10px 0px" //Only need when there is an outline
                height="calc(100vh - 160px)" //40px header height
                spacing={0}
                width="100%"
              >
                {variants.numVariants > 1 && (
                  <Box bg="doenet.lightBlue" h="32px" width="100%">
                    <VariantSelect
                      size="sm"
                      menuWidth="140px"
                      array={variants.allPossibleVariants}
                      onChange={(index) =>
                        setVariants((prev) => {
                          let next = { ...prev };
                          next.index = index + 1;
                          return next;
                        })
                      }
                    />
                  </Box>
                )}
                <Box
                  h={
                    variants.numVariants > 1
                      ? "calc(100vh - 192px)"
                      : "calc(100vh - 160px)"
                  }
                  background="var(--canvas)"
                  borderWidth="1px"
                  borderStyle="solid"
                  borderColor="doenet.mediumGray"
                  width="100%"
                  overflow="scroll"
                >
                  <DoenetMLIframe
                    key={`HPpageViewer`}
                    doenetML={doenetML}
                    standaloneUrl={`https://cdn.jsdelivr.net/npm/@doenet/standalone@${doenetmlVersion}/doenet-standalone.js`}
                    cssUrl={`https://cdn.jsdelivr.net/npm/@doenet/standalone@${doenetmlVersion}/style.css`}
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
                    generatedVariantCallback={setVariants}
                    requestedVariantIndex={variants.index}
                    // setIsInErrorState={setIsInErrorState}
                    location={location}
                    navigate={navigate}
                    linkSettings={{
                      viewURL: "/activityViewer",
                      editURL: "/publicEditor",
                    }}
                  />
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </>
  );
}

import React, { useEffect, useRef, useState } from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useLocation,
} from "react-router";
import styled from "styled-components";
import { DoenetML } from "../../../Viewer/DoenetML";

import { useRecoilState } from "recoil";
import { checkIfUserClearedOut } from "../../../_utils/applicationUtils";
import { Form } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import { pageToolViewAtom } from "../NewToolRoot";
import axios from "axios";
import VariantSelect from "../ChakraBasedComponents/VariantSelect";
import findFirstPageIdInContent from "../../../_utils/findFirstPage";
import ContributorsMenu from "../ChakraBasedComponents/ContributorsMenu";

export async function action({ params }) {
  let { data } = await axios.get(
    `/api/duplicatePortfolioActivity.php?doenetId=${params.doenetId}`,
  );

  const { nextActivityDoenetId, nextPageDoenetId } = data;
  return redirect(
    `/portfolioeditor/${nextActivityDoenetId}?tool=editor&doenetId=${nextActivityDoenetId}&pageId=${nextPageDoenetId}`,
  );
}

export async function loader({ params }) {
  //Check if signedIn
  const profileInfo = await checkIfUserClearedOut();
  let signedIn = true;
  if (profileInfo.cookieRemoved) {
    signedIn = false;
  }
  try {
    const { data } = await axios.get(
      `/api/getPortfolioActivityView.php?doenetId=${params.doenetId}`,
    );

    return {
      success: true,
      doenetId: params.doenetId,
      doenetML: data.content,
      signedIn,
      label: data.label,
      contributors: data.contributors,
      pageDoenetId: params.doenetId,
    };
  } catch (e) {
    return { success: false, message: e.response.data.message };
  }
}

const HeaderSectionRight = styled.div`
  margin: 5px;
  height: 30px;
  display: flex;
  justify-content: flex-end;
`;

export function PortfolioActivityViewer() {
  const {
    success,
    message,
    doenetML,
    signedIn,
    label,
    doenetId,
    pageDoenetId,
    contributors,
  } = useLoaderData();

  if (!success) {
    throw new Error(message);
  }

  const navigate = useNavigate();
  const location = useLocation();

  const [recoilPageToolView, setRecoilPageToolView] =
    useRecoilState(pageToolViewAtom);

  let navigateTo = useRef("");

  if (navigateTo.current != "") {
    const newHref = navigateTo.current;
    navigateTo.current = "";
    location.href = newHref;
  }

  useEffect(() => {
    document.title = `${label} - Doenet`;
  }, [label]);

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
                    {label}
                  </Text>
                  <Box mt="10px">
                    <ContributorsMenu contributors={contributors} />
                  </Box>
                </Flex>
                <VStack mt="20px" alignItems="flex-end" spacing="4">
                  <Button
                    size="xs"
                    colorScheme="blue"
                    data-test="See Inside"
                    onClick={() => {
                      navigate(`/publiceditor/${doenetId}/${pageDoenetId}`);
                    }}
                  >
                    See Inside
                  </Button>
                  {signedIn ? (
                    <HeaderSectionRight>
                      <Form method="post">
                        <Button
                          data-test="Remix Button"
                          size="xs"
                          colorScheme="blue"
                          type="submit"
                        >
                          Remix
                        </Button>
                      </Form>
                    </HeaderSectionRight>
                  ) : (
                    <Button
                      dataTest="Nav to signin"
                      colorScheme="blue"
                      size="xs"
                      onClick={() => {
                        navigateTo.current = "/signin";
                        setRecoilPageToolView({
                          page: "signin",
                          tool: "",
                          view: "",
                          params: {},
                        });
                      }}
                    >
                      Sign In To Remix
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
                  <DoenetML
                    key={`HPpageViewer`}
                    doenetML={doenetML}
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
                    // doenetId={doenetId}
                    attemptNumber={1}
                    idsIncludeActivityId={false}
                    generatedVariantCallback={setVariants}
                    requestedVariantIndex={variants.index}
                    // setIsInErrorState={setIsInErrorState}
                    location={location}
                    navigate={navigate}
                    linkSettings={{
                      viewURL: "/portfolioviewer",
                      editURL: "/publiceditor",
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

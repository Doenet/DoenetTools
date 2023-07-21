import React, { useEffect, useRef, useState } from "react";
import { redirect, useLoaderData, useNavigate } from "react-router";
import styled from "styled-components";
import PageViewer from "../../../Viewer/PageViewer";

import { useRecoilState } from "recoil";
import { checkIfUserClearedOut } from "../../../_utils/applicationUtils";
import { Link } from "react-router-dom";
import {
  Avatar,
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
import VirtualKeyboard from "../Footers/VirtualKeyboard";
import { findFirstPageOfActivity } from "../../../_reactComponents/Course/CourseActions";
import VariantSelect from "../ChakraBasedComponents/VariantSelect";

export async function action({ params }) {
  let response = await fetch(
    `/api/duplicatePortfolioActivity.php?doenetId=${params.doenetId}`,
  );
  let respObj = await response.json();

  const { nextActivityDoenetId, nextPageDoenetId } = respObj;
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

    // const doenetMLResponse = await fetch(`/media/byPageId/${data.pageDoenetId}.doenet`);
    // const doenetML = await doenetMLResponse.text();

    const cidResponse = await fetch(`/media/${data.json.assignedCid}.doenet`);
    const activityML = await cidResponse.text();

    //Find the first page's doenetML
    const regex = /<page\s+cid="(\w+)"\s+(label="[^"]+"\s+)?\/>/;
    const pageIds = activityML.match(regex);

    let firstPage = findFirstPageOfActivity(data.json.content);

    const doenetMLResponse = await fetch(`/media/${pageIds[1]}.doenet`);
    const doenetML = await doenetMLResponse.text();

    return {
      success: true,
      doenetId: params.doenetId,
      doenetML,
      signedIn,
      label: data.label,
      contributors: data.contributors,
      pageDoenetId: firstPage,
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

  const fullName = `${contributors[0].firstName} ${contributors[0].lastName}`;
  const { courseId, isUserPortfolio, courseLabel, courseImage, courseColor } =
    contributors[0];

  const navigate = useNavigate();

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
    allPossibleVariants: ["a"],
  });

  let variantOptions = [];
  variants.allPossibleVariants.forEach((variant) => {
    variantOptions.push({ value: variant, label: variant });
  });

  function variantCallback(generatedVariantInfo, allPossibleVariants) {
    // console.log(">>>variantCallback",generatedVariantInfo,allPossibleVariants)
    const cleanGeneratedVariant = JSON.parse(
      JSON.stringify(generatedVariantInfo),
    );
    setVariants({
      index: cleanGeneratedVariant.index,
      allPossibleVariants,
    });
  }

  return (
    <>
      <VirtualKeyboard />
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
                <VStack mt="10px" alignItems="flex-start">
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

                  <Link
                    data-test="Avatar Link"
                    style={{
                      textDecoration: "none",
                      color: "black",
                      position: "relative",
                      justifySelf: "flex-start",
                    }}
                    to={`/publicportfolio/${courseId}`}
                  >
                    {isUserPortfolio == "1" ? (
                      <>
                        <Avatar size="sm" name={fullName} />
                        <Text
                          fontSize="13px"
                          // fontSize="13pt"
                          position="absolute"
                          left="36px"
                          top="6px"
                          width="400px"
                        >
                          By {fullName}
                        </Text>
                      </>
                    ) : (
                      <>
                        {courseColor == "none" ? (
                          <Avatar
                            size="sm"
                            borderRadius="md"
                            src={`/drive_pictures/${courseImage}`}
                          />
                        ) : (
                          <Avatar
                            size="sm"
                            borderRadius="md"
                            bg={`#${courseColor}`}
                            icon={<></>}
                          />
                        )}

                        <Text
                          fontSize="13px"
                          // fontSize="13pt"
                          position="absolute"
                          left="36px"
                          top="6px"
                          width="400px"
                        >
                          In {courseLabel}
                        </Text>
                      </>
                    )}
                  </Link>
                </VStack>
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
                      <Button
                        data-test="Remix Button"
                        size="xs"
                        colorScheme="blue"
                        onClick={async () => {
                          let resp = await axios.get(
                            `/api/duplicatePortfolioActivity.php?doenetId=${doenetId}`,
                          );
                          const { nextActivityDoenetId, nextPageDoenetId } =
                            resp.data;

                          navigate(
                            `/portfolioeditor/${nextActivityDoenetId}/${nextPageDoenetId}`,
                          );
                        }}
                      >
                        Remix
                      </Button>
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
                {variants.allPossibleVariants.length > 1 && (
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
                    variants.allPossibleVariants.length > 1
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
                  <PageViewer
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
                    generatedVariantCallback={variantCallback} //TODO:Replace
                    requestedVariantIndex={variants.index}
                    // setIsInErrorState={setIsInErrorState}
                    pageIsActive={true}
                  />
                </Box>
                <Box marginBottom="50vh" />
              </VStack>
              {/* <Box
                height="calc(100vh - 160px)" //Has a menu on the viewer
                // height="calc(100vh - 160px)" //40px header height
                background="var(--canvas)"
                borderWidth="1px"
                borderStyle="solid"
                borderColor="doenet.mediumGray"
                margin="10px 0px 10px 0px" //Only need when there is an outline
                padding="20px 5px 20px 5px"
                overflow="scroll"
              >
                <>
                  <PageViewer
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
                    generatedVariantCallback={variantCallback} //TODO:Replace
                    requestedVariantIndex={variantInfo.index}
                    // setIsInErrorState={setIsInErrorState}
                    pageIsActive={true}
                  />
                  <Box marginBottom="50vh" />
                </>
              </Box> */}
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </>
  );
}

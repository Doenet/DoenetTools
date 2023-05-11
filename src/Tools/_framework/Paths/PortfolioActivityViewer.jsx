import React, { useRef } from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  // useOutletContext,
} from "react-router";
import styled from "styled-components";
// import Button from "../../../_reactComponents/PanelHeaderComponents/Button";
import PageViewer from "../../../Viewer/PageViewer";
import {
  pageVariantInfoAtom,
  pageVariantPanelAtom,
} from "../../../_sharedRecoil/PageViewerRecoil";
import { useRecoilState, useSetRecoilState } from "recoil";
import { checkIfUserClearedOut } from "../../../_utils/applicationUtils";
import { Link } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { pageToolViewAtom } from "../NewToolRoot";

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
  const response = await fetch(
    `/api/getPortfolioActivityView.php?doenetId=${params.doenetId}`,
  );
  const data = await response.json();

  // const doenetMLResponse = await fetch(`/media/byPageId/${data.pageDoenetId}.doenet`);
  // const doenetML = await doenetMLResponse.text();

  const cidResponse = await fetch(`/media/${data.json.assignedCid}.doenet`);
  const activityML = await cidResponse.text();

  //Find the first page's doenetML
  const regex = /<page\s+cid="(\w+)"\s+(label="[^"]+"\s+)?\/>/;
  const pageIds = activityML.match(regex);

  const doenetMLResponse = await fetch(`/media/${pageIds[1]}.doenet`);
  const doenetML = await doenetMLResponse.text();

  return {
    doenetML,
    signedIn,
    label: data.label,
    fullName: data.firstName + " " + data.lastName,
    courseId: data.courseId,
    doenetId: params.doenetId,
    pageDoenetId: data.pageDoenetId,
  };
}

const HeaderSectionRight = styled.div`
  margin: 5px;
  height: 30px;
  display: flex;
  justify-content: flex-end;
`;

export function PortfolioActivityViewer() {
  const {
    doenetML,
    signedIn,
    label,
    fullName,
    courseId,
    doenetId,
    pageDoenetId,
  } = useLoaderData();

  const navigate = useNavigate();
  // const setPageToolView = useSetRecoilState(pageToolViewAtom);

  const setVariantPanel = useSetRecoilState(pageVariantPanelAtom);
  const [variantInfo, setVariantInfo] = useRecoilState(pageVariantInfoAtom);

  const [recoilPageToolView, setRecoilPageToolView] =
    useRecoilState(pageToolViewAtom);

  let navigateTo = useRef("");

  if (navigateTo.current != "") {
    const newHref = navigateTo.current;
    navigateTo.current = "";
    location.href = newHref;
  }

  function variantCallback(generatedVariantInfo, allPossibleVariants) {
    // console.log(">>>variantCallback",generatedVariantInfo,allPossibleVariants)
    const cleanGeneratedVariant = JSON.parse(
      JSON.stringify(generatedVariantInfo),
    );
    setVariantPanel({
      index: cleanGeneratedVariant.index,
      allPossibleVariants,
    });
    setVariantInfo({
      index: cleanGeneratedVariant.index,
    });
  }

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
                <VStack mt="10px" alignItems="flex-start">
                  <Text
                    fontSize="1.4em"
                    font-weight="bold"
                    max-width="500px"
                    overflow="hidden"
                    text-overflow="ellipsis"
                    white-space="nowrap"
                  >
                    {label}
                  </Text>
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "black",
                      position: "relative",
                      justifySelf: "flex-start",
                    }}
                    to={`/publicportfolio/${courseId}`}
                  >
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
                  </Link>
                </VStack>
                <VStack mt="20px" alignItems="flex-end" spacing="4">
                  <Button
                    size="xs"
                    onClick={() => {
                      navigate(`/publiceditor/${doenetId}/${pageDoenetId}`);
                    }}
                  >
                    See Inside
                  </Button>
                  {signedIn ? (
                    <HeaderSectionRight>
                      <Button
                        size="xs"
                        onClick={async () => {
                          let response = await fetch(
                            `/api/duplicatePortfolioActivity.php?doenetId=${doenetId}`,
                          );

                          if (response.ok) {
                            let { nextActivityDoenetId, nextPageDoenetId } =
                              await response.json();
                            navigateTo.current = `/portfolioeditor/${nextActivityDoenetId}?tool=editor&doenetId=${nextActivityDoenetId}&pageId=${nextPageDoenetId}`;
                            setRecoilPageToolView({
                              page: "portfolioeditor",
                              tool: "editor",
                              view: "",
                              params: {
                                doenetId: nextActivityDoenetId,
                                pageId: nextPageDoenetId,
                              },
                            });
                          } else {
                            throw Error(response.message);
                          }
                        }}
                      >
                        Remix
                      </Button>
                    </HeaderSectionRight>
                  ) : (
                    <Button
                      dataTest="Nav to signin"
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
              <Box
                height="calc(100vh - 160px)" //40px header height
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
                      solutionDisplayMode: true,
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
              </Box>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </>
  );
}

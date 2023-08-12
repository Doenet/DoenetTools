import React, { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import CodeMirror from "../CodeMirror";

import PageViewer from "../../../Viewer/PageViewer";

import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { BsGripVertical } from "react-icons/bs";
import axios from "axios";
import { cidFromText } from "../../../Core/utils/cid";
// import Select from "react-select";
import VirtualKeyboard from "../Footers/VirtualKeyboard";
import VariantSelect from "../ChakraBasedComponents/VariantSelect";
import ErrorWarningPopovers from "../ChakraBasedComponents/ErrorWarningPopovers";

export async function loader({ params }) {
  const doenetId = params.doenetId;
  try {
    const { data } = await axios.get("/api/getLinkPageData.php", {
      params: { doenetId: doenetId },
    });
    const label = data.label;
    const courseId = data.courseId;

    //Get the doenetML of the pageId.
    //we need transformResponse because
    //large numbers are simplified with toString if used on doenetMLResponse.data
    //which was causing errors
    const doenetMLResponse = await axios.get(
      `/media/byPageId/${doenetId}.doenet`,
      { transformResponse: (data) => data.toString() },
    );
    let doenetML = doenetMLResponse.data;
    const lastKnownCid = await cidFromText(doenetML);

    return {
      label,
      courseId,
      lastKnownCid,
      doenetML,
      doenetId,
    };
  } catch (e) {
    throw new Error(e);
  }
}

export function CourseLinkPageViewer() {
  const { label, courseId, lastKnownCid, doenetML, doenetId } = useLoaderData();

  const [errorsAndWarnings, setErrorsAndWarningsCallback] = useState({
    errors: [],
    warnings: [],
  });

  const warningsLevel = 1; //TODO: eventually give user ability adjust warning level filter
  const warningsObjs = errorsAndWarnings.warnings.filter(
    (w) => w.level <= warningsLevel,
  );
  const errorsObjs = [...errorsAndWarnings.errors];

  let editorRef = useRef(null);

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
        templateRows="40px auto"
        templateColumns=".06fr 1fr .06fr"
        position="relative"
      >
        <GridItem area="leftGutter" background="doenet.lightBlue"></GridItem>
        <GridItem area="rightGutter" background="doenet.lightBlue"></GridItem>
        <GridItem
          area="header"
          position="fixed"
          height="40px"
          background="doenet.canvas"
          width="100%"
          zIndex="500"
        >
          <Grid
            templateAreas={`"leftControls label rightControls"`}
            templateColumns="1fr 400px 1fr"
            width="100%"
          >
            <GridItem area="leftControls"></GridItem>
            <GridItem area="label">
              <Center mt="6px">
                <Text>READ ONLY! Page Link: {label}</Text>
              </Center>
            </GridItem>
            <GridItem
              area="rightControls"
              display="flex"
              justifyContent="flex-end"
            >
              <HStack mr="10px"></HStack>
            </GridItem>
          </Grid>
        </GridItem>

        <GridItem area="centerContent">
          <ResizeableSideBySide
            left={
              <>
                <VStack spacing={0}>
                  <HStack
                    w="100%"
                    h="32px"
                    bg="doenet.lightBlue"
                    margin="10px 0px 0px 0px" //Only need when there is an outline
                  >
                    {variants.allPossibleVariants.length > 1 && (
                      <Box bg="doenet.lightBlue" h="32px" width="100%">
                        <VariantSelect
                          size="sm"
                          menuWidth="140px"
                          array={variants.allPossibleVariants}
                          syncIndex={variants.index}
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
                  </HStack>

                  <Box
                    height={`calc(100vh - 132px)`}
                    background="var(--canvas)"
                    borderWidth="1px"
                    borderStyle="solid"
                    borderColor="doenet.mediumGray"
                    padding="20px 5px 20px 5px"
                    flexGrow={1}
                    overflow="scroll"
                    w="100%"
                  >
                    <>
                      <PageViewer
                        doenetML={doenetML}
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
                        generatedVariantCallback={variantCallback} //TODO:Replace
                        requestedVariantIndex={variants.index}
                        // setIsInErrorState={setIsInErrorState}
                        setErrorsAndWarningsCallback={
                          setErrorsAndWarningsCallback
                        }
                        pageIsActive={true}
                      />
                      <Box marginBottom="50vh" />
                    </>
                  </Box>
                </VStack>
              </>
            }
            right={
              <VStack spacing={0}>
                <Box
                  w="100%"
                  h="32px"
                  bg="doenet.lightBlue"
                  margin={0} //Only need when there is an outline
                  justifyContent="flex-end"
                ></Box>

                <Box
                  top="50px"
                  boxSizing="border-box"
                  background="doenet.canvas"
                  height={`calc(100vh - 132px)`}
                  overflowY="scroll"
                  borderRight="solid 1px"
                  borderTop="solid 1px"
                  borderBottom="solid 1px"
                  borderColor="doenet.mediumGray"
                  w="100%"
                >
                  <Box
                    height={`calc(100vh - 166px)`}
                    w="100%"
                    overflow="scroll"
                  >
                    <CodeMirror
                      editorRef={editorRef}
                      setInternalValueTo={doenetML}
                      readOnly={true}
                    />
                  </Box>

                  <Box bg="doenet.mainGray" h="32px" w="100%">
                    <Flex
                      ml="0px"
                      h="32px"
                      bg="doenet.mainGray"
                      pl="10px"
                      pt="1px"
                    >
                      <ErrorWarningPopovers
                        warningsObjs={warningsObjs}
                        errorsObjs={errorsObjs}
                      />
                    </Flex>
                  </Box>
                </Box>
              </VStack>
            }
          />
        </GridItem>
      </Grid>
    </>
  );
}

const clamp = (
  value,
  min = Number.POSITIVE_INFINITY,
  max = Number.NEGATIVE_INFINITY,
) => {
  return Math.min(Math.max(value, min), max);
};

const ResizeableSideBySide = ({
  left,
  right,
  centerWidth = "10px",
  headerHeight = 80,
}) => {
  const wrapperRef = useRef();

  useEffect(() => {
    wrapperRef.current.handleClicked = false;
    wrapperRef.current.handleDragged = false;
  }, []);

  const onMouseDown = (event) => {
    event.preventDefault();
    wrapperRef.current.handleClicked = true;
  };

  const onMouseMove = (event) => {
    //TODO: minimum movment calc
    if (wrapperRef.current.handleClicked) {
      event.preventDefault();
      wrapperRef.current.handleDragged = true;

      let proportion = clamp(
        (event.clientX - wrapperRef.current.offsetLeft) /
          wrapperRef.current.clientWidth,
        0.18,
        1,
      );

      //using a ref to save without react refresh
      wrapperRef.current.style.gridTemplateColumns = `${proportion}fr ${centerWidth} ${
        1 - proportion
      }fr`;
      wrapperRef.current.proportion = proportion;
    }
  };

  const onMouseUp = () => {
    if (wrapperRef.current.handleClicked) {
      wrapperRef.current.handleClicked = false;
      if (wrapperRef.current.handleDragged) {
        wrapperRef.current.handleDragged = false;
      }
    }
  };

  return (
    <Grid
      width="100%"
      height={`calc(100vh - ${headerHeight}px)`}
      templateAreas={`"viewer middleGutter textEditor"`}
      templateColumns={`.5fr ${centerWidth} .5fr`}
      overflow="hidden"
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseUp}
      ref={wrapperRef}
    >
      <GridItem
        area="viewer"
        width="100%"
        placeSelf="center"
        height="100%"
        maxWidth="850px"
        overflow="hidden"
      >
        {left}
      </GridItem>
      <GridItem
        area="middleGutter"
        background="doenet.lightBlue"
        width="100%"
        height="100%"
        paddingTop="42px"
        alignSelf="start"
      >
        <Center
          cursor="col-resize"
          background="doenet.mainGray"
          borderLeft="solid 1px"
          borderTop="solid 1px"
          borderBottom="solid 1px"
          borderColor="doenet.mediumGray"
          height={`calc(100vh - ${headerHeight + 52}px)`}
          width="10px"
          onMouseDown={onMouseDown}
          data-test="contentPanelDragHandle"
          paddingLeft="1px"
        >
          <Icon ml="0" as={BsGripVertical} />
        </Center>
      </GridItem>
      <GridItem
        area="textEditor"
        width="100%"
        background="doenet.lightBlue"
        alignSelf="start"
        paddingTop="10px"
      >
        {right}
      </GridItem>
    </Grid>
  );
};
